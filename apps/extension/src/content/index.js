import "@/content/content.css";
import { analyzeHostileIntent, loadModel} from "@/content/ml/text-classifier";
import { createWarningBanner } from "@/content/ui/warning-banner";
import {
  removeRewriteSuggestion,
  showRewriteSuggestion,
} from "@/content/ui/rewrite-banner";
import { detectPlatform } from "@/shared/platform";
import { getSettings } from "@/shared/storage";
import { captureWithContext } from "@/shared/screenshotService";

const platform = detectPlatform(location.hostname);

let settings = {
  alertEmail: "",
  emailNotifications: true,
  rewriteSuggestions: true,
  protectionEnabled: true,
};

function sendMessage(message) {
  chrome.runtime.sendMessage(message, () => {
    void chrome.runtime.lastError;
  });
}

function isEditable(element) {
  if (!element) return false;

  return (
    element.tagName === "INPUT" ||
    element.tagName === "TEXTAREA" ||
    element.isContentEditable ||
    element.getAttribute("data-lexical-editor") === "true"
  );
}

function resolveEditableTarget(node) {
  if (!(node instanceof HTMLElement)) return null;

  if (isEditable(node)) return node;

  const parentEditable = node.closest(
    'input, textarea, [contenteditable=""], [contenteditable="true"], [data-lexical-editor="true"]',
  );

  return parentEditable instanceof HTMLElement ? parentEditable : null;
}

function editableValue(element) {
  if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
    return element.value;
  } else if (element.isContentEditable) {
    return element.innerText || "";
  }
  return "";
}

function showWarning(element, result) {
  const warning = createWarningBanner(element, result, {
    onSendAnyway: () => {
      warning.remove();
    },
    onEdit: () => {
      warning.remove();
      element.focus();
    },
    onCancel: () => {
      warning.remove();
      element.blur();
    },
  });
}

function showSuggestion(element, suggestion) {
  showRewriteSuggestion(element, suggestion);
}

function setupEnterDetection() {
  document.addEventListener("keydown", async (event) => {
    if (event.key !== "Enter") return;
    if (event.isComposing) return;
    if (event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) return;

    if (!settings.protectionEnabled) return;

    const target = resolveEditableTarget(event.target);
    if (!target) return;

    // Snapshot before the host app consumes Enter and clears the input.
    const value = editableValue(target).trim();
    if (value.length < 2) return;

    console.log("[EscudoDigital] Captured text:", value);

    try {
      const result = await analyzeHostileIntent(value);
      console.log("[EscudoDigital] Analysis result:", result);

      if (result.hostile) {
        console.log("[EscudoDigital] HOSTILE detected! Showing warning.");
        showWarning(target, {
          category: result.category,
          riskLevel: "HIGH",
          messageText: value.slice(0, 500),
          patternKey: "ml_detected",
        });
        captureWithContext({
          platform: location.hostname,
          category: result.category,
          probability: result.probability,
          timestamp: new Date().toISOString(),
          text_snippet: value.slice(0, 200),
        });
      } else if (settings.rewriteSuggestions && result.probability > 0.3) {
        console.log(
          "[EscudoDigital] Risky content (prob:",
          result.probability.toFixed(3),
          ")",
        );
        showSuggestion(target, "Considera revisar tu mensaje antes de enviar.");
      }
    } catch (error) {
      console.error("[EscudoDigital] Error analizando Enter:", error);
    }
  }, true);
}

async function bootstrap() {
  const loadedSettings = await getSettings();
  settings = { ...settings, ...loadedSettings };

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") return;
    if (!changes.settings || !changes.settings.newValue) return;
    settings = { ...settings, ...changes.settings.newValue };
  });

  setupEnterDetection();
  console.log(`[EscudoDigital] Protección activa en ${platform}`);
  loadModel();
}

void bootstrap();