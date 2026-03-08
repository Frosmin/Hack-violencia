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
      throw new Error(
        "El prompt es demasiado corto para generar una sugerencia.",
      );
    }
    const reformulationPrompt = `Si el siguiente mensaje no es etico o respetuoso, da una advertencia o recomendacion acerda del mensaje super corto de menos de 50 caracteres, si no tiene nada de malo retorna "Mensaje sin problemas": "${prompt}"`;
    const res = await model.generateContent(reformulationPrompt);

    if (!res || !res.response || !res.response.text) {
      throw new Error(
        "La API no devolvió una respuesta válida para la reformulación.",
      );
    }

    console.log("Sugerencia de reformulación:", res.response.text());
    return res.response.text();
  } catch (error) {
    console.log("Error en la API de Gemini:", error.message);

    // Respuesta predeterminada en caso de error
    return "No se pudo analizar o reformular el mensaje en este momento. Por favor, intenta nuevamente más tarde.";
  }
};

module.exports = {
  geminiPhoto,
  geminiText,
};
