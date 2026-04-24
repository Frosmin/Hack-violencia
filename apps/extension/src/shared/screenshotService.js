import { getAuthSession, getToken } from "@/shared/authService";

const EVIDENCE_API = "http://localhost:3000/api/evidence/upload";

function requestScreenshot() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: "CAPTURE_SCREENSHOT" }, (response) => {
      if (chrome.runtime.lastError) {
        return reject(new Error(chrome.runtime.lastError.message));
      }
      if (!response || !response.ok) {
        return reject(new Error(response?.error || "Error al capturar pantalla"));
      }
      resolve(response.dataUrl);
    });
  });
}

function dataUrlToBlob(dataUrl) {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

export async function captureAndUploadEvidence(metadata = {}) {
  console.log("[EscudoDigital] Preparing evidence upload:", metadata);

  const token = await getToken();
  const session = await getAuthSession();

  if (!token) {
    console.warn("[EscudoDigital] No auth token found, skipping evidence upload");
    return null;
  }

  if (!session?.organization?.id) {
    console.warn("[EscudoDigital] User has no organization, skipping evidence upload", session);
    return null;
  }

  let dataUrl;
  try {
    console.log("[EscudoDigital] Requesting visible tab screenshot.");
    dataUrl = await requestScreenshot();
    console.log("[EscudoDigital] Screenshot captured, uploading evidence.");
  } catch (err) {
    console.error("[EscudoDigital] Screenshot capture failed:", err);
    return null;
  }

  const blob = dataUrlToBlob(dataUrl);
  const formData = new FormData();
  formData.append("image", blob, `evidence-${Date.now()}.png`);

  if (metadata.detectedText) {
    formData.append("detectedText", metadata.detectedText);
  }
  if (metadata.detectedCategory) {
    formData.append("detectedCategory", metadata.detectedCategory);
  }
  if (typeof metadata.detectedProbability === "number") {
    formData.append("detectedProbability", String(metadata.detectedProbability));
  }
  if (metadata.source) {
    formData.append("source", metadata.source);
  }

  try {
    const response = await fetch(EVIDENCE_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al subir evidencia");
    }

    console.log("[EscudoDigital] Evidence uploaded successfully:", data);
    return data;
  } catch (err) {
    console.error("[EscudoDigital] Evidence upload failed:", err);
    return null;
  }
}
