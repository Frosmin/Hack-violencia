const {
  processAndCreateEvidence,
  getOrganizationEvidences,
} = require('../services/evidenceService');

const createEvidenceController = async (req, res) => {
  try {
    const { userId, organizationId } = req.user;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No se proporcionó la imagen.' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'El usuario no está autenticado.' });
    }

    if (!organizationId) {
      return res.status(403).json({ error: 'El usuario no tiene una organización asociada.' });
    }

    const imageBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    const evidence = await processAndCreateEvidence(imageBase64, userId, organizationId, {
      detectedText: req.body.detectedText,
      detectedCategory: req.body.detectedCategory,
      detectedProbability: req.body.detectedProbability,
      source: req.body.source,
    });

    return res.status(201).json({
      message: 'Evidencia analizada y guardada exitosamente',
      data: evidence,
    });
  } catch (error) {
    console.error('Error en el controller createEvidenceController:', error);
    return res.status(500).json({
      error: error.message || 'Error interno del servidor al procesar la evidencia.',
    });
  }
};

const getEvidencesController = async (req, res) => {
  try {
    const { userId, organizationId } = req.user;

    if (!userId) {
      return res.status(401).json({ error: 'El usuario no está autenticado.' });
    }

    if (!organizationId) {
      return res.status(403).json({ error: 'El usuario no tiene una organización asociada.' });
    }

    const evidences = await getOrganizationEvidences(organizationId);

    return res.status(200).json({ data: evidences });
  } catch (error) {
    console.error('Error en getEvidencesController:', error);
    return res.status(500).json({ error: error.message || 'Error interno del servidor.' });
  }
};

module.exports = {
  createEvidenceController,
  getEvidencesController,
};
