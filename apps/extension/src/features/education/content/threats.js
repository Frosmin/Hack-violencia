import { User, Lock, MapPin, Flame, UserX, Brain } from "lucide-react";

export const THREATS = [
  {
    id: "grooming",
    icon: User,
    label: "Grooming",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.2)",
    tagline: "Manipulación progresiva hacia menores",
    what: "Un adulto gana la confianza de un menor paso a paso para obtener imágenes íntimas, dinero o encuentros físicos. Siempre empieza como amistad.",
    signals: [
      "«No le cuentes a nadie que hablamos»",
      "«Eres muy madura/o para tu edad»",
      "«¿Estás solo/a en casa?»",
      "«Esto es nuestro secreto»",
      "Regalos o dinero sin motivo",
      "Pide fotos o videos privados",
      "Insiste en verse en persona",
      "Te hace sentir especial y «diferente»",
    ],
    steps: [
      {
        action: "Para la conversación",
        detail: "No respondas, no expliques. Bloquea de inmediato.",
      },
      {
        action: "Guarda evidencia",
        detail: "Capturas con fecha visible antes de bloquear.",
      },
      {
        action: "Cuéntaselo a un adulto",
        detail: "Familiar, docente o persona de confianza ahora.",
      },
      {
        action: "Denuncia",
        detail: "Policía cibernética o fiscalía de tu país con las capturas.",
      },
    ],
    remember: "No es tu culpa. El groomer sabe exactamente lo que hace.",
  },
  {
    id: "sextorsion",
    icon: Lock,
    label: "Sextorsión",
    color: "#f472b6",
    bg: "rgba(244,114,182,0.08)",
    border: "rgba(244,114,182,0.2)",
    tagline: "Chantaje con contenido íntimo real o falso",
    what: "Alguien amenaza con publicar fotos o videos íntimos tuyos a cambio de dinero, más fotos o favores sexuales. A veces el contenido ni siquiera existe.",
    signals: [
      "«Tengo fotos/videos tuyos»",
      "«Paga o los publico»",
      "«Mándame más o se los mando a tus contactos»",
      "Mensajes desde cuentas desconocidas",
      "Presión extrema con plazos cortos",
      "Amenaza de enviarlo a familia o trabajo",
    ],
    steps: [
      {
        action: "NO pagues, NUNCA",
        detail: "Pagar confirma que tienes miedo. Siempre piden más.",
      },
      {
        action: "NO envíes más contenido",
        detail: "Cada imagen extra es más poder para ellos.",
      },
      {
        action: "Guarda todo",
        detail: "Capturas del perfil, mensajes y cuenta del agresor.",
      },
      {
        action: "Reporta en la plataforma",
        detail: "Todas las redes tienen opción de reportar sextorsión.",
      },
      {
        action: "Denuncia formalmente",
        detail: "Es un delito grave. Ve a la fiscalía con evidencia.",
      },
      {
        action: "Usa StopNCII.org",
        detail: "Pueden prevenir que las imágenes circulen en línea.",
      },
    ],
    remember: "Ceder no lo detiene. Denunciar sí.",
  },
  {
    id: "doxxing",
    icon: MapPin,
    label: "Doxxing",
    color: "#fb923c",
    bg: "rgba(251,146,60,0.08)",
    border: "rgba(251,146,60,0.2)",
    tagline: "Exposición pública de tus datos privados",
    what: "Alguien publica tu dirección, teléfono, lugar de trabajo o datos personales sin tu permiso, generalmente para que otros te acosen o amenacen.",
    signals: [
      "«Ya sé dónde vives»",
      "«Voy a exponer toda tu información»",
      "Tu dirección aparece en foros o redes",
      "Mensajes amenazantes de desconocidos",
      "Llamadas o visitas no solicitadas",
      "Alguien menciona detalles que no compartiste",
    ],
    steps: [
      {
        action: "Documenta primero",
        detail: "Capturas de todo lo publicado antes de que lo borren.",
      },
      {
        action: "Reporta el contenido",
        detail: "Solicita eliminación en la plataforma donde está publicado.",
      },
      {
        action: "Avisa a familia y amigos",
        detail: "Que estén alerta y no abran información de desconocidos.",
      },
      {
        action: "Revisa tu privacidad",
        detail: "Pon tus cuentas en privado temporalmente.",
      },
      {
        action: "Denuncia",
        detail: "Presentar denuncia con evidencia ante autoridades.",
      },
    ],
    remember:
      "Googléate a ti mismo/a ahora para saber qué información tuya es pública.",
    prevention: [
      "Usa seudónimo en redes públicas",
      "No publiques tu ubicación en tiempo real",
      "Activa 2FA en todas tus cuentas",
      "Revisa permisos de apps cada 3 meses",
    ],
  },
  {
    id: "acoso",
    icon: Flame,
    label: "Acoso digital",
    color: "#f87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.2)",
    tagline: "Ciberbullying y hostigamiento en línea",
    what: "Insultos, humillaciones públicas, rumores falsos, exclusión deliberada o amenazas repetidas a través de redes, mensajes o grupos. Puede ser de una persona o grupo.",
    signals: [
      "Mensajes insultantes o humillantes repetidos",
      "Publicaciones falsas sobre ti",
      "Ser excluido/a o bloqueado/a de grupos",
      "Campañas organizadas para atacarte",
      "Memes o contenido burla con tu imagen",
      "Suplantación de tu cuenta para difamarte",
    ],
    steps: [
      {
        action: "No respondas en caliente",
        detail: "Responder public­amente escala el conflicto.",
      },
      {
        action: "Guarda evidencia",
        detail: "Capturas con fecha, hora y perfil del agresor.",
      },
      {
        action: "Bloquea y reporta",
        detail: "En todas las plataformas donde ocurra.",
      },
      {
        action: "Habla con alguien",
        detail: "No cargues esto solo/a. Busca apoyo emocional.",
      },
      {
        action: "Denuncia si hay amenazas",
        detail: "Las amenazas directas son delito. Ve a la policía.",
      },
    ],
    remember: "El silencio no es conformidad. Documentar es poder.",
  },
  {
    id: "suplantacion",
    icon: UserX,
    label: "Suplantación",
    color: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
    tagline: "Alguien usa tu identidad sin permiso",
    what: "Crean perfiles falsos con tu nombre y fotos, o acceden a tus cuentas reales para hacerse pasar por ti, estafar a tus contactos o dañar tu reputación.",
    signals: [
      "Amigos reciben mensajes «tuyos» que no enviaste",
      "Encuentras un perfil con tu nombre y fotos",
      "Te llegan alertas de inicio de sesión desconocidos",
      "Pierdes acceso a tu propia cuenta",
      "Publicaciones en tu nombre que tú no hiciste",
      "Conocidos te preguntan por mensajes extraños",
    ],
    steps: [
      {
        action: "Avisa a tus contactos",
        detail: "Que no respondan ni envíen dinero al perfil falso.",
      },
      {
        action: "Reporta el perfil falso",
        detail: "Cada red social tiene un proceso de reporte por identidad.",
      },
      {
        action: "Recupera el acceso",
        detail: "Usa «olvidé mi contraseña» y activa 2FA de inmediato.",
      },
      {
        action: "Cambia contraseñas",
        detail: "Usa contraseñas únicas por plataforma. Usa un gestor.",
      },
      {
        action: "Denuncia",
        detail:
          "La suplantación de identidad es delito en la mayoría de países.",
      },
    ],
    remember:
      "Activa verificación en dos pasos hoy. Es el mejor escudo contra el acceso no autorizado.",
  },
  {
    id: "manipulacion",
    icon: Brain,
    label: "Manipulación",
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.08)",
    border: "rgba(56,189,248,0.2)",
    tagline: "Control emocional y psicológico en línea",
    what: "Alguien usa tácticas psicológicas para controlarte, aislarte de tu entorno o hacerte sentir que dependes de ellos. Puede ocurrir en relaciones, grupos o con desconocidos.",
    signals: [
      "Te hacen sentir culpable por poner límites",
      "«Si me quisieras, harías esto»",
      "Te alejan de amigos y familia",
      "Niegan cosas que sí dijeron (gaslighting)",
      "Alternan entre elogios extremos y críticas",
      "Amenazas veladas si no obedeces",
      "Controlan con quién hablas o qué publicas",
    ],
    steps: [
      {
        action: "Nombra lo que pasa",
        detail: "Reconocer la manipulación es el primer paso para salir.",
      },
      {
        action: "Pon límites en escrito",
        detail: "Comunica tus límites por mensaje. Queda como evidencia.",
      },
      {
        action: "Habla con alguien externo",
        detail: "Familia, amigo/a o profesional de salud mental.",
      },
      {
        action: "Reduce o corta el contacto",
        detail: "No debes justificarte para alejarte de alguien tóxico.",
      },
      {
        action: "Busca apoyo profesional",
        detail: "Un psicólogo puede ayudarte a procesar el daño.",
      },
    ],
    remember: "Poner límites no es agresión. Es autoprotección.",
  },
];
