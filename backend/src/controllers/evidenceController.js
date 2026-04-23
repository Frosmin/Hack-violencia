// backend/src/controllers/evidenceController.js
const { processAndCreateEvidence } = require('../services/evidenceService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createEvidenceController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No se proporcionó la imagen." });
    }

    if (!userId) {
      return res.status(401).json({ error: "El usuario no está autenticado." });
    }

    let metadata = {};
    if (req.body.metadata) {
      try {
        metadata = JSON.parse(req.body.metadata);
      } catch (e) {
        console.warn("Metadata no es JSON válido:", req.body.metadata);
      }
    }

    const imageBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    const evidence = await processAndCreateEvidence(imageBase64, userId, metadata);

    return res.status(201).json({
      message: "Evidencia analizada y guardada exitosamente",
      data: evidence
    });

  } catch (error) {
    console.error("Error en el controller createEvidenceController:", error);
    return res.status(500).json({ error: error.message || "Error interno del servidor al procesar la evidencia." });
  }
};

const getEvidencesController = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({ error: "El usuario no está autenticado." });
    }

    const evidences = await prisma.evidence.findMany({
      where: { userId: parseInt(userId, 10) },
      orderBy: { id: 'desc' },
    });

    return res.status(200).json({ data: evidences });

  } catch (error) {
    console.error("Error en getEvidencesController:", error);
    return res.status(500).json({ error: error.message || "Error interno del servidor." });
  }
};

module.exports = {
  createEvidenceController,
  getEvidencesController,
};