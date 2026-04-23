import { getToken } from "@/shared/authService";

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

export async function captureAndUploadEvidence() {
  return captureWithContext({});
}

export async function captureWithContext(metadata) {
  const token = await getToken();
  if (!token) {
    console.warn("[EscudoDigital] No auth token found, skipping evidence upload");
    return null;
  }

  let dataUrl;
  try {
    dataUrl = await requestScreenshot();
  } catch (err) {
    console.error("[EscudoDigital] Screenshot capture failed:", err);
    return null;
  }

  const blob = dataUrlToBlob(dataUrl);
  const formData = new FormData();
  formData.append("image", blob, `evidence-${Date.now()}.png`);
  formData.append("metadata", JSON.stringify(metadata));

  try {
    console.log("[EscudoDigital] Uploading evidence with metadata:", metadata);
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