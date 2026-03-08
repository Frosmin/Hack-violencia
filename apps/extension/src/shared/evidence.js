import { jsPDF } from "jspdf";

export function downloadEvidencePdf(incident) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const lines = [
    "ESCUDO DIGITAL - REPORTE DE EVIDENCIA",
    "======================================",
    `Fecha: ${new Date(incident.timestamp).toLocaleString("es")}`,
    `Plataforma: ${incident.platform}`,
    `Tipo de incidente: ${incident.category}`,
    `Nivel de riesgo: ${incident.riskLevel}`,
    `URL: ${incident.url}`,
    "",
    "MENSAJE DETECTADO:",
    incident.messageText,
    "",
    "INTEGRIDAD:",
    `Hash SHA-256: ${incident.hash}`,
    "",
    "Este documento fue generado automaticamente por Escudo Digital.",
    "Puede ser usado como evidencia ante autoridades.",
    "======================================",
  ];

  let y = 48;
  const maxWidth = 515;

  lines.forEach((line, index) => {
    doc.setFont("helvetica", index === 0 ? "bold" : "normal");
    doc.setFontSize(index === 0 ? 13 : 11);

    const wrapped = doc.splitTextToSize(line || " ", maxWidth);
    doc.text(wrapped, 40, y);
    y += wrapped.length * 15;

    if (y > 760) {
      doc.addPage();
      y = 48;
    }
  });

  doc.save(`escudo-evidencia-${Date.now()}.pdf`);
}
