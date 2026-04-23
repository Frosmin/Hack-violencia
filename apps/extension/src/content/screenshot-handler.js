export async function captureScreenshot() {
  try {
    const dataUrl = await chrome.tabs.captureVisibleTab({
      format: "png",
      quality: 100,
    });
    console.log("[EscudoDigital] Screenshot captured successfully");
    return { ok: true, dataUrl };
  } catch (err) {
    console.error("[EscudoDigital] captureVisibleTab error:", err);
    return { ok: false, error: String(err) };
  }
}

export function setupScreenshotListener() {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "CAPTURE_SCREENSHOT") {
      void captureScreenshot().then(sendResponse);
      return true;
    }
    return false;
  });
}