import { clearIncidents, getIncidents, getSettings } from "@/shared/storage";
import { sendEmailAlert } from "./email-alerts";
import { persistIncident } from "./incidents-store";

async function notifyIncident(incident) {
  await chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon48.png",
    title: "Escudo Digital - Alerta",
    message:
      incident.riskLevel === "HIGH"
        ? `ALTO RIESGO: ${incident.category} detectado en ${incident.platform}`
        : `Advertencia: ${incident.category} detectado en ${incident.platform}`,
  });
}

async function handleMessage(message, sender) {
  switch (message.type) {
    case "NEW_INCIDENT": {
      const incident = await persistIncident(message.incident, sender.tab);
      await notifyIncident(incident);
      return { ok: true };
    }

    case "SEND_EMAIL_ALERT": {
      const settings = await getSettings();
      if (settings.emailNotifications !== false) {
        await sendEmailAlert(message.incident, message.email);
      }
      return { ok: true };
    }

    case "GET_INCIDENTS": {
      const incidents = await getIncidents();
      return { incidents };
    }

    case "CLEAR_INCIDENTS": {
      await clearIncidents();
      return { ok: true };
    }

    case "OPEN_DASHBOARD": {
      await chrome.tabs.create({
        url: chrome.runtime.getURL("dashboard.html"),
      });
      return { ok: true };
    }

    case "OPEN_EDUCATION": {
      await chrome.tabs.create({
        url: chrome.runtime.getURL("education.html"),
      });
      return { ok: true };
    }

    case "OPEN_EVIDENCES": {
      await chrome.tabs.create({
        url: chrome.runtime.getURL("evidences.html"),
      });
      return { ok: true };
    }

    case "CAPTURE_SCREENSHOT": {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (!tab?.id) {
          return { ok: false, error: "No active tab found" };
        }
        const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {
          format: "png",
          quality: 100,
        });
        return { ok: true, dataUrl };
      } catch (err) {
        console.error("[EscudoDigital] captureVisibleTab error:", err);
        return { ok: false, error: String(err) };
      }
    }

    default:
      return { ok: false };
  }
}

export function registerMessageBus() {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    void handleMessage(message, sender)
      .then((response) => sendResponse(response))
      .catch((error) => {
        console.error("[EscudoDigital] message error", error);
        sendResponse({ ok: false, error: String(error) });
      });

    return true;
  });
}
