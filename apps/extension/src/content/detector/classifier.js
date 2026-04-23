import { DANGER_PATTERNS } from "@/content/detector/rules/danger-rules";

const SAFE_ANNOUNCEMENT_PATTERNS = [
  /\b(pagina oficial|sitio oficial|correo|email|registrarse|inscripcion|inscribirse|registro|evento|universidad|universidades|equipo|solicitud|presentacion personal|hasta el \d{1,2}\/\d{1,2}\/\d{2,4})\b/i,
  /https?:\/\/\S+/i,
];

function isFormalAnnouncement(text) {
  return SAFE_ANNOUNCEMENT_PATTERNS.some((pattern) => pattern.test(text));
}

export function analyzeText(text) {
  if (!text || text.trim().length < 3) return null;

  if (isFormalAnnouncement(text)) {
    return null;
  }

  for (const [patternKey, category] of Object.entries(DANGER_PATTERNS)) {
    for (const pattern of category.patterns) {
      if (pattern.test(text)) {
        return {
          category: category.label,
          riskLevel: category.level,
          emoji: category.emoji,
          patternKey,
        };
      }
    }
  }

  return null;
}
