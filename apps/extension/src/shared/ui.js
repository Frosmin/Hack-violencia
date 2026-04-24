export function riskLabel(riskLevel) {
  if (riskLevel === "HIGH") return "Alto";
  if (riskLevel === "MEDIUM") return "Medio";
  return "Bajo";
}

export function openDashboardTab() {
  chrome.runtime.sendMessage({ type: "OPEN_DASHBOARD" }, () => {
    void chrome.runtime.lastError;
  });
}

export function openEducationTab() {
  chrome.runtime.sendMessage({ type: "OPEN_EDUCATION" }, () => {
    void chrome.runtime.lastError;
  });
}

export function openEvidencesTab() {
  chrome.runtime.sendMessage({ type: "OPEN_EVIDENCES" }, () => {
    void chrome.runtime.lastError;
  });
}

export function openOrganizationTab() {
  chrome.runtime.sendMessage({ type: "OPEN_ORGANIZATION" }, () => {
    void chrome.runtime.lastError;
  });
}
