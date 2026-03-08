export async function sendEmailAlert(incident, email) {
  if (!email) return;

  const subject = encodeURIComponent(
    `[Escudo Digital] Alerta: ${incident.category}`,
  );
  const body = encodeURIComponent(
    `Se detecto un mensaje de riesgo ${incident.riskLevel}.\n\n` +
      `Plataforma: ${incident.platform}\n` +
      `Categoria: ${incident.category}\n` +
      `Mensaje: ${incident.messageText}\n` +
      `Fecha: ${new Date(incident.timestamp).toLocaleString()}\n` +
      `Hash SHA-256: ${incident.hash}`,
  );

  await chrome.tabs.create({
    url: `mailto:${email}?subject=${subject}&body=${body}`,
  });
}
