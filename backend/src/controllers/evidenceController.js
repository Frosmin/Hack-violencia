const { processAndCreateEvidence } = require('../services/evidenceService');

const createEvidenceController = async (req, res) => {
  try {
    const { imageBase64, userId } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "No se proporcionó la imagen (imageBase64)." });
    }

    if (!userId) {
      return res.status(400).json({ error: "El userId es obligatorio." });
    }


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