export const TOXIC_WRITING_PATTERNS = [
  {
    pattern: /\b(estupid[ao]|idiota|imbecil)\b/i,
    suggestion:
      'Considera expresar tu frustracion sin insultos. Ejemplo: "No estoy de acuerdo con lo que hiciste".',
  },
  {
    pattern: /\b(te odio|te voy a matar|ojala te mueras)\b/i,
    suggestion:
      'Este mensaje puede causar dano. Intenta: "Estoy muy enojado/a contigo en este momento".',
  },
  {
    pattern: /\b(matate|suicidate|desaparece)\b/i,
    suggestion:
      "Este mensaje es muy danino. Considera no enviarlo y reformularlo con respeto.",
  },
  {
    pattern: /\b(gorda|gordo|fea|feo|horrible)\b/i,
    suggestion:
      "Los comentarios sobre apariencia pueden herir profundamente. Prueba otro enfoque.",
  },
];
