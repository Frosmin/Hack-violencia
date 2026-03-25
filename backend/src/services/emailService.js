const nodemailer = require('nodemailer');

const HIGH_RISK_LEVELS = new Set(['MEDIUM', 'HIGH']);

const normalizeRiskLevel = (riskLevel) => String(riskLevel || 'MEDIUM').toUpperCase();

const shouldUseHostilityTemplate = ({ hostilityDetected, incident }) => {
  if (hostilityDetected === true) return true;
  if (!incident) return false;
  const riskLevel = normalizeRiskLevel(incident.riskLevel);
  return HIGH_RISK_LEVELS.has(riskLevel);
};

const buildHostilityEmailContent = ({ incident }) => {
  const riskLevel = normalizeRiskLevel(incident?.riskLevel);
  const platform = incident?.platform || 'Plataforma no especificada';
  const category = incident?.category || 'Hostilidad';
  const messageText = incident?.messageText || 'No disponible';
  const timestamp = incident?.timestamp
    ? new Date(incident.timestamp).toLocaleString('es-PE')
    : new Date().toLocaleString('es-PE');
  const url = incident?.url || 'No disponible';
  const hash = incident?.hash || 'No disponible';

  const subject = `[Escudo Digital] Alerta ${riskLevel}: ${category} en ${platform}`;

  const text = [
    'Se detecto un posible caso de hostilidad en una conversacion.',
    '',
    `Nivel de riesgo: ${riskLevel}`,
    `Plataforma: ${platform}`,
    `Categoria: ${category}`,
    `Fecha: ${timestamp}`,
    `URL: ${url}`,
    `Hash de evidencia: ${hash}`,
    '',
    'Mensaje detectado:',
    messageText,
    '',
    'Recomendacion: revisa el contexto y considera conservar evidencia.',
  ].join('\n');

  const html = `
    <h2>Escudo Digital - Alerta de Hostilidad</h2>
    <p>Se detecto un posible caso de hostilidad en una conversacion.</p>
    <ul>
      <li><strong>Nivel de riesgo:</strong> ${riskLevel}</li>
      <li><strong>Plataforma:</strong> ${platform}</li>
      <li><strong>Categoria:</strong> ${category}</li>
      <li><strong>Fecha:</strong> ${timestamp}</li>
      <li><strong>URL:</strong> ${url}</li>
      <li><strong>Hash de evidencia:</strong> ${hash}</li>
    </ul>
    <p><strong>Mensaje detectado:</strong></p>
    <blockquote>${messageText}</blockquote>
    <p><strong>Recomendacion:</strong> revisa el contexto y considera conservar evidencia.</p>
  `;

  return { subject, text, html };
};

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

const sendEmail = async ({ to, subject, text, html, from, hostilityDetected, incident }) => {
  let finalSubject = subject;
  let finalText = text;
  let finalHtml = html;

  if (shouldUseHostilityTemplate({ hostilityDetected, incident })) {
    const template = buildHostilityEmailContent({ incident });
    finalSubject = finalSubject || template.subject;
    finalText = finalText || template.text;
    finalHtml = finalHtml || template.html;
  }

  if (!to || !finalSubject || (!finalText && !finalHtml)) {
    throw new Error('Campos requeridos: to, subject y text o html (o enviar incident para plantilla automatica)');
  }

  const transporter = buildTransporter();
  const defaultFrom = process.env.SMTP_FROM || process.env.GMAIL_USER || process.env.SMTP_USER;

  const info = await transporter.sendMail({
    from: from || defaultFrom,
    to,
    subject: finalSubject,
    text: finalText,
    html: finalHtml,
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