# Hack-violencia

## Cómo probar tu extensión paso a paso

### 1. Instalarla en Chrome

Desde este repositorio, la extension se carga desde `apps/extension/dist`.

1. Abre una terminal en `apps/extension`
2. Instala dependencias y genera el build:

```powershell
npm install
npm run build
```

3. Abre Chrome y ve a: **`chrome://extensions/`**
4. Activa el switch **"Modo desarrollador"** (arriba a la derecha)
5. Haz clic en **"Cargar extension sin empaquetar"**
6. Selecciona la carpeta `apps/extension/dist` (la que contiene `manifest.json`)

Si ya existe la carpeta `dist`, puedes omitir `npm run build` en la primera instalacion.

Deberías ver el ícono del escudo 🛡️ aparecer en tu barra de herramientas.

### 2. Probar el Escudo Inteligente (detección de mensajes)

Como no puedes enviar mensajes reales peligrosos para probar, la forma más fácil es abrir la consola del desarrollador en WhatsApp Web o Instagram y **simular un mensaje**:

1. Ve a **web.whatsapp.com** (inicia sesión)
2. Abre cualquier chat
3. Presiona `F12` → pestaña **Console**
4. Pega este código para simular un mensaje peligroso:

```javascript
const fakeMsg = document.createElement("span");
fakeMsg.setAttribute("dir", "ltr");
fakeMsg.textContent =
  "No le digas a nadie que hablamos, eres muy madura para tu edad";
document.querySelector(".copyable-text")?.appendChild(fakeMsg);
```

Deberías ver aparecer el banner rojo de advertencia de Escudo Digital.

### 3. Probar la Reescritura Ética

1. Ve a cualquier red social (Instagram, Facebook, etc.)
2. Haz clic en el cuadro de texto para escribir un mensaje
3. Escribe algo como: `eres una estúpida`
4. Espera ~1 segundo → debería aparecer el banner azul con la sugerencia

### 4. Probar el Dashboard y Educación

1. Haz clic en el ícono 🛡️ de la barra de Chrome
2. Ve a la pestaña **"Accesos"**
3. Haz clic en **"Dashboard"** o **"Educación"** → se abren como páginas completas

### 5. Configurar tu email de alertas

1. Clic en el ícono → pestaña **"Config"**
2. Escribe tu correo en el campo de email
3. Activa/desactiva las opciones que quieras
4. Haz clic en **"Guardar configuración"**

### ⚠️ Si algo no funciona

Lo más común al probar por primera vez:

- **No aparece el banner** → Recarga la página de la red social después de instalar la extensión (las extensiones no afectan pestañas ya abiertas)
- **Error en `chrome://extensions/`** → Revisa que seleccionaste `apps/extension/dist` (esa carpeta debe contener `manifest.json` directamente)
- **El ícono no aparece** → Haz clic en el ícono de puzzle 🧩 en Chrome y fija "Escudo Digital"

¿Quieres que ajuste algún selector para una red social específica, o que agregue más patrones de detección?