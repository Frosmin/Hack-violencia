import { DEFAULT_SETTINGS, INCIDENT_LIMIT } from "@/shared/defaults";

export async function ensureBootstrapData() {
  const result = await chrome.storage.local.get([
    "incidents",
    "groomingHistory",
    "settings",
  ]);
  const patch = {};

  if (!Array.isArray(result.incidents)) patch.incidents = [];
  if (!result.groomingHistory || typeof result.groomingHistory !== "object")
    patch.groomingHistory = {};

  if (!result.settings || typeof result.settings !== "object") {
    patch.settings = DEFAULT_SETTINGS;
  } else {
    patch.settings = { ...DEFAULT_SETTINGS, ...result.settings };
  }

  await chrome.storage.local.set(patch);
}

export async function getSettings() {
  const result = await chrome.storage.local.get(["settings"]);
  return { ...DEFAULT_SETTINGS, ...(result.settings || {}) };
}

export async function setSettings(patch) {
  const current = await getSettings();
  const next = { ...current, ...patch };
  await chrome.storage.local.set({ settings: next });
  return next;
}

export async function getIncidents() {
  const result = await chrome.storage.local.get(["incidents"]);
  return result.incidents || [];
}

export async function setIncidents(incidents) {
  await chrome.storage.local.set({
    incidents: incidents.slice(0, INCIDENT_LIMIT),
  });
}

export async function appendIncident(incident) {
  const current = await getIncidents();
  const next = [incident, ...current].slice(0, INCIDENT_LIMIT);
  await setIncidents(next);
  return next;
}

export async function clearIncidents() {
  await chrome.storage.local.set({ incidents: [] });
}

export async function getGroomingHistory() {
  const result = await chrome.storage.local.get(["groomingHistory"]);
  return result.groomingHistory || {};
}

export async function setGroomingHistory(history) {
  await chrome.storage.local.set({ groomingHistory: history });
}
