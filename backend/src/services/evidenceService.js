const { PrismaClient } = require('@prisma/client');
const { uploadImage } = require('./cloudinaryService');
const { geminiPhoto } = require('./geminiService');

const prisma = new PrismaClient();

/**
 * Procesa una imagen base64, la analiza con Gemini, la sube a Cloudinary y la guarda en la BD.
 * @param {string} imageBase64 - Imagen en formato base64 (con o sin prefijo data:image/...).
 * @param {number} userId - ID del usuario que envía la evidencia.
 * @param {number} organizationId - ID de la organización a la que pertenece la evidencia.
 * @returns {Promise<Object>} - La evidencia creada en la base de datos.
 */
const processAndCreateEvidence = async (imageBase64, userId, organizationId) => {
  try {
    let base64Data = imageBase64;
    let mimeType = 'image/jpeg';

    if (imageBase64.includes(';base64,')) {
      const parts = imageBase64.split(';base64,');
      mimeType = parts[0].split(':')[1];
      base64Data = parts[1];
    }

    const prompt = `
      Analiza esta captura de pantalla de un chat (como WhatsApp). Vas a actuar como un analizador experto en evidencias digitales para casos de acoso o violencia.
      Extrae la siguiente información y devuélvela ESTRICTAMENTE en un formato JSON válido (con las claves exactas en minúsculas), sin texto adicional ni bloques de código markdown:
      {
        "type": "Escribe 'victima' si la persona dueña del teléfono (quien toma la captura) está recibiendo los mensajes dañinos, o 'agresor' si quien toma la captura es quien envía los mensajes dañinos o violentos.",
        "sujeto": "El nombre del contacto o número de teléfono de la otra persona en el chat (generalmente aparece en la parte superior).",
        "description": "Una descripción detallada pero objetiva del contenido dañino de los mensajes, ideal para ser usada como evidencia en un reporte o caso legal."
      }
    `;

    console.log('Enviando foto a Gemini...');
    const geminiRawResponse = await geminiPhoto(prompt, base64Data, mimeType);

    const cleanJson = geminiRawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    let geminiData;

    try {
      geminiData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('Error al parsear el JSON de Gemini:', cleanJson);
      throw new Error('Gemini no devolvió un JSON válido. Intenta enviar la imagen nuevamente.');
    }

    const urlUploadToCloudinary = imageBase64.includes(';base64,')
      ? imageBase64
      : `data:${mimeType};base64,${base64Data}`;

    console.log('Subiendo imagen a Cloudinary...');
    const secureUrl = await uploadImage(urlUploadToCloudinary);

    console.log('Guardando evidencia en la base de datos...');
    const newEvidence = await prisma.evidence.create({
      data: {
        type: geminiData.type || 'desconocido',
        url: secureUrl,
        Sujeto: geminiData.sujeto || 'Desconocido',
        description: geminiData.description || 'Sin descripción',
        userId: parseInt(userId, 10),
        organizationId: parseInt(organizationId, 10),
      },
    });

    return newEvidence;
  } catch (error) {
    console.error('Error en processAndCreateEvidence:', error);
    throw error;
  }
};

const getOrganizationEvidences = async (organizationId) =>
  prisma.evidence.findMany({
    where: { organizationId: parseInt(organizationId, 10) },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
    orderBy: { id: 'desc' },
  });

module.exports = {
  processAndCreateEvidence,
  getOrganizationEvidences,
};
