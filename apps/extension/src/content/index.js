import "@/content/content.css";
import { analyzeText } from "@/content/detector/classifier";
import { updateGroomingScore } from "@/content/detector/grooming-score";
import { getSelectorsForPlatform } from "@/content/detector/selectors-by-platform";
import { TOXIC_WRITING_PATTERNS } from "@/content/detector/rules/toxic-writing-rules";
import { createWarningBanner } from "@/content/ui/warning-banner";
import {
  removeRewriteSuggestion,
  showRewriteSuggestion,
} from "@/content/ui/rewrite-banner";
import { downloadEvidencePdf } from "@/shared/evidence";
import { sha256WithFallback } from "@/shared/hash";
import { detectPlatform } from "@/shared/platform";
import {
  getGroomingHistory,
  getSettings,
  setGroomingHistory,
} from "@/shared/storage";

const platform = detectPlatform(location.hostname);

let settings = {
  alertEmail: "",
  emailNotifications: true,
  autoHideDangerous: true,
  rewriteSuggestions: true,
  protectionEnabled: true,
  groomingDetection: true,
};

let groomingScores = {};
let rewriteTimeout = null;
const processedNodes = new WeakSet();

function sendMessage(message) {
  chrome.runtime.sendMessage(message, () => {
    void chrome.runtime.lastError;
  });
}

function readNodeText(node) {
  return node.innerText || node.textContent || "";
}

function isEditable(element) {
  return (
    element.tagName === "INPUT" ||
    element.tagName === "TEXTAREA" ||
    (element.tagName === "DIV" &&
      (element.getAttribute("contenteditable") === "true" ||
        element.getAttribute("data-lexical-editor") === "true"))
  );
}

function editableValue(element) {
  if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
    return element.value;
  } else if (element.tagName === "DIV" || element.tagName === "SPAN") {
    return element.innerText || "";
  }
  return "";
}

async function buildIncident(text, result, extra = {}) {
  const timestamp = new Date().toISOString();
  const hash = await sha256WithFallback(`${platform}::${text}`);

  return {
    platform,
    category: result.category,
    riskLevel: result.riskLevel,
    messageText: text.slice(0, 500),
    timestamp,
    hash,
    htmlSnapshot: extra.htmlSnapshot,
    url: location.href,
    groomingScore: extra.groomingScore,
    patternKey: result.patternKey,
  };
}

function showGroomingAlert(score) {
  const existing = document.getElementById("escudo-grooming-alert");
  if (existing) return;

  const alert = document.createElement("div");
  alert.id = "escudo-grooming-alert";
  alert.className = "escudo-grooming-alert";
  alert.innerHTML = `
    <div class="escudo-grooming-inner">
      <div>
        <strong>PATRON DE GROOMING DETECTADO</strong>
        <p>La conversacion muestra una escalada asociada al grooming (puntuacion: ${score}/10+).</p>
        <p>Se recomienda cesar la comunicacion y guardar evidencias.</p>
      </div>
      <button type="button">✕</button>
    </div>
  `;

  const closeBtn = alert.querySelector("button");
  closeBtn?.addEventListener("click", () => alert.remove());

  document.body.appendChild(alert);
  setTimeout(() => alert.remove(), 15000);
}

async function saveEvidence(node, result, groomingScore) {
  const text = readNodeText(node);
  const incident = await buildIncident(text, result, {
    groomingScore,
    htmlSnapshot: node.outerHTML.slice(0, 3000),
  });

  sendMessage({ type: "NEW_INCIDENT", incident });
  downloadEvidencePdf(incident);
}

function emitIncident(incident) {
  sendMessage({ type: "NEW_INCIDENT", incident });

  if (
    incident.riskLevel === "HIGH" &&
    settings.emailNotifications &&
    settings.alertEmail
  ) {
    sendMessage({
      type: "SEND_EMAIL_ALERT",
      incident,
      email: settings.alertEmail,
    });
  }
}

