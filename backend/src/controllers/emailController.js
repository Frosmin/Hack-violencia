const emailService = require('../services/emailService');

const sendEmail = async (req, res) => {
  try {
    const { to, subject, text, html, from } = req.body;

    const result = await emailService.sendEmail({
      to,
      subject,
      text,
      html,
      from,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    const status = error.message.includes('Campos requeridos') || error.message.includes('Faltan variables SMTP') ? 400 : 500;

    res.status(status).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  sendEmail,
};