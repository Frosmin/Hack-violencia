const { sendAlertEmail } = require("../services/emailService");

const alertEmail = async (req, res) => {
  try {
    const { incident, email } = req.body;

    if (!incident || !email) {
      return res.status(400).json({ error: "Faltan datos del incidente o el correo destinatario." });
    }

    const success = await sendAlertEmail(incident, email);

    if (success) {
      res.status(200).json({ message: "Correo de alerta enviado exitosamente." });
    } else {
      res.status(500).json({ error: "Fallo al enviar el correo de alerta." });
    }
  } catch (error) {
    console.error("Error en el controller de email:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

module.exports = {
  alertEmail,
};