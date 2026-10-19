(() => {
  // Ruta de la carpeta donde vive este script (para encontrar css e img)
  const BASE = new URL('.', document.currentScript.src).href;

  // Mientras pruebas en n8n usa /webhook-test/...; en producción /webhook/...
  const WEBHOOK_URL = 'https://mexamerik.app.n8n.cloud/webhook/rutilio-chat';

  // Cargar estilos (si ya dejaste el <link> en el index, se puede borrar uno de los dos)
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = BASE + 'chatbot.css';
  document.head.appendChild(css);

  // Id de sesión persistente (para que n8n recuerde la conversación)
  let sessionId = localStorage.getItem('rutilio_session');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('rutilio_session', sessionId);
  }

  // Crear HTML
  const root = document.createElement('div');
  root.innerHTML = `
    <button id="rutilio-launcher" aria-label="Abrir chat">
      <img src="${BASE}img/Burbuja-Rutilio1.svg" alt="Rutilio">
    </button>
    <div id="rutilio-window" role="dialog" aria-label="Chat Rutilio">
      <div class="rutilio-header">
        <img src="${BASE}img/chatbot-rutilio1.svg" alt="">
        <span>Rutilio</span>
        <button id="rutilio-close" aria-label="Cerrar">×</button>
      </div>
      <div class="rutilio-messages" id="rutilio-messages"></div>
      <form class="rutilio-form" id="rutilio-form">
        <input id="rutilio-input" type="text" placeholder="Escribe tu pregunta..." autocomplete="off">
        <button type="submit">Enviar</button>
      </form>
    </div>`;
  document.body.appendChild(root);

  const $ = (id) => document.getElementById(id);
  const win = $('rutilio-window'), msgs = $('rutilio-messages');
  const form = $('rutilio-form'), input = $('rutilio-input');
  const sendBtn = form.querySelector('button');

  function addMsg(text, who) {
    const d = document.createElement('div');
    d.className = `rutilio-msg ${who}`;
    d.textContent = text; // textContent evita inyección de HTML
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  $('rutilio-launcher').onclick = () => {
    win.classList.toggle('open');
    if (win.classList.contains('open')) {
      if (!msgs.children.length) addMsg('¡Hola! Soy Rutilio 👋 ¿En qué te puedo ayudar?', 'bot');
      input.focus();
    }
  };
  $('rutilio-close').onclick = () => win.classList.remove('open');

  form.onsubmit = async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addMsg(text, 'user');
    input.value = '';
    sendBtn.disabled = true;
    const typing = addMsg('Rutilio está escribiendo...', 'bot typing');

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId })
      });
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      typing.remove();
      addMsg(data.reply || 'No pude generar una respuesta.', 'bot');
    } catch (err) {
      typing.remove();
      addMsg('Ups, tuve un problema para conectarme. Intenta de nuevo.', 'bot');
      console.error('Chatbot error:', err);
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  };
})();