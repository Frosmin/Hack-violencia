const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { uploadImage } = require('./cloudinaryService');
const { geminiPhoto } = require('./geminiService');

/**
 * Procesa una imagen base64, la analiza con Gemini, la sube a Cloudinary y la guarda en la BD.
 * @param {string} imageBase64 - Imagen en formato base64 (con o sin prefijo data:image/...).
 * @param {number} userId - ID del usuario que envía la evidencia.
 * @param {Object} metadata - Metadatos adicionales (platform, category, probability, timestamp, text_snippet).
 * @returns {Promise<Object>} - La evidencia creada en la base de datos.
 */
const processAndCreateEvidence = async (imageBase64, userId, metadata = {}) => {
  try {
    // 1. Limpiar el base64 para Gemini (quitar el prefijo como 'data:image/jpeg;base64,')
    let base64Data = imageBase64;
    let mimeType = 'image/jpeg'; // Valor por defecto

    if (imageBase64.includes(';base64,')) {
      const parts = imageBase64.split(';base64,');
      mimeType = parts[0].split(':')[1];
      base64Data = parts[1];
    }

    // 2. Crear el prompt para Gemini pidiendo una respuesta en formato JSON
    const prompt = `
      Analiza esta captura de pantalla de un chat (como WhatsApp). Vas a actuar como un analizador experto en evidencias digitales para casos de acoso o violencia.
      Extrae la siguiente información y devuélvela ESTRICTAMENTE en un formato JSON válido (con las claves exactas en minúsculas), sin texto adicional ni bloques de código markdown:
      {
        "type": "Escribe 'victima' si la persona dueña del teléfono (quien toma la captura) está recibiendo los mensajes dañinos, o 'agresor' si quien toma la captura es quien envía los mensajes dañinos o violentos.",
        "sujeto": "El nombre del contacto o número de teléfono de la otra persona en el chat (generalmente aparece en la parte superior).",
        "description": "Una descripción detallada pero objetiva del contenido dañino de los mensajes, ideal para ser usada como evidencia en un reporte o caso legal."
      }
    `;

    // 3. Analizar la imagen con Gemini
    console.log("Enviando foto a Gemini...");
    const geminiRawResponse = await geminiPhoto(prompt, base64Data, mimeType);
    
    // Limpiar texto de respuesta por si Gemini devuelve markdown como ```json ... ```
    let cleanJson = geminiRawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    let geminiData;
    
    try {
      geminiData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("Error al parsear el JSON de Gemini:", cleanJson);
      throw new Error("Gemini no devolvió un JSON válido. Intenta enviar la imagen nuevamente.");
    }

    // 4. Subir la imagen original a Cloudinary para obtener la URL
    // Nota: uploadImage de cloudinary puede recibir el base64 completo con el prefijo 'data:image/...' directamente
    const urlUploadToCloudinary = imageBase64.includes(';base64,') ? imageBase64 : `data:${mimeType};base64,${base64Data}`;
    console.log("Subiendo imagen a Cloudinary...");
    const secureUrl = await uploadImage(urlUploadToCloudinary);

    // 5. Guardar todo en la base de datos con Prisma
    const metadataStr = Object.keys(metadata).length > 0
      ? `\n\n[Metadatos de detección: ${JSON.stringify(metadata)}]`
      : '';

    console.log("Guardando evidencia en la base de datos...");
    const newEvidence = await prisma.evidence.create({
      data: {
        type: geminiData.type || 'desconocido',
        url: secureUrl,
        Sujeto: geminiData.sujeto || 'Desconocido',
        description: (geminiData.description || 'Sin descripción') + metadataStr,
        userId: parseInt(userId, 10)
      }
    });

    return newEvidence;

  } catch (error) {
    console.error("Error en processAndCreateEvidence:", error);
    throw error;
  }
};

module.exports = {
  processAndCreateEvidence
};