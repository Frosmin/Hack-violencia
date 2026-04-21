import { appendIncident } from "@/shared/storage";

function createIncidentId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function persistIncident(partialIncident, tab) {
  const incident = {
    id: partialIncident.id || createIncidentId(),
    platform: partialIncident.platform,
    category: partialIncident.category,
    riskLevel: partialIncident.riskLevel,
    messageText: partialIncident.messageText,
    timestamp: partialIncident.timestamp,
    hash: partialIncident.hash,
    url: tab?.url || "unknown",
    tabTitle: tab?.title || "unknown",
  };

  await appendIncident(incident);
  return incident;
}