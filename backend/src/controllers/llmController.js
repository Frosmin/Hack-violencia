const groqService = require("../services/groqService");

const askLLMPhoto = async (req, res) => {
  try {
    // Aceptamos que body traiga imageBase64 y mimeType también
    const { prompt, imageBase64: bodyB64, mimeType: bodyMime } = req.body;
    const file = req.file;

    if (!prompt) {
      return res.status(400).json({ error: "El campo 'prompt' es requerido" });
    }

    let imageBase64 = bodyB64 || null;
    let mimeType = bodyMime || null;

    if (file) {
      imageBase64 = file.buffer.toString("base64");
      mimeType = file.mimetype;
    }

    if (!imageBase64) {
      return res.status(400).json({ error: "Se requiere una imagen" });
    }

    const respuesta = await groqService.groqPhoto(
      prompt,
      imageBase64,
      mimeType,
    );

    res.status(200).json({
      success: true,
      data: respuesta,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const askLLMText = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "El campo 'prompt' es requerido" });
    }

    const respuesta = await groqService.groqText(prompt);

    res.status(200).json({
      success: true,
      data: respuesta,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  askLLMPhoto,
  askLLMText,
};
