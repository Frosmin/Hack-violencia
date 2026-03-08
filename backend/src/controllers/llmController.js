const geminiService = require('../services/geminiService');
const { sendAlertEmail } = require('../services/emailService'); 
const crypto = require('crypto'); 

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
      imageBase64 = file.buffer.toString('base64');
      mimeType = file.mimetype; 
    }

    if (!imageBase64) {
      return res.status(400).json({ error: "Se requiere una imagen" });
    }

    const respuesta = await geminiService.geminiPhoto(prompt, imageBase64, mimeType);

    res.status(200).json({
      success: true,
      data: respuesta
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};



// const askLLMText = async (req, res) => {
//   try {
//     const { prompt } = req.body;

//     if (!prompt) {
//       return res.status(400).json({ error: "El campo 'prompt' es requerido" });
//     }

//     const respuesta = await geminiService.geminiText(prompt);


//     res.status(200).json({
//       success: true,
//       data: respuesta
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };


const askLLMText = async (req, res) => {
  try {
    // Recibimos prompt, alertEmail y platform desde el frontend
    const { prompt, alertEmail, platform } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Falta el prompt." });
    }

    // Le pedimos a Gemini que analice (usando geminiService)
    const result = await geminiService.geminiText(prompt);

    // Si Gemini dice que es violento, disparamos el correo
    if (result && result.isViolent && alertEmail) {
      console.log("🚨 Violencia detectada. Enviando correo automático a:", alertEmail);
      
      // Construimos un "incidente" simulado en el backend
      const timestamp = new Date().toISOString();
      const hash = crypto.createHash('sha256').update(`${prompt}${timestamp}`).digest('hex');
      
      const incidentData = {
        platform: platform || "Desconocida",
        riskLevel: "HIGH",
        category: "Violencia detectada por IA",
        messageText: prompt,
        timestamp: timestamp,
        hash: hash
      };

      // Disparamos el correo (no bloqueamos con 'await' si queremos responder de inmediato al front)
      sendAlertEmail(incidentData, alertEmail).catch(err => 
        console.error("Error interno al enviar correo:", err)
      );
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error en askText:", error);
    return res.status(500).json({ error: "Error interno procesando análisis." });
  }
};

module.exports = {
  askLLMPhoto,
  askLLMText,
};

