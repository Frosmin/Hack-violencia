const EMAIL_ENDPOINT = "http://localhost:3000/api/email/send";

export async function sendEmailAlert(incident, email) {
  if (!email || !incident) return;

  const payload = {
    to: email,
    hostilityDetected: true,
    incident,
  };

  const response = await fetch(EMAIL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`No se pudo enviar la alerta por email: ${response.status} ${message}`);
  }
}
