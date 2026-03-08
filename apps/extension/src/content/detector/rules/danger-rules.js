export const DANGER_PATTERNS = {
  THREAT: {
    level: "HIGH",
    label: "Amenaza",
    emoji: "🔴",
    patterns: [
      /te voy a (matar|golpear|lastimar|encontrar|hacer dano)/i,
      /voy a (publicar|filtrar|difundir) (tus fotos|tus videos|eso)/i,
      /si no (me mandas|haces|obedeces).{0,30}(te arrepentiras|lo vas a lamentar|te va a ir mal)/i,
      /se donde (vives|estudias|trabajas)/i,
      /te voy a (arruinar|destruir|exponer)/i,
      /(amenaza|mato|te hago dano)/i,
      /si me (bloqueas|ignoras).{0,20}(te (busco|encuentro|mato))/i,
    ],
  },
  GROOMING: {
    level: "HIGH",
    label: "Grooming",
    emoji: "🔴",
    patterns: [
      /no (le|les) (digas|cuentes|avises) a (nadie|tus papas|tus padres|tu mama|tu papa)/i,
      /eres (muy )?(madura|maduro|grande|especial) para tu edad/i,
      /(pasame|mandame|enviame).{0,20}(foto|video|imagen).{0,20}(privad[ao]|intim[ao]|sin ropa|desnud[ao])/i,
      /nadie (tiene que|debe) saber(lo)?/i,
      /esto es (nuestro secreto|solo entre nosotros)/i,
      /confias en mi[,.]? verdad\??/i,
      /cuantos anos (tienes|cumpliste)/i,
      /te puedo (ver|visitar|encontrar) (solo[a]?|a solas)/i,
      /estas sol[ao] en casa/i,
    ],
  },
  SEXTORSION: {
    level: "HIGH",
    label: "Sextorsion",
    emoji: "🔴",
    patterns: [
      /(tengo|tenemos) (fotos|videos|capturas) tuy[ao]s/i,
      /publico (las fotos|los videos|todo) si no/i,
      /paga.{0,20}o (publico|filtro|difundo)/i,
      /mandame (mas fotos|dinero).{0,20}o (todos|todos van a ver)/i,
    ],
  },
  HARASSMENT: {
    level: "MEDIUM",
    label: "Acoso",
    emoji: "🟡",
    patterns: [
      /(eres|que) (fea|feo|gorda|gordo|estupid[ao]|idiot[ao]|imbecil)/i,
      /mas(vale|te vale) que (hagas|me des|obedezcas)/i,
      /nobody likes you|nadie te quiere/i,
      /deberia(s)? (morir|desaparecer|no existir)/i,
      /matate|suicidate/i,
      /te odio(s)? y (todos|nadie).{0,20}tambien/i,
    ],
  },
  EXPLICIT_REQUEST: {
    level: "HIGH",
    label: "Solicitud Explicita",
    emoji: "🔴",
    patterns: [
      /(mandame|pasame|enviame).{0,30}(foto|video|pic).{0,20}(tus (senos|pechos|cuerpo|partes|nalgas|pene|vagina))/i,
      /(me puedes|puedes) mandar(me)? (algo|una foto) (hot|sexy|atrevid[ao]|sin ropa)/i,
      /muestrame (tus|tu) (cuerpo|pecho|vagina|pene)/i,
    ],
  },
  DOXXING: {
    level: "HIGH",
    label: "Doxeo",
    emoji: "🔴",
    patterns: [
      /voy a (publicar|exponer|difundir) (tu direccion|donde vives|tu info personal)/i,
      /ya tengo (tu direccion|tus datos|donde vives)/i,
      /te voy a (doxear|doxiar)/i,
    ],
  },
};

export const GROOMING_ESCALATION = [
  {
    pattern:
      /hola,? (eres|que tal eres).{0,20}(guap[ao]|bonit[ao]|hermoso|hermosa)/i,
    score: 1,
  },
  { pattern: /(cuantos anos|que edad) (tienes|cumpliste)/i, score: 2 },
  { pattern: /(confias|confias) en mi/i, score: 3 },
  { pattern: /nadie (tiene que|debe) saber/i, score: 4 },
  { pattern: /(foto|video).{0,20}(privad[ao]|intim[ao]|sin ropa)/i, score: 5 },
  { pattern: /no (le|les) (digas|cuentes) a (nadie|tus papas)/i, score: 4 },
  { pattern: /eres (muy )?(madura|maduro) para tu edad/i, score: 4 },
];
