const Groq = require("groq-sdk");

const MODEL = "llama-3.3-70b-versatile";

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Falta la variable de entorno GROQ_API_KEY para conectar con Groq.",
    );
  }

  return new Groq({ apiKey });
};

const getTextFromCompletion = (completion) => {
  return completion?.choices?.[0]?.message?.content?.trim() || "";
};

const groqPhoto = async () => {
  return "El modelo llama-3.3-70b-versatile no admite análisis directo de imágenes. Envía una descripción de texto para obtener una respuesta.";
};

const groqText = async (prompt) => {
  try {
    if (!prompt || prompt.trim().length < 5) {
      throw new Error(
        "El prompt es demasiado corto para generar una sugerencia.",
      );
    }

    const groq = getGroqClient();

    const completion = await groq.chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            'Eres un asistente de moderación y reescritura. Si el mensaje es ético y respetuoso, responde exactamente "Mensaje sin problemas". Si detectas algo dañino, irrespetuoso o inapropiado, responde con una advertencia o recomendación muy breve, en menos de 50 caracteres.',
        },
        {
          role: "user",
          content: `Mensaje: "${prompt}"`,
        },
      ],
    });

    const text = getTextFromCompletion(completion);

    if (!text) {
      throw new Error(
        "La API no devolvió una respuesta válida para la reformulación.",
      );
    }

    console.log("Sugerencia de reformulación:", text);
    return text;
  } catch (error) {
    console.log("Error en la API de Groq:", error.message);

    return "No se pudo analizar o reformular el mensaje en este momento. Por favor, intenta nuevamente más tarde.";
  }
};

module.exports = {
  groqPhoto,
  groqText,
};
