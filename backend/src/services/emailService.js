const nodemailer = require('nodemailer');

const buildTransporter = () => {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (gmailUser && gmailAppPassword) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword.replace(/\s+/g, ''),
      },
    });
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';

  if (!host || !user || !pass) {
    throw new Error('Configura GMAIL_USER y GMAIL_APP_PASSWORD, o SMTP_HOST/SMTP_USER/SMTP_PASS');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
};

const sendEmail = async ({ to, subject, text, html, from }) => {
  if (!to || !subject || (!text && !html)) {
    throw new Error('Campos requeridos: to, subject y text o html');
  }

  const transporter = buildTransporter();
  const defaultFrom = process.env.SMTP_FROM || process.env.GMAIL_USER || process.env.SMTP_USER;

  const info = await transporter.sendMail({
    from: from || defaultFrom,
    to,
    subject,
    text,
    html,
  });

  return {
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
    response: info.response,
  };
};

module.exports = {
  sendEmail,
};