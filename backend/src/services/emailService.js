const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587, 
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  }
});

const sendAlertEmail = async (incident, recipientEmail) => {
  try {
    const mailOptions = {
      // Importante: El correo "from" debe ser uno que tengas verificado en tu cuenta de Brevo como remitente válido.
      from: `"Escudo Digital Alertas" <frosminpepe@gmail.com>`,
      to: recipientEmail,
      subject: `🚨 [ALERTA] Mensaje violento en ${incident.platform}`,
      text: `Se detectó un mensaje violento en ${incident.platform}. Mensaje: "${incident.messageText}"`,
      html: `
        <h2>🚨 Alerta de Seguridad Automática</h2>
        <ul>
          <li><strong>Plataforma:</strong> ${incident.platform}</li>
          <li><strong>Riesgo:</strong> ${incident.riskLevel}</li>
          <li><strong>Fecha:</strong> ${new Date(incident.timestamp).toLocaleString()}</li>
        </ul>
        <p><strong>Mensaje interceptado:</strong></p>
        <blockquote style="padding: 10px; border-left: 5px solid red;">
          "${incident.messageText}"
        </blockquote>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Correo enviado:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
    return false;
  }
};

module.exports = {
  sendAlertEmail,
};