async function processNode(node) {
  if (!(node instanceof HTMLElement)) return;
  if (processedNodes.has(node)) return;
  if (!node.textContent || node.textContent.trim().length < 5) return;
  if (
    node.closest(
      ".escudo-warning-wrapper, .escudo-rewrite-banner, #escudo-grooming-alert",
    )
  )
    return;

  const text = readNodeText(node);
  processedNodes.add(node);

  const result = analyzeText(text);
  if (!result) return;

  let groomingScore = 0;
  if (settings.groomingDetection) {
    const conversationId = `${location.pathname}${location.search}`;
    // --- NUEVO: deduplicación por hash de mensaje ---
    const msgHash = await sha256WithFallback(text);
    if (!groomingScores._msgHashes) groomingScores._msgHashes = {};
    if (!groomingScores._msgHashes[conversationId])
      groomingScores._msgHashes[conversationId] = {};
    if (groomingScores._msgHashes[conversationId][msgHash]) {
      groomingScore = groomingScores[conversationId] || 0;
    } else {
      const scoreResult = updateGroomingScore(
        text,
        conversationId,
        groomingScores,
      );
      groomingScores = scoreResult.nextHistory;
      groomingScores._msgHashes[conversationId][msgHash] = true;
      if (scoreResult.added > 0) {
        void setGroomingHistory(groomingScores);
      }
      groomingScore = scoreResult.score;
    }
    if (groomingScore >= 8) {
      showGroomingAlert(groomingScore);
    }
  }

  createWarningBanner(node, result, {
    initiallyHidden: settings.autoHideDangerous,
    onSaveEvidence: () => {
      void saveEvidence(node, result, groomingScore);
    },
  });

  void buildIncident(text, result, { groomingScore }).then((incident) => {
    emitIncident(incident);
  });
}

function scanMessages() {
  if (!settings.protectionEnabled) return;

  const selector = getSelectorsForPlatform(platform);
  try {
    document.querySelectorAll(selector).forEach((node) => processNode(node));
  } catch {
    // Selector fallback safety.
  }
}

function observeMessages() {
  const observer = new MutationObserver((mutations) => {
    if (!settings.protectionEnabled) return;

    const selector = getSelectorsForPlatform(platform);

    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;

        try {
          if (node.matches(selector)) processNode(node);
          node
            .querySelectorAll(selector)
            .forEach((candidate) => processNode(candidate));
        } catch {
          // Selector fallback safety.
        }
      });
    });
  });

  if (!document.body) return;
  observer.observe(document.body, { childList: true, subtree: true });
}

async function setupRewriteDetection() {
  let lastValue = "";

  document.addEventListener("keydown", async (event) => {
    if (!settings.rewriteSuggestions) {
      removeRewriteSuggestion();
      return;
    }

    const target = event.target;
    if (!isEditable(target)) return;

    clearTimeout(rewriteTimeout);
    rewriteTimeout = setTimeout(async () => {
      const value = editableValue(target).trim();

      if (value.length < 5 || value === lastValue) return;
      lastValue = value;

      console.log("Detectando sugerencias de reescritura para:", value);

      try {
        const response = await fetch(
          "http://localhost:3000/api/gemini/ask-text",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: value }),
          },
        );

        if (!response.ok) {
          console.error(
            "Error en la solicitud al servidor:",
            response.statusText,
          );
          return;
        }

        const data = await response.json();
        const suggestion = data.data || "No se pudo generar una sugerencia.";
        showRewriteSuggestion(target, suggestion);
      } catch (error) {
        console.error("Error al comunicarse con el servidor:", error);
      }
    }, 700);
  });
}

async function bootstrap() {
  const [loadedSettings, history] = await Promise.all([
    getSettings(),
    getGroomingHistory(),
  ]);
  settings = loadedSettings;
  groomingScores = history;

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") return;
    if (!changes.settings || !changes.settings.newValue) return;
    settings = { ...settings, ...changes.settings.newValue };
  });

  setupRewriteDetection();
  observeMessages();

  setTimeout(scanMessages, 2000);
  setTimeout(scanMessages, 5000);

  console.log(`[EscudoDigital] Proteccion activa en ${platform}`);
}

void bootstrap();
