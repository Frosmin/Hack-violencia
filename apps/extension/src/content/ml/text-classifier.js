let toxicityModel = null;
let modelLoading = false;
let loadPromise = null;
let toxicityDisabled = false;

const THRESHOLD = 0.7;

export async function loadModel() {
  console.log("[EscudoDigital] Cargando modelo toxicity...");
  if (toxicityDisabled) {
    console.log("[EscudoDigital] Modelo toxicity deshabilitado por error previo");
    return null;
  }
  if (toxicityModel) {
    console.log("[EscudoDigital] Modelo ya cargado");
    return toxicityModel;
  }
  if (modelLoading && loadPromise) {
    console.log("[EscudoDigital] Modelo cargando...");
    return loadPromise;
  }

  modelLoading = true;

  loadPromise = (async () => {
    try {
      const tfModule = await import("@tensorflow/tfjs");
      const tf = tfModule?.default ?? tfModule;
      if (tf.getBackend() !== "cpu") {
        await tf.setBackend("cpu");
      }
      await tf.ready();
      console.log("[EscudoDigital] Backend TF:", tf.getBackend());
      console.log("[EscudoDigital] Iniciando descarga de TF.js toxicity...");
      const toxicityModule = await import("@tensorflow-models/toxicity");
      const toxicity = toxicityModule?.load
        ? toxicityModule
        : toxicityModule?.default;

      if (!toxicity?.load) {
        throw new Error("No se pudo resolver toxicity.load");
      }

      toxicityModel = await toxicity.load(THRESHOLD);
      modelLoading = false;
      console.log("[EscudoDigital] Modelo toxicity CARGADO");
      return toxicityModel;
    } catch (error) {
      console.error("[EscudoDigital] Error cargando modelo:", error);
      toxicityDisabled = true;
      modelLoading = false;
      return null;
    }
  })();

  return loadPromise;
}

export function isModelLoaded() {
  return toxicityModel !== null;
}

export async function analyzeHostileIntent(text) {
  if (!text || text.trim().length < 3) {
    return { probability: 0, hostile: false, category: "empty" };
  }

  if (!isModelLoaded()) {
    console.log("[EscudoDigital] Modelo no cargado, iniciando carga...");
    await loadModel();
  }

  if (!isModelLoaded()) {
    console.log("[EscudoDigital] Usando fallback regex");
    return fallbackAnalyze(text);
  }

  try {
    console.log("[EscudoDigital] Clasificando con TF.js toxicity...");
    const predictions = await toxicityModel.classify([text]);
    console.log("[EscudoDigital] Predicciones crudas:", JSON.stringify(predictions, null, 2));
    
    let maxToxic = 0;
    let topLabel = "clean";

    for (const prediction of predictions) {
      for (const result of prediction.results) {
        if (result.match && result.probabilities[1] > maxToxic) {
          maxToxic = result.probabilities[1];
          topLabel = prediction.label;
        }
      }
    }

    console.log("[EscudoDigital] Resultado - Toxicidad:", maxToxic.toFixed(4), "| Hostil:", maxToxic > 0.5, "| Categoria:", topLabel);

    return {
      probability: maxToxic,
      hostile: maxToxic > 0.5,
      category: topLabel,
    };
  } catch (error) {
    console.error("[EscudoDigital] Toxicity classification error:", error);
    // Evita seguir usando una instancia dañada del modelo en siguientes Enter.
    toxicityModel = null;
    toxicityDisabled = true;
    return fallbackAnalyze(text);
  }
}

const FALLBACK_PATTERNS = [
  /\b(matar|asesinar|morir|guerra)\b/i,
  /\b(amenaz|extors|chantaj)\b/i,
  /\b(viol+|abuso|assedio)\b/i,
  /\b(gord[oa]|fe[oa]|idiot[ae]?|estupid[ae]?)\b/i,
  /\b(porno|publo|nude)\b/i,
  /\b(odio|te ненавижу|kill you)\b/i,
];

function fallbackAnalyze(text) {
  const normalized = text.toLowerCase();
  for (const pattern of FALLBACK_PATTERNS) {
    if (pattern.test(normalized)) {
      return { probability: 0.85, hostile: true, category: "fallback_detected" };
    }
  }
  return { probability: 0.1, hostile: false, category: "clean" };
}