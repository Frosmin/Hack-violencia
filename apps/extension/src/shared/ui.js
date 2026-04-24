export function openEducationTab() {
  chrome.runtime.sendMessage({ type: "OPEN_EDUCATION" }, () => {
    void chrome.runtime.lastError;
  });
}

export function openOrganizationTab() {
  chrome.runtime.sendMessage({ type: "OPEN_ORGANIZATION" }, () => {
    void chrome.runtime.lastError;
  });
}
