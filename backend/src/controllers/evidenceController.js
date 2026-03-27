// backend/src/controllers/evidenceController.js
const { processAndCreateEvidence } = require('../services/evidenceService');

const createEvidenceController = async (req, res) => {
  try {
    // req.user.userId viene del payload decodificado en tu middleware requireAuth
    const userId = req.user.userId;

    // req.file viene del middleware de multer
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No se proporcionó la imagen." });
    }

    if (!userId) {
      return res.status(401).json({ error: "El usuario no está autenticado." });
    }

    // Convertir el buffer a Base64 y agregar el prefijo MIME que el servicio espera
    const imageBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    // Procesar y crear la evidencia
    const evidence = await processAndCreateEvidence(imageBase64, userId);

    return res.status(201).json({
      message: "Evidencia analizada y guardada exitosamente",
      data: evidence
    });

  } catch (error) {
    console.error("Error en el controller createEvidenceController:", error);
    return res.status(500).json({ error: error.message || "Error interno del servidor al procesar la evidencia." });
  }
};

module.exports = {
  createEvidenceController
};