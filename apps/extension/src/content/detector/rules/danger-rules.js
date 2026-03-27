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

      /vas a ver lo que te pasa/i,
      /te voy a hacer pagar/i,
      /te voy a encontrar/i,
      /no sabes con quien te metiste/i,
      /te voy a hacer la vida imposible/i,
      /te voy a perseguir/i,
      /te voy a romper la cara/i,
      /te voy a dar una paliza/i,
      /te conviene hacer lo que digo/i,
      /si no haces caso te ira muy mal/i
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

      /eres muy linda para tu edad/i,
      /pareces mayor/i,
      /no pareces de tu edad/i,
      /seguro eres mas madura que los demas/i,
      /podemos hablar en secreto/i,
      /esto queda entre tu y yo/i,
      /no le digas a tus padres/i,
      /eres mi favorita/i,
      /solo quiero hablar contigo/i,
      /los demas no entenderian/i,
      /me gustas mucho/i,
      /podemos tener nuestro secreto/i,
      /te puedo llamar en privado/i,
      /podemos hablar por otra app/i,
      /tienes whatsapp/i,
      /tienes telegram/i,
      /pasame tu numero/i,
      /borra el chat/i
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

      /si no pagas publico todo/i,
      /voy a enviar tus fotos/i,
      /tengo capturas de ti/i,
      /voy a arruinar tu vida/i,
      /voy a mandar esto a tu familia/i,
      /voy a mandarlo a tus amigos/i,
      /todos veran tus fotos/i,
      /si no cooperas publico todo/i,
      /tengo pruebas tuyas/i,
      /si no haces caso lo subo a internet/i
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

      /eres un[a]? inutil/i,
      /nadie te soporta/i,
      /das asco/i,
      /que ridicul[oa]/i,
      /no sirves para nada/i,
      /callate idiota/i,
      /eres patetic[oa]/i,
      /ojala desaparezcas/i,
      /eres basura/i,
      /eres un error/i
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

      /mandame una foto sexy/i,
      /quiero verte sin ropa/i,
      /envia una foto privada/i,
      /quiero ver tu cuerpo/i,
      /mandame algo hot/i,
      /quiero fotos tuyas/i,
      /quiero verte desnudo/i,
      /quiero verte desnuda/i,
      /muestrame mas/i,
      /mandame fotos intimas/i
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

      /voy a publicar tus datos/i,
      /voy a subir tu informacion/i,
      /todos sabran donde vives/i,
      /voy a compartir tu numero/i,
      /voy a exponer tu identidad/i,
      /voy a mostrar quien eres/i
    ],
  },
};

export const GROOMING_ESCALATION = [
  { pattern: /hola.*(bonit[ao]|guap[ao]|lind[ao])/i, score: 1 },
  { pattern: /(que edad|cuantos anos)/i, score: 2 },
  { pattern: /tienes novi[oa]/i, score: 2 },
  { pattern: /confias en mi/i, score: 3 },
  { pattern: /podemos tener un secreto/i, score: 4 },
  { pattern: /nadie tiene que saber/i, score: 4 },
  { pattern: /borra el chat/i, score: 4 },
  { pattern: /(foto|video).{0,20}(privad|intim|sin ropa)/i, score: 5 },
  { pattern: /te puedo ver a solas/i, score: 5 },
  { pattern: /estas solo en casa/i, score: 5 }
];