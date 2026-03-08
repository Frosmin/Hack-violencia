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
  {
    pattern: /\b(no sirves|no vales nada)\b/i,
    suggestion:
      "Este tipo de frases puede dañar mucho. Considera explicar el problema sin atacar a la persona.",
  },
  {
    pattern: /\b(eres un fracaso|fracasado)\b/i,
    suggestion:
      "Evita descalificar a la persona. Intenta enfocarte en la situación específica.",
  },
  {
    pattern: /\b(eres inutil|inutil total)\b/i,
    suggestion:
      "Podrías explicar qué salió mal en lugar de usar insultos.",
  },
  {
    pattern: /\b(ojala no hubieras nacido)\b/i,
    suggestion:
      "Este tipo de comentario es extremadamente dañino. Considera detenerte antes de enviarlo.",
  },
  {
    pattern: /\b(me das asco)\b/i,
    suggestion:
      "Si algo te molestó, intenta describir la situación sin humillar.",
  },
  {
    pattern: /\b(nadie te quiere)\b/i,
    suggestion:
      "Este comentario puede ser muy hiriente. Considera reformularlo de forma respetuosa.",
  },
  {
    pattern: /\b(cierra la boca|callate)\b/i,
    suggestion:
      "Podrías decir: 'Prefiero hablar de esto en otro momento'.",
  },
  {
    pattern: /\b(eres patetico|patetica)\b/i,
    suggestion:
      "Evita descalificar. Intenta explicar por qué no estás de acuerdo.",
  },
  {
    pattern: /\b(que estupidez|que idiotez)\b/i,
    suggestion:
      "Podrías decir: 'No creo que esa sea la mejor idea'.",
  },
  {
    pattern: /\b(no tienes cerebro)\b/i,
    suggestion:
      "Evita ataques personales. Intenta centrarte en el argumento.",
  },
  {
    pattern: /\b(me arruinaste la vida)\b/i,
    suggestion:
      "Podrías expresar cómo te sientes sin culpar totalmente a la otra persona.",
  },
  {
    pattern: /\b(eres una basura)\b/i,
    suggestion:
      "Este tipo de insultos no ayudan a resolver el problema.",
  },
  {
    pattern: /\b(me das vergüenza)\b/i,
    suggestion:
      "Podrías decir: 'Me siento incómodo con lo que pasó'.",
  },
  {
    pattern: /\b(no quiero volver a verte)\b/i,
    suggestion:
      "Si necesitas espacio, intenta decirlo de forma calmada.",
  },
  {
    pattern: /\b(eres lo peor)\b/i,
    suggestion:
      "Evita generalizaciones. Describe la situación específica.",
  },
  {
    pattern: /\b(todo es tu culpa)\b/i,
    suggestion:
      "Podrías decir: 'Creo que ambos contribuimos al problema'.",
  },
  {
    pattern: /\b(no entiendes nada)\b/i,
    suggestion:
      "Podrías intentar explicar tu punto con más claridad.",
  },
  {
    pattern: /\b(apestas)\b/i,
    suggestion:
      "Evita comentarios humillantes. Considera una crítica constructiva.",
  },
  {
    pattern: /\b(eres un desastre)\b/i,
    suggestion:
      "Podrías señalar qué salió mal sin descalificar.",
  },
  {
    pattern: /\b(que ridiculo)\b/i,
    suggestion:
      "En lugar de burlarte, intenta explicar tu desacuerdo.",
  },
  {
    pattern: /\b(nunca haces nada bien)\b/i,
    suggestion:
      "Evita generalizaciones. Habla de un hecho específico.",
  },
  {
    pattern: /\b(eres insoportable)\b/i,
    suggestion:
      "Podrías decir: 'Esta situación me está resultando difícil'.",
  },
  {
    pattern: /\b(que pena das)\b/i,
    suggestion:
      "Evita humillar. Intenta expresar tu molestia con respeto.",
  },
  {
    pattern: /\b(largate)\b/i,
    suggestion:
      "Si necesitas espacio, podrías decirlo de forma más calmada.",
  },
  {
    pattern: /\b(no me importas)\b/i,
    suggestion:
      "Podrías expresar tus emociones sin invalidar a la otra persona.",
  },
  {
    pattern: /\b(te detesto)\b/i,
    suggestion:
      "Podrías decir: 'Estoy muy molesto contigo en este momento'.",
  }
];