const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const geminiPhoto = async (prompt, imageBase64, mimeType = "image/jpeg") => {
  try {
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: mimeType,
      },
    };

    console.log("Base64 length:", imageBase64 ? imageBase64.length : 0);
    console.log("MimeType:", mimeType);

    const res = await model.generateContent([prompt, imagePart]);
    return res.response.text();
  } catch (error) {
    console.log("error en la api de gemini", error);
    throw error;
  }
};

const geminiText = async (prompt) => {
  try {
    if (!prompt || prompt.trim().length < 5) {
      throw new Error("El mensaje es demasiado corto para ser analizado.");
    }
    
    // Prompt estricto para que solo diga si es violento o no
    const evaluationPrompt = `
      Analiza el siguiente mensaje y determina si contiene lenguaje violento, agresividad, acoso, amenazas o faltas éticas graves.
      Debes responder EXCLUSIVAMENTE en formato JSON válido con la siguiente estructura, sin texto extra ni etiquetas markdown:
      {
        "isViolent": true o false
      }
      Mensaje a analizar: "${prompt}"
    `;

    const res = await model.generateContent(evaluationPrompt);

    if (!res || !res.response || !res.response.text) {
      throw new Error("La API no devolvió una respuesta válida.");
    }

    let rawText = res.response.text();
    console.log("Respuesta cruda de Gemini:", rawText);

    // Limpiamos la respuesta de posibles etiquetas markdown (```json ... ```)
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    // Parseamos a un objeto JavaScript
    const parsedData = JSON.parse(rawText);
    console.log("Resultado del análisis:", parsedData);

    // Devolvemos el objeto { isViolent: true/false }
    return parsedData;
  } catch (error) {
    console.log("Error en la API de Gemini:", error.message);

    // Respuesta segura en caso de fallo
    return {
      isViolent: false,
      error: "No se pudo clasificar el mensaje."
    };
  }
};

module.exports = {
  geminiPhoto,
  geminiText,
};
