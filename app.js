document.addEventListener('DOMContentLoaded', () => {
  let baseProductos = [
    { id: 1, nombre: 'Maíz Gigante del Cusco', categoria: 'Granos', region: 'Sierra', tipo: 'Menor', precio: 3.80, unidad: '/ kg', img: 'Imagenes/WhatsApp Image 2026-11-06 at 3.19.59 PM (1).jpeg', desc: 'Grano nativo del Valle Sagrado de Urubamba, ideal para chicha, mote y comida tradicional.', destacado: true },
    { id: 2, nombre: 'Maíz Morado Culli', categoria: 'Granos', region: 'Sierra', tipo: 'Menor', precio: 4.50, unidad: '/ kg', img: 'Imagenes/WhatsApp Image 2026-11-06 at 3.19.59 PM.jpeg', desc: 'Variedad andina con alto contenido de antocianinas y sabor distintivo.', destacado: true },
    { id: 3, nombre: 'Saco de maíz blanco (50kg)', categoria: 'Granos', region: 'Sierra', tipo: 'Mayor', precio: 175.00, unidad: '/ saco 50kg', img: 'Imagenes/WhatsApp Image 2026-11-06 at 3.19.59 PM (2).jpeg', desc: 'Lote mayorista para restaurantes, molinos y distribuidores regionales.', destacado: false },
    { id: 4, nombre: 'Kiwicha orgánica', categoria: 'Granos', region: 'Sierra', tipo: 'Menor', precio: 9.50, unidad: '/ kg', img: 'Imagenes/WhatsApp Image 2026-11-06 at 3.19.59 PM (5).jpeg', desc: 'Superalimento andino libre de amargor, rico en proteína y minerales.', destacado: false },
    { id: 5, nombre: 'Papa nativa Tumbay', categoria: 'Tubérculos', region: 'Sierra', tipo: 'Menor', precio: 2.50, unidad: '/ kg', img: 'Imagenes/WhatsApp Image 2026-11-06 at 3.19.59 PM (7).jpeg', desc: 'Cosechada en zonas altas, con textura arenosa y sabor auténtico.', destacado: true },
    { id: 6, nombre: 'Papa Huamantanga', categoria: 'Tubérculos', region: 'Sierra', tipo: 'Menor', precio: 3.20, unidad: '/ kg', img: 'Imagenes/WhatsApp Image 2026-11-06 at 3.19.59 PM (8).jpeg', desc: 'Papa cremosa y sabrosa ideal para sopas, guisos y platos caseros.', destacado: false },
    { id: 7, nombre: 'Saco de papa camotillo (100kg)', categoria: 'Tubérculos', region: 'Sierra', tipo: 'Mayor', precio: 210.00, unidad: '/ saco 100kg', img: 'Imagenes/WhatsApp Image 2026-11-06 at 3.19.59 PM (9).jpeg', desc: 'Producto para venta institucional y distribución regional de alto volumen.', destacado: false },
    { id: 8, nombre: 'Camote morado de valle', categoria: 'Tubérculos', region: 'Sierra', tipo: 'Menor', precio: 2.80, unidad: '/ kg', img: 'Imagenes/WhatsApp Image 2026-11-06 at 3.19.59 PM (11).jpeg', desc: 'Dulce, nutritivo y muy demandado por su sabor natural y color intenso.', destacado: false },
    { id: 9, nombre: 'Palta Hass premium', categoria: 'Frutas', region: 'Costa', tipo: 'Menor', precio: 5.00, unidad: '/ kg', img: 'Imagenes/WhatsApp Image 2026-11-06 at 3.20.00 PM (2).jpeg', desc: 'Fruto de textura cremosa y sabor equilibrado, ideal para consumo directo.', destacado: true },
    { id: 10, nombre: 'Jaba de palta Hass (20kg)', categoria: 'Frutas', region: 'Costa', tipo: 'Mayor', precio: 90.00, unidad: '/ jaba 20kg', img: 'Imagenes/WhatsApp Image 2026-11-06 at 3.20.00 PM (3).jpeg', desc: 'Caja seleccionada para comercio mayorista y distribución comercial.', destacado: false },
    { id: 11, nombre: 'Mango Kent de Chulucanas', categoria: 'Frutas', region: 'Costa', tipo: 'Menor', precio: 4.80, unidad: '/ kg', img: 'Imagenes/WhatsApp Image 2026-11-06 at 3.20.00 PM (5).jpeg', desc: 'Mango dulce y jugoso, muy solicitado en mercados locales y regionales.', destacado: false },
    { id: 12, nombre: 'Lúcuma de seda', categoria: 'Frutas', region: 'Sierra', tipo: 'Menor', precio: 7.50, unidad: '/ kg', img: 'Imagenes/WhatsApp Image 2026-11-06 at 3.20.00 PM (2).jpeg', desc: 'Aroma intenso y pulpa cremosa para heladería, postres y jugos.', destacado: false },
    { id: 13, nombre: 'Quinua orgánica roja', categoria: 'Superalimentos', region: 'Sierra', tipo: 'Menor', precio: 12.00, unidad: '/ kg', img: 'Imagenes/WhatsApp Image 2026-11-06 at 3.19.59 PM (5).jpeg', desc: 'Grano andino de alto valor nutricional, perfecto para preparación saludable.', destacado: true },
    { id: 14, nombre: 'Quinua blanca pearl', categoria: 'Superalimentos', region: 'Sierra', tipo: 'Menor', precio: 10.50, unidad: '/ kg', img: 'Imagenes/WhatsApp Image 2026-11-06 at 3.19.59 PM (5).jpeg', desc: 'Variedad amable, limpia y de excelente cocción para cocina diaria.', destacado: false },
    { id: 15, nombre: 'Saco de quinua blanca (25kg)', categoria: 'Superalimentos', region: 'Sierra', tipo: 'Mayor', precio: 230.00, unidad: '/ saco 25kg', img: 'Imagenes/WhatsApp Image 2026-11-06 at 3.19.59 PM (5).jpeg', desc: 'Presentación ideal para distribuidores y negocios de alimentación saludable.', destacado: false },
    { id: 16, nombre: 'Yuca amarilla de selva', categoria: 'Tubérculos', region: 'Selva', tipo: 'Menor', precio: 2.60, unidad: '/ kg', img: 'Imagenes/WhatsApp Image 2026-11-06 at 3.20.00 PM (2).jpeg', desc: 'Raíz de excelente rendimiento y sabor suave para cocina tradicional.', destacado: false },
    { id: 17, nombre: 'Papa canchán comercial', categoria: 'Tubérculos', region: 'Costa', tipo: 'Menor', precio: 1.80, unidad: '/ kg', img: 'Imagenes/WhatsApp Image 2026-11-06 at 3.19.59 PM (10).jpeg', desc: 'Opción accesible para restaurantes y venta local con buena competitividad.', destacado: false },
    { id: 18, nombre: 'Palta fuerte de valle', categoria: 'Frutas', region: 'Costa', tipo: 'Menor', precio: 6.00, unidad: '/ kg', img: 'Imagenes/WhatsApp Image 2026-11-06 at 3.20.00 PM (4).jpeg', desc: 'Palta de excelente consistencia para consumo y preparación de alimentos.', destacado: false },
    { id: 19, nombre: 'Chirimoya Cumbe', categoria: 'Frutas', region: 'Sierra', tipo: 'Menor', precio: 8.50, unidad: '/ kg', img: 'Imagenes/WhatsApp Image 2026-11-06 at 3.20.00 PM (4).jpeg', desc: 'Pulpa blanca, dulce y jugosa con gran valor para el mercado gourmet.', destacado: false },
    { id: 20, nombre: 'Tarwi / chocho lavado', categoria: 'Granos', region: 'Sierra', tipo: 'Menor', precio: 8.00, unidad: '/ kg', img: 'Imagenes/WhatsApp Image 2026-11-06 at 3.19.59 PM (6).jpeg', desc: 'Leguminosa andina rica en proteína para dietas balanceadas y tradicionales.', destacado: false }
  ];

  let filtroBusqueda = '';
  let productosFiltrados = [...baseProductos];
  let cart = [];
  let sessionUser = null;
  let activeConversation = null;
  let activeTransportRequestId = null;
  let availableChatItems = [];
  let activeSupportTicketId = null;
  let supportChatMode = 'assistant';
  let messagePollTimer = null;
  let messageListPollTimer = null;
  let transportMessagePollTimer = null;
  let transportRequestsPollTimer = null;
  let dashboardDataPollTimer = null;
  let dashboardPollInFlight = false;
  let supportMessagePollTimer = null;
  let resetToken = new URLSearchParams(window.location.search).get('restablecer');

  async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
      credentials: 'same-origin',
      ...options,
      headers: { ...(options.headers || {}), ...(options.body ? { 'Content-Type': 'application/json' } : {}) }
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || 'No se pudo completar la solicitud.');
    return payload;
  }

  async function optimizeProductImage(file) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      throw new Error('Elige una imagen JPG, PNG o WebP.');
    }
    if (file.size > 10 * 1024 * 1024) throw new Error('La imagen original no puede superar 10 MB.');
    if (typeof createImageBitmap !== 'function') {
      throw new Error('Este navegador no permite optimizar la imagen. Actualízalo e inténtalo otra vez.');
    }
    const bitmap = await createImageBitmap(file);
    try {
      const scale = Math.min(1, 1280 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('No se pudo procesar la imagen seleccionada.');
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      for (let quality = 0.82; quality >= 0.5; quality -= 0.08) {
        const result = canvas.toDataURL('image/jpeg', quality);
        if (Math.ceil((result.length - result.indexOf(',') - 1) * 0.75) <= 1000000) return result;
      }
      throw new Error('No se pudo reducir la imagen a 1 MB. Elige una foto más pequeña.');
    } finally {
      bitmap.close();
    }
  }

  const catalogoGrid = document.getElementById('catalogoGrid');
  const destacadosContainer = document.getElementById('destacadosContainer');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const searchBtn = document.getElementById('searchBtn');
  const sortSelect = document.getElementById('sortSelect');
  const resultsCount = document.getElementById('resultsCount');
  const cartCount = document.getElementById('cartCount');
  const cartModal = document.getElementById('cartModal');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartTotal = document.getElementById('cartTotal');
  const toast = document.getElementById('toast');

  function cambiarPestana(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.toggle('active', tab.id === tabId);
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    const navMenu = document.getElementById('nav-menu');
    if (navMenu && navMenu.classList.contains('show')) {
      navMenu.classList.remove('show');
    }
    if (tabId === 'tab-messages' && sessionUser) {
      loadConversations().catch(error => showToast(error.message));
      if (!messageListPollTimer) {
        messageListPollTimer = window.setInterval(() => {
          if (sessionUser && document.getElementById('tab-messages').classList.contains('active')) {
            loadConversations().catch(error => console.error('No se pudo actualizar la lista de chats:', error));
          }
        }, 5000);
      }
    }
  }

  document.querySelectorAll('.tab-btn, .nav-tab').forEach(button => {
    button.addEventListener('click', () => {
      const tab = button.dataset.tab;
      if (!tab) return;
      const role = button.dataset.role;
      if (role === 'Comprador' || role === 'Distribuidor' || role === 'Productor') seleccionarRol(role);
      if (tab === 'tab-contacto' && sessionUser) {
        cambiarPestana('tab-dashboard');
        showToast('Ya tienes una cuenta. Desde Mi panel puedes gestionar tu perfil.');
        cerrarModal(cartModal);
        cerrarModal(profileModal);
        return;
      }
      cerrarModal(cartModal);
      cerrarModal(profileModal);
      cambiarPestana(tab);
    });
  });

  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('show');
      menuToggle.setAttribute('aria-expanded', navMenu.classList.contains('show'));
    });
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3200);
  }

  const supportChatPanel = document.getElementById('supportChatPanel');
  const supportChatToggle = document.getElementById('supportChatToggle');
  const supportChatMessages = document.getElementById('supportChatMessages');
  const supportChatForm = document.getElementById('supportChatForm');
  const supportTopicOptions = document.getElementById('supportTopicOptions');
  const supportChatModeToggle = document.getElementById('supportChatModeToggle');
  const supportChatToggleLabel = supportChatToggle?.querySelector('span');
  const supportChatTitle = document.getElementById('supportChatTitle');
  const supportChatSubtitle = document.getElementById('supportChatSubtitle');
  const supportTranscriptStorageKey = 'agro_support_transcript';
  const supportTranscriptLimit = 500;
  const supportAssistantWelcome = '¡Hola! Puedo guiarte para registrarte, comprar, publicar una cosecha, coordinar transporte o recuperar tu cuenta. Escribe tu pregunta o elige un tema. Si mi guía no te sirve, podrás continuar aquí con el administrador.';
  let supportTranscript = [];
  let supportTopic = 'Consulta desde el asistente';
  try {
    const storedTranscript = JSON.parse(sessionStorage.getItem(supportTranscriptStorageKey) || '[]');
    if (Array.isArray(storedTranscript)) {
      supportTranscript = storedTranscript.filter(item =>
        ['user', 'assistant'].includes(item?.role) && typeof item.content === 'string'
      ).slice(-supportTranscriptLimit);
    }
  } catch (error) {
    console.error('No se pudo restaurar el historial local del asistente:', error);
  }

  function agregarMensajeChat(message, sender, link, messageId = null) {
    if (!supportChatMessages) return;
    const bubble = document.createElement('div');
    bubble.className = `chat-message ${sender}`;
    const author = document.createElement('strong');
    author.className = 'chat-message-author';
    author.textContent = sender === 'assistant'
      ? 'Asistente AgroConecta'
      : sessionUser?.nombre || 'Tú';
    const content = document.createElement('span');
    content.textContent = message;
    bubble.append(author, content);
    if (messageId !== null) bubble.dataset.supportMessageId = String(messageId);
    supportChatMessages.appendChild(bubble);
    if (link) {
      const linkElement = link === '#tab-support' ? document.createElement('button') : document.createElement('a');
      linkElement.className = 'chat-policy-link';
      if (link === '#tab-support') {
        linkElement.type = 'button';
        linkElement.addEventListener('click', () => cambiarPestana('tab-support'));
      } else {
        linkElement.href = link;
      }
      linkElement.textContent = 'Ver información relacionada';
      supportChatMessages.appendChild(linkElement);
    }
    supportChatMessages.scrollTop = supportChatMessages.scrollHeight;
  }

  function setChatOpen(open) {
    if (!supportChatPanel || !supportChatToggle) return;
    supportChatPanel.hidden = !open;
    supportChatToggle.setAttribute('aria-expanded', String(open));
    if (open) document.getElementById('supportChatInput')?.focus();
  }

  function persistSupportTranscript() {
    try {
      sessionStorage.setItem(supportTranscriptStorageKey,
        JSON.stringify(supportTranscript.slice(-supportTranscriptLimit)));
    } catch (error) {
      console.error('No se pudo conservar el historial del asistente:', error);
    }
  }

  function addSupportTranscriptMessage(role, content) {
    const message = { role, content };
    supportTranscript.push(message);
    supportTranscript = supportTranscript.slice(-supportTranscriptLimit);
    persistSupportTranscript();
    agregarMensajeChat(content, role === 'assistant' ? 'assistant' : 'user');
  }

  function removeSupportFeedback() {
    supportChatMessages?.querySelector('[data-support-feedback]')?.remove();
  }

  function showSupportTopics(show = true) {
    if (supportTopicOptions) supportTopicOptions.hidden = !show;
  }

  function updateSupportChatModeControls() {
    const isTicketMode = supportChatMode === 'ticket' && activeSupportTicketId;
    if (supportChatToggleLabel) {
      supportChatToggleLabel.textContent = isTicketMode ? 'Chat de soporte' : 'Asistente de ayuda';
    }
    if (supportChatTitle) {
      supportChatTitle.textContent = isTicketMode ? 'Chat con soporte' : 'Asistente AgroConecta';
    }
    if (supportChatSubtitle) {
      supportChatSubtitle.textContent = isTicketMode
        ? `Conversación #${activeSupportTicketId} con el administrador`
        : 'Guía de compras, cosechas y transporte';
    }
    if (supportChatModeToggle) {
      supportChatModeToggle.hidden = !activeSupportTicketId;
      supportChatModeToggle.textContent = isTicketMode ? 'Volver al asistente' : 'Continuar con soporte';
    }
    supportChatPanel?.setAttribute('aria-label', isTicketMode ? 'Chat con soporte' : 'Asistente de ayuda');
  }

  function renderAssistantConversation() {
    supportChatMessages.replaceChildren();
    agregarMensajeChat(supportAssistantWelcome, 'assistant');
    supportTranscript.forEach(item => {
      agregarMensajeChat(item.content, item.role === 'assistant' ? 'assistant' : 'user');
    });
    if (supportTranscript.length) showResolutionPrompt(true);
    else showSupportTopics(true);
  }

  function setSupportChatMode(mode) {
    if (mode === 'ticket' && activeSupportTicketId) {
      supportChatMode = 'ticket';
      updateSupportChatModeControls();
      showSupportTopics(false);
      loadSupportTicket(activeSupportTicketId, true).catch(error =>
        console.error('No se pudo abrir la conversación de soporte:', error)
      );
      if (!supportMessagePollTimer) {
        supportMessagePollTimer = window.setInterval(() => {
          if (activeSupportTicketId && supportChatMode === 'ticket') {
            loadSupportTicket(activeSupportTicketId).catch(error =>
              console.error('No se pudo actualizar el chat de soporte:', error)
            );
          }
        }, 4000);
      }
      return;
    }

    supportChatMode = 'assistant';
    updateSupportChatModeControls();
    renderAssistantConversation();
  }

  function showResolutionPrompt(answerResolved) {
    removeSupportFeedback();
    showSupportTopics(false);
    const feedback = document.createElement('div');
    feedback.className = 'support-resolution';
    feedback.dataset.supportFeedback = 'true';
    const question = document.createElement('p');
    question.textContent = answerResolved
      ? '¿Se resolvió tu duda?'
      : 'No pude resolverla con seguridad. ¿Quieres contactar con un administrador?';
    const controls = document.createElement('div');
    controls.className = 'support-resolution-actions';
    const first = document.createElement('button');
    first.type = 'button';
    first.dataset.supportDecision = answerResolved ? 'resolved' : 'continue';
    first.textContent = answerResolved ? 'Sí, gracias' : 'Seguir preguntando';
    const second = document.createElement('button');
    second.type = 'button';
    second.dataset.supportDecision = answerResolved ? 'unresolved' : 'escalate';
    second.textContent = answerResolved ? 'No, necesito ayuda' : 'Contactar administrador';
    controls.append(first, second);
    feedback.append(question, controls);
    supportChatMessages?.appendChild(feedback);
    supportChatMessages.scrollTop = supportChatMessages.scrollHeight;
  }

  supportChatToggle?.addEventListener('click', () => setChatOpen(supportChatPanel.hidden));
  document.getElementById('supportChatClose')?.addEventListener('click', () => setChatOpen(false));
  async function loadSupportTicket(ticketId, replace = false) {
    const lastId = replace ? 0 :
      Number(supportChatMessages.querySelector('[data-support-message-id]:last-child')?.dataset.supportMessageId) || 0;
    const { messages } = await apiRequest(
      `/api/support/tickets/${ticketId}/messages?after=${lastId}`
    );
    if (supportChatMode !== 'ticket' || Number(ticketId) !== activeSupportTicketId) return;
    if (replace) {
      supportChatMessages.replaceChildren();
      showSupportTopics(false);
    }
    messages.forEach(message => {
      const sender = message.remitente === 'admin' || message.remitente === 'assistant'
        ? message.remitente : 'user';
      agregarMensajeChat(message.contenido, sender, null, message.id);
    });
  }
  function activateSupportTicket(ticketId) {
    activeSupportTicketId = Number(ticketId);
    supportTranscript = [];
    try { sessionStorage.removeItem(supportTranscriptStorageKey); }
    catch (error) { console.error('No se pudo limpiar el historial local del asistente:', error); }
    try { sessionStorage.setItem('agro_support_ticket_id', String(activeSupportTicketId)); }
    catch (error) { console.error('No se pudo conservar el número de consulta en esta pestaña:', error); }
    setSupportChatMode('ticket');
  }
  async function sendSupportQuestion(message) {
    if (!message || supportChatMode !== 'assistant') return;
    removeSupportFeedback();
    showSupportTopics(false);
    addSupportTranscriptMessage('user', message);
    try {
      const response = await apiRequest('/api/support/assistant', {
        method: 'POST',
        body: JSON.stringify({
          asunto: supportTopic,
          mensaje: message,
          historial: supportTranscript
        })
      });
      if (response.derivado && response.ticketId) {
        activateSupportTicket(response.ticketId);
        setChatOpen(true);
        showToast(response.message || response.respuesta);
        return;
      }
      addSupportTranscriptMessage('assistant', response.respuesta);
      showResolutionPrompt(response.resuelto !== false);
    } catch (error) {
      console.error('No se pudo consultar el asistente:', error);
      addSupportTranscriptMessage(
        'assistant',
        'No pude consultar el asistente en este momento. Puedes volver a intentarlo o abrir el formulario de soporte.'
      );
      showSupportTopics(true);
    }
  }

  async function escalateSupportConversation() {
    addSupportTranscriptMessage('user', 'No, necesito ayuda de una persona.');
    removeSupportFeedback();
    try {
      const result = await apiRequest('/api/support/escalate', {
        method: 'POST',
        body: JSON.stringify({
          asunto: supportTopic,
          historial: supportTranscript
        })
      });
      activateSupportTicket(result.ticketId);
      setChatOpen(true);
      showToast(result.message);
    } catch (error) {
      console.error('No se pudo transferir la conversación a soporte:', error);
      addSupportTranscriptMessage(
        'assistant',
        `${error.message} Tu conversación sigue guardada en esta pestaña; vuelve a elegir “No, necesito ayuda” para reintentar.`
      );
      showResolutionPrompt(false);
    }
  }

  let savedSupportTicketId = 0;
  try { savedSupportTicketId = Number(sessionStorage.getItem('agro_support_ticket_id')); }
  catch (error) { console.error('No se pudo restaurar la consulta de soporte:', error); }
  if (Number.isInteger(savedSupportTicketId) && savedSupportTicketId > 0) {
    activeSupportTicketId = savedSupportTicketId;
    updateSupportChatModeControls();
    if (supportTranscript.length) renderAssistantConversation();
  } else if (supportTranscript.length) {
    renderAssistantConversation();
  }
  supportChatModeToggle?.addEventListener('click', () => {
    setSupportChatMode(supportChatMode === 'ticket' ? 'assistant' : 'ticket');
  });
  supportTopicOptions?.addEventListener('click', event => {
    const button = event.target.closest('[data-support-topic]');
    if (!button) return;
    supportTopic = button.dataset.supportLabel || 'Consulta desde el asistente';
    sendSupportQuestion(button.dataset.supportTopic);
  });
  document.getElementById('supportCenterOpenAssistant')?.addEventListener('click', () => {
    setSupportChatMode('assistant');
    setChatOpen(true);
    cambiarPestana('tab-support');
  });
  supportChatMessages?.addEventListener('click', event => {
    const button = event.target.closest('[data-support-decision]');
    if (!button) return;
    const decision = button.dataset.supportDecision;
    removeSupportFeedback();
    if (decision === 'resolved') {
      addSupportTranscriptMessage('user', 'Sí, gracias. Se resolvió mi duda.');
      addSupportTranscriptMessage('assistant', 'Me alegra haberte ayudado. Si tienes otra consulta, elige un tema o escríbela aquí.');
      supportTopic = 'Consulta desde el asistente';
      showSupportTopics(true);
    } else if (decision === 'continue') {
      addSupportTranscriptMessage('user', 'Quiero seguir preguntando.');
      addSupportTranscriptMessage('assistant', 'Claro. Cuéntame un poco más o selecciona uno de los temas sugeridos.');
      showSupportTopics(true);
    } else if (decision === 'unresolved' || decision === 'escalate') {
      escalateSupportConversation();
    }
  });
  supportChatForm?.addEventListener('submit', async event => {
    event.preventDefault();
    const input = document.getElementById('supportChatInput');
    const message = input.value.trim();
    if (!message) return;
    input.value = '';
    try {
      if (activeSupportTicketId && supportChatMode === 'ticket') {
        const { message: sent } = await apiRequest(`/api/support/tickets/${activeSupportTicketId}/messages`, {
          method: 'POST',
          body: JSON.stringify({ mensaje: message })
        });
        agregarMensajeChat(sent.contenido, 'user', null, sent.id);
        return;
      }
      await sendSupportQuestion(message);
    } catch (error) {
      console.error('No se pudo enviar el mensaje de soporte:', error);
      agregarMensajeChat(error.message, 'assistant');
    }
  });

  document.getElementById('newsletterForm')?.addEventListener('submit', event => {
    event.preventDefault();
    showToast('La suscripción por correo aún no está habilitada en esta versión.');
  });

  function generarCardHTML(producto) {
    const image = producto.img || 'Imagenes/WhatsApp Image 2026-11-06 at 3.19.59 PM (1).jpeg';
    return `
      <article class="product-card">
        <div class="product-image-wrap">
          <img src="${escapeHTML(image)}" alt="${escapeHTML(producto.nombre)}" />
          <span class="product-badge">${escapeHTML(producto.categoria)}</span>
        </div>
        <div class="product-content">
          <div class="product-row">
            <span class="product-region">${escapeHTML(producto.region)}</span>
            <div class="product-price">S/ ${Number(producto.precio).toFixed(2)} <small>${escapeHTML(producto.unidad)}</small></div>
          </div>
          <h3 class="product-name">${escapeHTML(producto.nombre)}</h3>
          <p class="product-desc">${escapeHTML(producto.desc)}</p>
          ${producto.productor ? `<p class="product-seller">Publicado por ${escapeHTML(producto.productor)} · ${Number(producto.cantidad)} disponibles</p>` : '<p class="product-seller">Ficha de presentación</p>'}
          <div class="product-footer">
            <button type="button" class="btn-add" data-id="${escapeHTML(producto.id)}" data-server-id="${producto.serverProductId || ''}" data-producto="${escapeHTML(producto.nombre)}" data-precio="${Number(producto.precio)}" data-img="${escapeHTML(image)}" ${producto.serverProductId ? '' : 'disabled'}>${producto.serverProductId ? 'Agregar' : 'Muestra'}</button>
            <button type="button" class="btn-quote" data-server-id="${producto.serverProductId || ''}" data-producto="${escapeHTML(producto.nombre)}" ${producto.serverProductId ? '' : 'disabled'}>${producto.serverProductId ? 'Comprar' : 'Demostración'}</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderizarDestacados() {
    if (!destacadosContainer) return;
    const destacados = baseProductos.filter(producto => producto.destacado).slice(0, 4);
    destacadosContainer.innerHTML = destacados.map(generarCardHTML).join('');
    asignarEventosProductos();
  }

  function aplicarFiltrosYLógica() {
    const categoriasSeleccionadas = Array.from(document.querySelectorAll('.cat-filter:checked')).map(cb => cb.value.trim().toLowerCase());
    const regionesSeleccionadas = Array.from(document.querySelectorAll('.region-filter:checked')).map(cb => cb.value.trim());
    const tiposSeleccionados = Array.from(document.querySelectorAll('.tipo-filter:checked')).map(cb => cb.value.trim());

    const minPrice = parseFloat(document.getElementById('minPrice')?.value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice')?.value) || 999999;

    productosFiltrados = baseProductos.filter(producto => {
      const coincideTexto = !filtroBusqueda || [producto.nombre, producto.categoria, producto.desc].some(valor => valor.toLowerCase().includes(filtroBusqueda));
      const coincideCategoria = categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.some(cat => producto.categoria.toLowerCase().includes(cat));
      const coincideRegion = regionesSeleccionadas.length === 0 || regionesSeleccionadas.includes(producto.region);
      const coincideTipo = tiposSeleccionados.length === 0 || tiposSeleccionados.includes(producto.tipo);
      const coincidePrecio = producto.precio >= minPrice && producto.precio <= maxPrice;

      return coincideTexto && coincideCategoria && coincideRegion && coincideTipo && coincidePrecio;
    });

    const orden = sortSelect ? sortSelect.value : 'recientes';
    if (orden === 'precio-asc') {
      productosFiltrados.sort((a, b) => a.precio - b.precio);
    } else if (orden === 'precio-desc') {
      productosFiltrados.sort((a, b) => b.precio - a.precio);
    } else {
      productosFiltrados.sort((a, b) => {
        if (a.serverProductId && b.serverProductId) return b.serverProductId - a.serverProductId;
        if (a.serverProductId) return -1;
        if (b.serverProductId) return 1;
        return a.id - b.id;
      });
    }

    if (catalogoGrid) {
      catalogoGrid.innerHTML = productosFiltrados.map(generarCardHTML).join('');
    }

    if (resultsCount) {
      resultsCount.textContent = `Mostrando ${productosFiltrados.length} productos seleccionados`;
    }

    asignarEventosProductos();
  }

  document.querySelectorAll('.cat-filter, .region-filter, .tipo-filter').forEach(checkbox => {
    checkbox.addEventListener('change', aplicarFiltrosYLógica);
  });

  const minPriceInput = document.getElementById('minPrice');
  const maxPriceInput = document.getElementById('maxPrice');
  if (minPriceInput) minPriceInput.addEventListener('input', aplicarFiltrosYLógica);
  if (maxPriceInput) maxPriceInput.addEventListener('input', aplicarFiltrosYLógica);

  document.getElementById('applyFiltersBtn')?.addEventListener('click', aplicarFiltrosYLógica);
  sortSelect?.addEventListener('change', aplicarFiltrosYLógica);

  document.getElementById('resetFiltersBtn')?.addEventListener('click', () => {
    document.querySelectorAll('.cat-filter, .region-filter, .tipo-filter').forEach(cb => cb.checked = true);
    if (minPriceInput) minPriceInput.value = '1.00';
    if (maxPriceInput) maxPriceInput.value = '900.00';
    if (searchInput) searchInput.value = '';
    filtroBusqueda = '';
    aplicarFiltrosYLógica();
    showToast('Filtros reestablecidos.');
  });

  document.querySelectorAll('.cat-circle').forEach(circle => {
    circle.addEventListener('click', () => {
      const categoria = circle.getAttribute('data-categoria').trim();
      filtroBusqueda = '';
      if (searchInput) searchInput.value = '';

      document.querySelectorAll('.cat-filter').forEach(checkbox => {
        checkbox.checked = checkbox.value.toLowerCase().includes(categoria.toLowerCase());
      });

      aplicarFiltrosYLógica();
      cambiarPestana('tab-catalogo');
      showToast(`Filtrando categoría: "${categoria}"`);
    });
  });

  if (searchInput && searchResults) {
    searchInput.addEventListener('input', (event) => {
      const query = event.target.value.trim().toLowerCase();

      if (!query) {
        searchResults.innerHTML = '';
        searchResults.classList.remove('show');
        return;
      }

      const coincidencias = baseProductos.filter(producto =>
        producto.nombre.toLowerCase().includes(query) ||
        producto.categoria.toLowerCase().includes(query) ||
        producto.desc.toLowerCase().includes(query)
      );

      if (coincidencias.length === 0) {
        searchResults.innerHTML = `<div class="no-results-msg">No se encontraron productos con "${escapeHTML(query)}"</div>`;
      } else {
        searchResults.innerHTML = coincidencias.slice(0, 8).map(producto => `
          <button type="button" class="search-item-option" data-search-name="${escapeHTML(producto.nombre)}">
            <img src="${escapeHTML(producto.img || 'Imagenes/WhatsApp Image 2026-11-06 at 3.19.59 PM (1).jpeg')}" alt="${escapeHTML(producto.nombre)}" />
            <div class="search-item-info">
              <span class="search-item-title">${escapeHTML(producto.nombre)}</span>
              <span class="search-item-meta">${escapeHTML(producto.categoria)} • ${escapeHTML(producto.region)}</span>
            </div>
            <span class="search-item-price">S/ ${Number(producto.precio).toFixed(2)}</span>
          </button>
        `).join('');
        searchResults.querySelectorAll('[data-search-name]').forEach(option => {
          option.addEventListener('click', () => window.seleccionarSugerencia(option.dataset.searchName));
        });
      }

      searchResults.classList.add('show');
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('.search-box-container')) {
        searchResults.classList.remove('show');
      }
    });
  }

  searchBtn?.addEventListener('click', () => {
    filtroBusqueda = searchInput.value.trim().toLowerCase();
    aplicarFiltrosYLógica();
    cambiarPestana('tab-catalogo');
  });

  window.seleccionarSugerencia = function(nombreProducto) {
    if (searchResults) searchResults.classList.remove('show');
    if (searchInput) searchInput.value = nombreProducto;
    filtroBusqueda = nombreProducto.trim().toLowerCase();
    aplicarFiltrosYLógica();
    cambiarPestana('tab-catalogo');
    showToast(`Resultados para: "${nombreProducto}"`);
  };

  const profileModal = document.getElementById('profileModal');
  const profileList = document.getElementById('profileList');
  const roleInput = document.getElementById('rol');
  const registrationTitle = document.getElementById('registrationTitle');
  const transportFields = document.getElementById('transportFields');
  const buyerFields = document.getElementById('buyerFields');
  const farmerRegistrationPanel = document.getElementById('farmerRegistrationPanel');
  const registrationTrust = document.getElementById('registrationTrust');
  const registrationForm = document.getElementById('registroForm');
  const farmerRegistrationFrame = document.getElementById('farmerRegistrationFrame');
  const roleLabels = {
    Comprador: 'comprador',
    Productor: 'agricultor',
    Distribuidor: 'transportista'
  };
  let selectedRole = 'Comprador';

  function abrirModal(modal) {
    if (!modal) return;
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
  }

  function cerrarModal(modal) {
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }

  function seleccionarRol(role) {
    if (!Object.prototype.hasOwnProperty.call(roleLabels, role)) return;
    selectedRole = role;
    if (roleInput) roleInput.value = role;
    if (registrationTitle) registrationTitle.textContent = role === 'Productor'
      ? 'Registro de agricultor'
      : `Registro de ${roleLabels[role]}`;
    if (transportFields) transportFields.hidden = role !== 'Distribuidor';
    if (buyerFields) buyerFields.hidden = role !== 'Comprador';
    if (registrationForm) registrationForm.hidden = role === 'Productor';
    if (farmerRegistrationPanel) farmerRegistrationPanel.hidden = role !== 'Productor';
    if (registrationTrust) registrationTrust.hidden = role === 'Productor';

    document.querySelectorAll('[data-role-select]').forEach(button => {
      const selected = button.dataset.roleSelect === role;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });

    ['direccionEntrega'].forEach(id => {
      const input = document.getElementById(id);
      if (input) input.required = role === 'Comprador';
    });

    ['vehiculo', 'capacidad', 'placaVehiculo', 'licenciaNumero', 'licenciaCategoria',
      'licenciaVencimiento', 'zonasServicio', 'soatVigente', 'revisionTecnica'].forEach(id => {
      const input = document.getElementById(id);
      if (input) input.required = role === 'Distribuidor';
    });
  }

  window.addEventListener('message', event => {
    if (!farmerRegistrationFrame || event.source !== farmerRegistrationFrame.contentWindow) return;
    if (event.origin !== window.location.origin && event.origin !== 'null') return;
    if (event.data?.type === 'agroconecta:registered' && event.data.user?.rol === 'Productor') {
      setSessionUser(event.data.user);
      cambiarPestana('tab-dashboard');
      showToast('Cuenta de agricultor creada. Tu sesión ya está iniciada.');
      return;
    }
    if (event.data?.type !== 'agroconecta:resize') return;
    const height = Number(event.data.height);
    if (Number.isFinite(height) && height >= 500 && height <= 3200) {
      farmerRegistrationFrame.style.height = `${height}px`;
    }
  });

  function actualizarContadorCarrito() {
    if (cartCount) {
      cartCount.textContent = cart.reduce((total, item) => total + item.cantidad, 0);
    }
  }

  function asignarEventosProductos() {
    document.querySelectorAll('.btn-add').forEach(button => {
      button.onclick = () => {
        if (sessionUser && sessionUser.rol !== 'Comprador') {
          showToast('El carrito de compras está disponible para cuentas de comprador.');
          return;
        }
        const productName = button.dataset.producto || 'Producto';
        const productId = button.dataset.serverId
          ? `server-${button.dataset.serverId}`
          : `demo-${button.dataset.id}`;
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
          existingItem.cantidad += 1;
        } else {
          cart.push({
            id: productId,
            nombre: productName,
            precio: parseFloat(button.dataset.precio) || 0,
                img: button.dataset.img || '',
            cantidad: 1,
            serverProductId: button.dataset.serverId ? Number(button.dataset.serverId) : null
          });
        }
        actualizarContadorCarrito();
        showToast(`"${productName}" agregado al carrito.`);
      };
    });

    document.querySelectorAll('.btn-quote').forEach(button => {
      button.onclick = () => {
        if (!button.dataset.serverId) {
          showToast('Esta ficha es de presentación. Las compras están disponibles en cosechas publicadas por agricultores.');
          return;
        }
        if (!sessionUser) {
          abrirModal(profileModal);
          renderizarPerfiles();
          showToast('Inicia sesión con una cuenta de comprador para continuar.');
          return;
        }
        if (sessionUser.rol !== 'Comprador') {
          showToast('Para comprar, ingresa con una cuenta de comprador.');
          return;
        }
        button.closest('.product-card')?.querySelector('.btn-add')?.click();
        abrirModal(cartModal);
        renderCart();
      };
    });
  }

  function renderCart() {
    if (!cartItemsContainer || !cartTotal) return;
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío por el momento.</p>';
      cartTotal.textContent = 'S/ 0.00';
      return;
    }

    let total = 0;
    cartItemsContainer.innerHTML = cart.map((item, index) => {
      const subtotal = item.precio * item.cantidad;
      total += subtotal;
      return `
        <div class="cart-item-row">
          <img src="${escapeHTML(item.img)}" alt="${escapeHTML(item.nombre)}" />
          <div class="cart-item-info">
            <strong>${escapeHTML(item.nombre)}</strong><br />
            <small>S/ ${item.precio.toFixed(2)} c/u · Subtotal: S/ ${subtotal.toFixed(2)}</small>
          </div>
          <div class="quantity-controls" aria-label="Cantidad de ${escapeHTML(item.nombre)}">
            <button type="button" data-cart-action="decrease" data-index="${index}" aria-label="Reducir cantidad de ${escapeHTML(item.nombre)}">−</button>
            <span>${item.cantidad}</span>
            <button type="button" data-cart-action="increase" data-index="${index}" aria-label="Aumentar cantidad de ${escapeHTML(item.nombre)}">+</button>
          </div>
          <button class="remove-cart-item" type="button" data-cart-action="remove" data-index="${index}" aria-label="Eliminar ${escapeHTML(item.nombre)}">×</button>
        </div>
      `;
    }).join('');
    cartTotal.textContent = `S/ ${total.toFixed(2)}`;
  }

  if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', event => {
      const button = event.target.closest('[data-cart-action]');
      if (!button) return;
      const index = Number(button.dataset.index);
      const item = cart[index];
      if (!item) return;
      if (button.dataset.cartAction === 'increase') item.cantidad += 1;
      if (button.dataset.cartAction === 'decrease' && item.cantidad > 1) item.cantidad -= 1;
      if (button.dataset.cartAction === 'remove') cart.splice(index, 1);
      actualizarContadorCarrito();
      renderCart();
    });
  }

  document.getElementById('openCartBtn')?.addEventListener('click', () => {
    abrirModal(cartModal);
    renderCart();
  });
  document.getElementById('cartAccountButton')?.addEventListener('click', () => {
    cerrarModal(cartModal);
    renderizarPerfiles();
    abrirModal(profileModal);
  });
  document.getElementById('checkoutSubmit')?.addEventListener('click', async () => {
    if (!sessionUser) {
      cerrarModal(cartModal);
      abrirModal(profileModal);
      renderizarPerfiles();
      return;
    }
    if (sessionUser.rol !== 'Comprador') {
      showToast('Inicia sesión con una cuenta de comprador para enviar pedidos.');
      return;
    }
    if (cart.length === 0 || cart.some(item => !item.serverProductId)) {
      showToast('El carrito incluye fichas de presentación. Para comprar, agrega cosechas publicadas por agricultores.');
      return;
    }
    const address = document.getElementById('checkoutAddress').value.trim();
    if (!address) {
      document.getElementById('checkoutAddress').focus();
      showToast('Indica la dirección de entrega.');
      return;
    }
    const button = document.getElementById('checkoutSubmit');
    button.disabled = true;
    try {
      const { orderIds } = await apiRequest('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: cart.map(item => ({ product_id: item.serverProductId, cantidad: item.cantidad })),
          direccion_entrega: address,
          requiere_transporte: document.getElementById('checkoutTransport').checked
        })
      });
      cart = [];
      actualizarContadorCarrito();
      renderCart();
      cerrarModal(cartModal);
      await loadDashboard();
      cambiarPestana('tab-messages');
      showToast('Solicitud enviada. Ya puedes conversar con el agricultor en Chats.');
      try {
        const { conversations } = await apiRequest('/api/conversations');
        const conversation = conversations.find(item =>
          Number(item.order_id) === Number(orderIds[0]) && item.tipo === 'producto'
        );
        if (conversation) await openConversation(conversation.id);
      } catch (error) {
        console.error('El pedido se creó, pero no se pudo abrir su chat automáticamente:', error);
      }
    } catch (error) {
      showToast(error.message);
    } finally {
      button.disabled = false;
    }
  });
  document.getElementById('closeCart')?.addEventListener('click', () => cerrarModal(cartModal));
  document.getElementById('closeProfile')?.addEventListener('click', () => cerrarModal(profileModal));
  window.closeCartModal = () => cerrarModal(cartModal);

  window.removeItem = function(index) {
    if (!Number.isInteger(index) || index < 0 || index >= cart.length) return;
    cart.splice(index, 1);
    actualizarContadorCarrito();
    renderCart();
  };

  [cartModal, profileModal].forEach(modal => {
    modal?.addEventListener('click', event => {
      if (event.target === modal) cerrarModal(modal);
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      cerrarModal(cartModal);
      cerrarModal(profileModal);
    }
  });

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
  }

  function updateAuthUI() {
    const loggedIn = Boolean(sessionUser);
    const registerItem = document.getElementById('registerNavItem');
    const dashboardItem = document.getElementById('dashboardNavItem');
    const messagesItem = document.getElementById('messagesNavItem');
    const contactTab = document.getElementById('tab-contacto');
    const roleEntry = document.querySelector('.nav-role-entry');
    const sellerButton = document.querySelector('.btn-seller');
    if (registerItem) registerItem.hidden = loggedIn;
    if (dashboardItem) dashboardItem.hidden = !loggedIn;
    if (messagesItem) messagesItem.hidden = !loggedIn;
    if (contactTab) contactTab.hidden = loggedIn;
    if (roleEntry) roleEntry.hidden = loggedIn;
    if (sellerButton) sellerButton.hidden = loggedIn;
    document.querySelectorAll('[data-tab="tab-contacto"]').forEach(button => {
      if (button.id !== 'createAccountLink') button.hidden = loggedIn;
    });
    const cartAccountButton = document.getElementById('cartAccountButton');
    if (cartAccountButton) cartAccountButton.hidden = loggedIn;
    const checkoutPanel = document.getElementById('checkoutPanel');
    if (checkoutPanel) checkoutPanel.hidden = !loggedIn || sessionUser.rol !== 'Comprador';
    const cartRoleNotice = document.getElementById('cartRoleNotice');
    if (cartRoleNotice) cartRoleNotice.hidden = !loggedIn || sessionUser.rol === 'Comprador';
    const createAccountLink = document.getElementById('createAccountLink');
    if (createAccountLink) createAccountLink.hidden = loggedIn;
    if (sessionUser) {
      const checkoutAddress = document.getElementById('checkoutAddress');
      if (!checkoutAddress.value) checkoutAddress.value = sessionUser.direccion_entrega || '';
      document.getElementById('profileTitle').textContent = 'Mi cuenta';
      document.getElementById('accountLoginForm').hidden = true;
      document.getElementById('forgotPasswordForm').hidden = true;
      document.getElementById('recoveryCodeForm').hidden = true;
      document.getElementById('resetPasswordForm').hidden = true;
      document.getElementById('forgotPasswordOpen').hidden = true;
      document.querySelector('.account-note').hidden = true;
      document.querySelector('.account-disclaimer').hidden = true;
      document.getElementById('accountLogout').hidden = false;
      document.getElementById('accountStatus').textContent = 'Sesión iniciada de forma segura.';
      profileList.innerHTML = `
        <article class="profile-record">
          <div class="profile-record-heading"><div><span class="profile-role">${escapeHTML(roleLabels[sessionUser.rol] || 'usuario')}</span><h4>${escapeHTML(sessionUser.nombre)}</h4></div></div>
          <dl>
            <div><dt>Correo</dt><dd>${escapeHTML(sessionUser.email)}</dd></div>
            <div><dt>Teléfono</dt><dd>${escapeHTML(sessionUser.telefono)}</dd></div>
            <div><dt>DNI / RUC</dt><dd>${escapeHTML(sessionUser.dni_ruc)}</dd></div>
            <div><dt>Ubicación</dt><dd>${escapeHTML(sessionUser.ubicacion)}</dd></div>
          </dl>
        </article>`;
    } else if (resetToken) {
      document.getElementById('accountLoginForm').hidden = true;
      document.getElementById('forgotPasswordForm').hidden = true;
      document.getElementById('recoveryCodeForm').hidden = true;
      document.getElementById('resetPasswordForm').hidden = false;
      document.getElementById('forgotPasswordOpen').hidden = true;
      document.querySelector('.account-note').hidden = true;
      document.querySelector('.account-disclaimer').hidden = true;
      document.getElementById('accountLogout').hidden = true;
      document.getElementById('accountStatus').textContent = 'Ingresa una contraseña nueva para tu cuenta.';
      profileList.innerHTML = '';
    } else {
      document.getElementById('profileTitle').textContent = 'Ingresar a mi cuenta';
      document.getElementById('accountLoginForm').hidden = false;
      document.getElementById('forgotPasswordOpen').hidden = false;
      document.querySelector('.account-note').hidden = false;
      document.querySelector('.account-disclaimer').hidden = false;
      document.getElementById('accountLogout').hidden = true;
      document.getElementById('accountStatus').textContent = '';
      profileList.innerHTML = '<p class="profile-empty">Ingresa para abrir el panel de tu cuenta. Si aún no tienes cuenta, puedes registrarte.</p>';
    }
  }

  function setSessionUser(user) {
    sessionUser = user || null;
    updateAuthUI();
    if (sessionUser) {
      document.getElementById('forgotPasswordOpen').hidden = true;
      loadDashboard();
    } else {
      activeConversation = null;
      activeTransportRequestId = null;
      if (messagePollTimer) window.clearInterval(messagePollTimer);
      messagePollTimer = null;
      if (messageListPollTimer) window.clearInterval(messageListPollTimer);
      messageListPollTimer = null;
      if (transportMessagePollTimer) window.clearInterval(transportMessagePollTimer);
      transportMessagePollTimer = null;
      if (transportRequestsPollTimer) window.clearInterval(transportRequestsPollTimer);
      transportRequestsPollTimer = null;
      if (dashboardDataPollTimer) window.clearInterval(dashboardDataPollTimer);
      dashboardDataPollTimer = null;
      availableChatItems = [];
      if (document.getElementById('tab-dashboard').classList.contains('active') ||
          document.getElementById('tab-messages').classList.contains('active')) {
        cambiarPestana('tab-inicio');
      }
    }
  }

  function renderOrderCards(orders, role) {
    if (!orders.length) return '<p class="dashboard-empty">Todavía no hay pedidos.</p>';
    return `<div class="dashboard-card-grid">${orders.map(order => `
      <article class="dashboard-card">
        <div class="dashboard-card-heading"><h4>${escapeHTML(order.nombre_producto)}</h4><span class="status-chip">${escapeHTML(order.estado)}</span></div>
        <p>${Number(order.cantidad)} ${escapeHTML(order.unidad)} · S/ ${Number(order.total).toFixed(2)}</p>
        <p>${role === 'Comprador' ? `Agricultor: ${escapeHTML(order.productor)}` : `Comprador: ${escapeHTML(order.comprador)}`}</p>
        <p>Entrega: ${escapeHTML(order.direccion_entrega)}</p>
        <div class="dashboard-actions">
          ${role !== 'Distribuidor' ? `<button type="button" class="btn btn-outline-dark" data-open-order-chat="${order.id}" data-conversation-type="producto">Chat con ${role === 'Comprador' ? 'el agricultor' : 'el comprador'}</button>` : ''}
          ${order.transportista_id ? `
            <button type="button" class="btn btn-outline-dark" data-open-order-chat="${order.id}" data-conversation-type="transporte" data-conversation-scope="grupal">Chat grupal de transporte</button>
            ${role === 'Comprador' ? `<button type="button" class="btn btn-outline-dark" data-open-order-chat="${order.id}" data-conversation-type="transporte" data-conversation-scope="comprador-transportista">Chat privado con transportista</button>` : ''}
            ${role === 'Productor' ? `<button type="button" class="btn btn-outline-dark" data-open-order-chat="${order.id}" data-conversation-type="transporte" data-conversation-scope="productor-transportista">Chat privado con transportista</button>` : ''}
            ${role === 'Distribuidor' ? `<button type="button" class="btn btn-outline-dark" data-open-order-chat="${order.id}" data-conversation-type="transporte" data-conversation-scope="comprador-transportista">Chat privado con comprador</button>
              <button type="button" class="btn btn-outline-dark" data-open-order-chat="${order.id}" data-conversation-type="transporte" data-conversation-scope="productor-transportista">Chat privado con agricultor</button>` : ''}
          ` : ''}
          ${role === 'Comprador' && order.requiere_transporte && !order.transportista_id ? `<button type="button" class="btn btn-outline-dark" data-action="show-offers" data-order-id="${order.id}">Ver ofertas de transporte</button>` : ''}
          ${role === 'Productor' && order.estado === 'pendiente' ? `<button type="button" class="btn btn-outline-dark" data-action="mark-ready" data-order-id="${order.id}">Marcar pedido listo</button>` : ''}
          ${role === 'Comprador' && order.estado !== 'completado' && order.estado !== 'pendiente' ? `<button type="button" class="btn btn-primary" data-action="confirm-delivery" data-order-id="${order.id}">Confirmar recepción</button>` : ''}
        </div>
        <div class="transport-offers" id="order-offers-${order.id}" hidden></div>
      </article>
    `).join('')}</div>`;
  }

  async function loadConversations() {
    const list = document.getElementById('conversationList');
    if (!sessionUser || !list) return;
    const [{ conversations }, { requests }] = await Promise.all([
      apiRequest('/api/conversations'),
      apiRequest('/api/transport/requests')
    ]);
    const acceptedRequests = requests.filter(request =>
      request.estado === 'aceptada' && Number(request.transportista_id) > 0
    );
    const requestOrderIds = new Set(acceptedRequests
      .filter(request => request.order_id)
      .map(request => Number(request.order_id)));
    availableChatItems = [
      ...conversations
        .filter(conversation => !(conversation.tipo === 'transporte' &&
          conversation.alcance === 'grupal' && requestOrderIds.has(Number(conversation.order_id))))
        .map(conversation => ({
          source: 'order',
          id: Number(conversation.id),
          conversation,
          title: conversation.tipo === 'producto'
            ? `Compra · ${conversation.nombre_producto}`
            : conversation.alcance === 'grupal'
              ? `Grupo de transporte · ${conversation.nombre_producto}`
              : `Chat privado de transporte · ${conversation.nombre_producto}`,
          participants: conversation.participantes || 'Participantes del pedido',
          preview: conversation.ultimo_mensaje || 'Inicia la conversación',
          timestamp: conversation.mensaje_fecha || conversation.created_at
        })),
      ...acceptedRequests.map(request => ({
        source: 'transport-request',
        id: Number(request.id),
        request,
        title: `Grupo de transporte · ${request.carga}`,
        participants: [request.comprador, request.productor, request.transportista]
          .filter(Boolean).join(' · ') || 'Participantes de la ruta',
        preview: request.ultimo_mensaje || 'Coordina precio, ruta y horario',
        timestamp: request.mensaje_fecha || request.created_at
      }))
    ].sort((first, second) =>
      (Date.parse(second.timestamp) || 0) - (Date.parse(first.timestamp) || 0)
    );
    list.innerHTML = availableChatItems.length ? availableChatItems.map(item => {
      const active = item.source === 'order'
        ? !activeTransportRequestId && activeConversation === item.id
        : Number(activeTransportRequestId) === item.id;
      return `<button type="button" class="conversation-option ${active ? 'active' : ''}"
        data-chat-source="${item.source}" data-chat-id="${item.id}">
        <strong>${escapeHTML(item.title)}</strong>
        <small>${escapeHTML(item.participants)}</small>
        <span>${escapeHTML(item.preview)}</span>
      </button>`;
    }).join('') : '<p class="dashboard-empty">Tus chats aparecerán aquí cuando se cree una compra o se acepte un transporte.</p>';
  }

  async function openConversation(conversationId) {
    const conversationIdValue = Number(conversationId);
    const response = await apiRequest(`/api/conversations/${conversationIdValue}/messages`);
    activeConversation = conversationIdValue;
    activeTransportRequestId = null;
    if (transportMessagePollTimer) window.clearInterval(transportMessagePollTimer);
    transportMessagePollTimer = null;
    const thread = document.getElementById('chatThreadMessages');
    if (!thread) return;
    const chat = availableChatItems.find(item => item.source === 'order' && item.id === activeConversation);
    document.getElementById('chatThreadTitle').textContent = chat?.title || 'Chat de AgroConecta';
    document.getElementById('chatThreadSubtitle').textContent = chat?.participants || 'Participantes de la conversación';
    document.getElementById('chatThreadAvatar').textContent =
      (chat?.title || 'AC').trim().slice(0, 1).toUpperCase();
    renderChatMessages(response.messages);
    document.getElementById('chatThreadForm').hidden = false;
    await loadConversations();
    if (window.innerWidth <= 760) thread.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (!messagePollTimer) messagePollTimer = window.setInterval(refreshActiveMessages, 5000);
  }

  function renderChatMessages(messages, append = false) {
    const thread = document.getElementById('chatThreadMessages');
    if (!thread) return;
    if (!append) thread.replaceChildren();
    messages.forEach(message => {
      const item = document.createElement('article');
      item.className = `thread-message ${message.usuario_id === sessionUser.id ? 'own' : ''}`;
      item.dataset.messageId = String(message.id);
      const author = document.createElement('strong');
      author.textContent = message.autor || 'Usuario';
      const content = document.createElement('span');
      content.textContent = message.contenido;
      const time = document.createElement('small');
      time.textContent = message.created_at;
      item.append(author, content, time);
      thread.appendChild(item);
    });
    if (!append && messages.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'messenger-empty';
      empty.textContent = 'Este chat está listo. Envía el primer mensaje para coordinar.';
      thread.appendChild(empty);
    }
    thread.scrollTop = thread.scrollHeight;
  }

  async function refreshActiveMessages() {
    if (!activeConversation || !sessionUser ||
        !document.getElementById('tab-messages').classList.contains('active')) return;
    const thread = document.getElementById('chatThreadMessages');
    if (!thread) return;
    const lastId = Number(thread.querySelector('[data-message-id]:last-child')?.dataset.messageId) || 0;
    try {
      const { messages } = await apiRequest(`/api/conversations/${activeConversation}/messages?after=${lastId}`);
      if (messages.length) {
        thread.querySelector('.messenger-empty')?.remove();
        renderChatMessages(messages, true);
        await loadConversations();
      }
    } catch (error) {
      console.error('No se pudieron actualizar los mensajes:', error);
    }
  }

  function renderTransportRequestMessages(messages) {
    renderChatMessages(messages);
  }

  async function openTransportRequestChat(requestId) {
    const requestIdValue = Number(requestId);
    const response = await apiRequest(`/api/transport/requests/${requestIdValue}/messages`);
    activeConversation = null;
    if (messagePollTimer) window.clearInterval(messagePollTimer);
    messagePollTimer = null;
    activeTransportRequestId = requestIdValue;
    const chat = availableChatItems.find(item =>
      item.source === 'transport-request' && item.id === activeTransportRequestId
    );
    document.getElementById('chatThreadTitle').textContent = chat?.title || 'Grupo de transporte';
    document.getElementById('chatThreadSubtitle').textContent = chat?.participants || 'Participantes de la ruta';
    document.getElementById('chatThreadAvatar').textContent = 'T';
    document.getElementById('chatThreadForm').hidden = false;
    renderTransportRequestMessages(response.messages);
    await loadConversations();
    if (window.innerWidth <= 760) {
      document.getElementById('chatThreadMessages').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (!transportMessagePollTimer) {
      transportMessagePollTimer = window.setInterval(refreshTransportRequestMessages, 4000);
    }
  }

  async function refreshTransportRequestMessages() {
    if (!activeTransportRequestId || !sessionUser ||
        !document.getElementById('tab-messages').classList.contains('active')) return;
    const thread = document.getElementById('chatThreadMessages');
    if (!thread) return;
    const lastId = Number(thread.querySelector('[data-message-id]:last-child')?.dataset.messageId) || 0;
    try {
      const { messages } = await apiRequest(
        `/api/transport/requests/${activeTransportRequestId}/messages?after=${lastId}`
      );
      if (!messages.length) return;
      thread.querySelector('.messenger-empty')?.remove();
      renderChatMessages(messages, true);
      await loadConversations();
    } catch (error) {
      console.error('No se pudo actualizar el chat de transporte:', error);
    }
  }

  function renderTransportRequests(requests) {
    const list = document.getElementById('transportRequestList');
    if (!list) return;
    list.innerHTML = requests.length ? requests.map(request => {
      const people = [request.comprador, request.productor, request.transportista].filter(Boolean).join(' · ');
      const driver = sessionUser.rol === 'Distribuidor';
      const accepted = request.estado === 'aceptada';
      const actions = accepted
        ? `<p>Tarifa propuesta: S/ ${Number(request.precio_acordado).toFixed(2)}</p><button class="btn btn-outline-dark" type="button" data-open-transport-chat="${request.id}">Abrir chat grupal</button>`
        : driver
          ? `<form class="transport-request-accept-form" data-request-id="${request.id}"><label>Tu tarifa (S/)<input name="precio" type="number" min="0.01" step="0.01" required /></label><button class="btn btn-primary" type="submit">Aceptar y abrir chat</button></form>`
          : '<p>Esperando que un transportista acepte la solicitud.</p>';
      return `<article class="dashboard-card">
        <div class="dashboard-card-heading"><h4>${escapeHTML(request.carga)} · ${Number(request.cantidad)} ${escapeHTML(request.unidad)}</h4><span class="status-chip">${escapeHTML(request.estado)}</span></div>
        <p><strong>Ruta:</strong> ${escapeHTML(request.origen)} → ${escapeHTML(request.destino)}</p>
        ${request.fecha_recojo ? `<p><strong>Recojo:</strong> ${escapeHTML(request.fecha_recojo.replace('T', ' '))}</p>` : ''}
        ${request.detalles ? `<p>${escapeHTML(request.detalles)}</p>` : ''}
        <p>${people ? `Participantes: ${escapeHTML(people)}` : `Publicado por ${escapeHTML(request.creador)}`}</p>
        ${actions}
      </article>`;
    }).join('') : '<p class="dashboard-empty">No hay solicitudes de transporte para mostrar.</p>';
  }

  async function refreshTransportRequestList() {
    if (!sessionUser || !document.getElementById('tab-dashboard').classList.contains('active')) return;
    const { requests } = await apiRequest('/api/transport/requests');
    renderTransportRequests(requests);
  }

  async function refreshDashboardData() {
    if (!sessionUser || dashboardPollInFlight ||
        !document.getElementById('tab-dashboard').classList.contains('active')) return;
    dashboardPollInFlight = true;
    try {
      const { orders } = await apiRequest('/api/orders');
      const orderList = document.getElementById('dashboardOrders');
      if (orderList) orderList.innerHTML = renderOrderCards(orders, sessionUser.rol);
    } catch (error) {
      console.error('No se pudieron actualizar los pedidos:', error);
    } finally {
      dashboardPollInFlight = false;
    }
  }

  async function loadDashboard() {
    const dashboard = document.getElementById('userDashboard');
    if (!dashboard || !sessionUser) return;
    const roleName = roleLabels[sessionUser.rol] || 'usuario';
    let availableOrders = [];
    document.getElementById('dashboardTitle').textContent = `Panel de ${roleName}`;
    dashboard.innerHTML = `
      <article class="dashboard-account-card">
        <div><span class="profile-role">${escapeHTML(roleName)}</span><h3>Hola, ${escapeHTML(sessionUser.nombre)}</h3><p>${escapeHTML(sessionUser.email)} · ${escapeHTML(sessionUser.telefono)}</p></div>
        <button type="button" class="link-btn" id="dashboardLogout">Cerrar sesión</button>
      </article>
      ${sessionUser.rol === 'Productor' ? `
        <section class="dashboard-section"><h3>Mis cosechas</h3>
          <form id="farmerProductForm" class="dashboard-form">
            <input id="productEditId" type="hidden" />
            <div class="form-row"><div class="form-group"><label for="productName">Producto</label><input id="productName" maxlength="100" required /></div>
            <div class="form-group"><label for="productCategory">Categoría</label><select id="productCategory" required><option value="">Selecciona</option><option>Frutas</option><option>Tubérculos</option><option>Granos</option><option>Verduras</option><option>Superalimentos</option><option>Otros</option></select></div></div>
            <div class="form-row"><div class="form-group"><label for="productRegion">Región de origen</label><select id="productRegion" required><option value="">Selecciona</option><option>Sierra</option><option>Costa</option><option>Selva</option></select></div>
            <div class="form-group"><label for="productUnit">Unidad de venta</label><input id="productUnit" maxlength="30" value="kg" required /></div></div>
            <div class="form-row"><div class="form-group"><label for="productPrice">Precio por unidad (S/)</label><input id="productPrice" type="number" min="0.01" step="0.01" required /></div>
            <div class="form-group"><label for="productQuantity">Cantidad disponible</label><input id="productQuantity" type="number" min="0" step="1" required /></div></div>
            <div class="form-group"><label for="productImage">Fotografía de la cosecha</label><input id="productImage" type="file" accept="image/jpeg,image/png,image/webp" /><small>JPG, PNG o WebP; hasta 10 MB de origen. Se optimiza a un máximo de 1 MB.</small><img id="productImagePreview" class="product-image-preview" alt="Vista previa de la cosecha" hidden /></div>
            <div class="form-group"><label for="productDescription">Descripción</label><textarea id="productDescription" maxlength="800" rows="3"></textarea></div>
            <div class="dashboard-actions"><button class="btn btn-primary" type="submit">Publicar cosecha</button><button class="btn btn-outline-dark" id="cancelProductEdit" type="button" hidden>Cancelar edición</button></div>
            <p class="account-status" id="productFormStatus" role="status"></p>
          </form><div id="farmerProductList"></div>
        </section>
        <section class="dashboard-section"><h3>Pedidos recibidos</h3><div id="dashboardOrders"></div></section>` : ''}
      ${sessionUser.rol === 'Comprador' ? `
        <section class="dashboard-section"><h3>Mis pedidos</h3><div id="dashboardOrders"></div></section>` : ''}
      ${sessionUser.rol === 'Distribuidor' ? `
        <section class="dashboard-section"><h3>Solicitudes de transporte disponibles</h3><div id="transportJobs"></div></section>
        <section class="dashboard-section"><h3>Mis servicios aceptados</h3><div id="dashboardOrders"></div></section>` : ''}
      <section class="dashboard-section"><h3>Tablero de transporte</h3>
        ${sessionUser.rol !== 'Distribuidor' ? `
          <p>Publica una ruta. Si la vinculas a un pedido, al aceptarse podrás conversar con los participantes desde la pestaña Chats.</p>
          <form id="transportRequestForm" class="dashboard-form">
            <div class="form-group"><label for="transportOrder">Pedido relacionado (opcional)</label><select id="transportOrder"><option value="">Solicitud independiente</option></select></div>
            <div class="form-row"><div class="form-group"><label for="transportCargo">Carga</label><input id="transportCargo" maxlength="120" required /></div>
              <div class="form-group"><label for="transportQuantity">Cantidad</label><input id="transportQuantity" type="number" min="1" step="1" required /></div></div>
            <div class="form-row"><div class="form-group"><label for="transportUnit">Unidad</label><input id="transportUnit" maxlength="30" value="kg" required /></div>
              <div class="form-group"><label for="transportPickup">Fecha y hora de recojo (opcional)</label><input id="transportPickup" type="datetime-local" /></div></div>
            <div class="form-row"><div class="form-group"><label for="transportOrigin">Lugar de origen</label><input id="transportOrigin" maxlength="240" required /></div>
              <div class="form-group"><label for="transportDestination">Lugar de destino</label><input id="transportDestination" maxlength="240" required /></div></div>
            <div class="form-group"><label for="transportDetails">Detalles para el transportista</label><textarea id="transportDetails" maxlength="800" rows="2"></textarea></div>
            <button class="btn btn-primary" type="submit">Publicar solicitud</button>
          </form>` : '<p>Revisa las rutas abiertas y acepta una solicitud para compartir el chat con sus participantes.</p>'}
        <div id="transportRequestList" class="dashboard-card-grid"></div>
      </section>
      <section class="dashboard-section dashboard-chat-shortcut">
        <div><h3>¿Necesitas hablar con un participante?</h3><p>Tus conversaciones privadas y grupales están separadas del panel para que sea más fácil seguir cada coordinación.</p></div>
        <button class="btn btn-primary" type="button" data-open-messages>Ir a mis chats</button>
      </section>`;

    try {
      if (sessionUser.rol === 'Productor') {
        const [products, orders] = await Promise.all([
          apiRequest('/api/my/products'),
          apiRequest('/api/orders')
        ]);
        availableOrders = orders.orders;
        window.myFarmerProducts = products.products;
        document.getElementById('farmerProductList').innerHTML = products.products.length
          ? `<div class="dashboard-card-grid">${products.products.map(product => `
            <article class="dashboard-card">${product.imagen ? `<img class="dashboard-product-image" src="${escapeHTML(product.imagen)}" alt="${escapeHTML(product.nombre)}" loading="lazy" />` : ''}<div class="dashboard-card-heading"><h4>${escapeHTML(product.nombre)}</h4><span class="status-chip">${escapeHTML(product.estado)}</span></div>
            <p>${escapeHTML(product.categoria)} · ${escapeHTML(product.region)} · ${Number(product.cantidad)} ${escapeHTML(product.unidad)}</p>
            <p>S/ ${Number(product.precio).toFixed(2)} por ${escapeHTML(product.unidad)}</p>
            <div class="dashboard-actions"><button class="btn btn-outline-dark" type="button" data-action="edit-product" data-product-id="${product.id}">Editar</button>${product.estado === 'activo' ? `<button class="btn btn-outline-dark" type="button" data-action="pause-product" data-product-id="${product.id}">Pausar publicación</button>` : `<button class="btn btn-outline-dark" type="button" data-action="activate-product" data-product-id="${product.id}">Reactivar publicación</button>`}</div></article>`).join('')}</div>`
          : '<p class="dashboard-empty">Aún no publicaste cosechas. Usa el formulario para crear tu primera publicación.</p>';
        document.getElementById('dashboardOrders').innerHTML = renderOrderCards(orders.orders, sessionUser.rol);
      } else if (sessionUser.rol === 'Comprador') {
        const { orders } = await apiRequest('/api/orders');
        availableOrders = orders;
        document.getElementById('dashboardOrders').innerHTML = renderOrderCards(orders, sessionUser.rol);
      } else {
        const [jobs, orders] = await Promise.all([
          apiRequest('/api/transport/jobs'),
          apiRequest('/api/orders')
        ]);
        document.getElementById('transportJobs').innerHTML = jobs.jobs.length
          ? `<div class="dashboard-card-grid">${jobs.jobs.map(job => `
            <article class="dashboard-card"><div class="dashboard-card-heading"><h4>Pedido #${job.id}: ${escapeHTML(job.nombre_producto)}</h4><span class="status-chip">${escapeHTML(job.estado)}</span></div>
            <p>${Number(job.cantidad)} ${escapeHTML(job.unidad)} · ${escapeHTML(job.direccion_entrega)}</p>
            <p>Comprador: ${escapeHTML(job.comprador)} · Agricultor: ${escapeHTML(job.productor)}</p>
            ${job.ya_ofertado ? '<p>Ya enviaste una oferta. Puedes actualizar el precio.</p>' : ''}
            <form class="transport-offer-form" data-order-id="${job.id}"><label>Tu precio de transporte (S/)<input name="precio" type="number" min="0.01" step="0.01" required /></label><label>Mensaje para las partes<input name="mensaje" maxlength="400" placeholder="Ruta, horario o condiciones" /></label><button class="btn btn-primary" type="submit">${job.ya_ofertado ? 'Actualizar oferta' : 'Enviar oferta'}</button></form></article>`).join('')}</div>`
          : '<p class="dashboard-empty">No hay pedidos con transporte abierto en este momento.</p>';
        document.getElementById('dashboardOrders').innerHTML = renderOrderCards(orders.orders, sessionUser.rol);
      }
      const orderSelect = document.getElementById('transportOrder');
      if (orderSelect) {
        const linkedOrders = availableOrders.filter(order =>
          !order.transportista_id && !['completado', 'cancelado'].includes(order.estado));
        orderSelect.insertAdjacentHTML('beforeend', linkedOrders.map(order => `
          <option value="${order.id}" data-cargo="${escapeHTML(order.nombre_producto)}"
            data-quantity="${Number(order.cantidad)}" data-unit="${escapeHTML(order.unidad)}"
            data-destination="${escapeHTML(order.direccion_entrega)}">Pedido #${order.id} · ${escapeHTML(order.nombre_producto)}</option>
        `).join(''));
      }
      const { requests } = await apiRequest('/api/transport/requests');
      renderTransportRequests(requests);
      if (!transportRequestsPollTimer) {
        transportRequestsPollTimer = window.setInterval(() => {
          refreshTransportRequestList().catch(error =>
            console.error('No se pudo actualizar el tablero de transporte:', error)
          );
        }, 8000);
      }
      if (!dashboardDataPollTimer) {
        dashboardDataPollTimer = window.setInterval(() => {
          refreshDashboardData().catch(error =>
            console.error('No se pudieron actualizar los pedidos:', error)
          );
        }, 5000);
      }
    } catch (error) {
      console.error('No se pudo cargar el panel:', error);
      dashboard.insertAdjacentHTML('beforeend', `<p class="account-status error" role="alert">${escapeHTML(error.message)}</p>`);
    }
  }

  document.getElementById('userDashboard').addEventListener('click', async event => {
    const logout = event.target.closest('#dashboardLogout');
    if (logout) return document.getElementById('accountLogout').click();
    if (event.target.closest('[data-open-messages]')) {
      cambiarPestana('tab-messages');
      return;
    }
    const transportChatButton = event.target.closest('[data-open-transport-chat]');
    if (transportChatButton) {
      try {
        cambiarPestana('tab-messages');
        await loadConversations();
        await openTransportRequestChat(transportChatButton.dataset.openTransportChat);
      }
      catch (error) { showToast(error.message); }
      return;
    }
    const orderChatButton = event.target.closest('[data-open-order-chat]');
    if (orderChatButton) {
      try {
        cambiarPestana('tab-messages');
        await loadConversations();
        const conversation = availableChatItems.find(item =>
          item.source === 'order' &&
          Number(item.conversation.order_id) === Number(orderChatButton.dataset.openOrderChat) &&
          item.conversation.tipo === (orderChatButton.dataset.conversationType || 'producto') &&
          (item.conversation.alcance || 'grupal') ===
            (orderChatButton.dataset.conversationScope || 'grupal'));
        if (conversation) {
          await openConversation(conversation.id);
        } else {
          const transportRequestChat = availableChatItems.find(item =>
            item.source === 'transport-request' &&
            Number(item.request.order_id) === Number(orderChatButton.dataset.openOrderChat) &&
            orderChatButton.dataset.conversationType === 'transporte' &&
            orderChatButton.dataset.conversationScope === 'grupal'
          );
          if (transportRequestChat) await openTransportRequestChat(transportRequestChat.id);
          else showToast('El chat estará disponible cuando se cree la solicitud.');
        }
      } catch (error) { showToast(error.message); }
      return;
    }
    const action = event.target.closest('[data-action]');
    if (!action) return;
    const orderId = Number(action.dataset.orderId);
    try {
      if (action.dataset.action === 'edit-product') {
        const product = (window.myFarmerProducts || []).find(item => item.id === Number(action.dataset.productId));
        if (!product) return;
        document.getElementById('productEditId').value = product.id;
        document.getElementById('productName').value = product.nombre;
        document.getElementById('productCategory').value = product.categoria;
        document.getElementById('productRegion').value = product.region;
        document.getElementById('productUnit').value = product.unidad;
        document.getElementById('productPrice').value = product.precio;
        document.getElementById('productQuantity').value = product.cantidad;
        document.getElementById('productDescription').value = product.descripcion;
        const preview = document.getElementById('productImagePreview');
        preview.src = product.imagen || '';
        preview.hidden = !product.imagen;
        document.querySelector('#farmerProductForm button[type="submit"]').textContent = 'Guardar cambios';
        document.getElementById('cancelProductEdit').hidden = false;
        return;
      }
      if (action.dataset.action === 'pause-product') {
        await apiRequest(`/api/my/products/${action.dataset.productId}`, {
          method: 'PATCH', body: JSON.stringify({ estado: 'inactivo' })
        });
        showToast('La cosecha se pausó.');
        return loadDashboard();
      }
      if (action.dataset.action === 'activate-product') {
        await apiRequest(`/api/my/products/${action.dataset.productId}`, {
          method: 'PATCH', body: JSON.stringify({ estado: 'activo' })
        });
        showToast('La cosecha está disponible nuevamente.');
        return loadDashboard();
      }
      if (action.dataset.action === 'show-offers') {
        const { offers } = await apiRequest(`/api/orders/${orderId}/transport-offers`);
        const offerPanel = document.getElementById(`order-offers-${orderId}`);
        offerPanel.hidden = false;
        offerPanel.innerHTML = offers.length ? offers.map(offer => `
          <article class="transport-offer"><strong>${escapeHTML(offer.transportista)} · S/ ${Number(offer.precio).toFixed(2)}</strong>
            <p>${escapeHTML(offer.vehiculo || '')} · ${escapeHTML(offer.zonas_servicio || '')}</p><p>${escapeHTML(offer.mensaje)}</p>
            ${offer.estado === 'pendiente' ? `<button type="button" class="btn btn-primary" data-action="accept-offer" data-order-id="${orderId}" data-offer-id="${offer.id}">Elegir este transporte</button>` : `<span class="status-chip">${escapeHTML(offer.estado)}</span>`}
          </article>`).join('') : '<p class="dashboard-empty">Aún no llegan ofertas para este pedido.</p>';
        return;
      }
      if (action.dataset.action === 'accept-offer') {
        await apiRequest(`/api/orders/${orderId}/transport-offers/${action.dataset.offerId}/accept`, { method: 'POST' });
        showToast('Transportista asignado. Ya puedes conversar con las partes.');
        return loadDashboard();
      }
      if (action.dataset.action === 'mark-ready' || action.dataset.action === 'confirm-delivery') {
        const status = action.dataset.action === 'mark-ready' ? 'listo' : 'completado';
        await apiRequest(`/api/orders/${orderId}/status`, {
          method: 'PATCH', body: JSON.stringify({ estado: status })
        });
        showToast(status === 'listo' ? 'El pedido está listo para coordinar.' : 'Recepción confirmada.');
        return loadDashboard();
      }
    } catch (error) {
      showToast(error.message);
    }
  });

  document.getElementById('conversationList').addEventListener('click', async event => {
    const button = event.target.closest('[data-chat-source]');
    if (!button) return;
    try {
      if (button.dataset.chatSource === 'transport-request') {
        await openTransportRequestChat(button.dataset.chatId);
      } else {
        await openConversation(button.dataset.chatId);
      }
    } catch (error) {
      showToast(error.message);
    }
  });

  document.getElementById('userDashboard').addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.target;
    try {
      if (form.id === 'farmerProductForm') {
        const id = document.getElementById('productEditId').value;
        const product = {
          nombre: document.getElementById('productName').value.trim(),
          categoria: document.getElementById('productCategory').value,
          region: document.getElementById('productRegion').value.trim(),
          unidad: document.getElementById('productUnit').value.trim(),
          precio: Number(document.getElementById('productPrice').value),
          cantidad: Number(document.getElementById('productQuantity').value),
          descripcion: document.getElementById('productDescription').value.trim()
        };
        const imageFile = document.getElementById('productImage').files[0];
        if (imageFile) product.imagen = await optimizeProductImage(imageFile);
        const submit = form.querySelector('button[type="submit"]');
        submit.disabled = true;
        try {
          await apiRequest(id ? `/api/my/products/${id}` : '/api/my/products', {
            method: id ? 'PATCH' : 'POST', body: JSON.stringify(product)
          });
        } finally {
          submit.disabled = false;
        }
        showToast(id ? 'Cosecha actualizada.' : 'Cosecha publicada en el catálogo.');
        return loadDashboard();
      }
      if (form.id === 'transportRequestForm') {
        const orderSelect = document.getElementById('transportOrder');
        const body = {
          pedido_id: orderSelect.value || null,
          carga: document.getElementById('transportCargo').value.trim(),
          cantidad: Number(document.getElementById('transportQuantity').value),
          unidad: document.getElementById('transportUnit').value.trim(),
          origen: document.getElementById('transportOrigin').value.trim(),
          destino: document.getElementById('transportDestination').value.trim(),
          fecha_recojo: document.getElementById('transportPickup').value,
          detalles: document.getElementById('transportDetails').value.trim()
        };
        await apiRequest('/api/transport/requests', {
          method: 'POST', body: JSON.stringify(body)
        });
        showToast('Solicitud publicada para transportistas.');
        return loadDashboard();
      }
      if (form.matches('.transport-request-accept-form')) {
        const requestId = form.dataset.requestId;
        await apiRequest(`/api/transport/requests/${requestId}/accept`, {
          method: 'POST',
          body: JSON.stringify({ precio: Number(form.elements.precio.value) })
        });
        await loadDashboard();
        cambiarPestana('tab-messages');
        await loadConversations();
        await openTransportRequestChat(requestId);
        showToast('Solicitud aceptada. Ya puedes coordinar en el chat grupal.');
        return;
      }
      if (form.matches('.transport-offer-form')) {
        const body = JSON.stringify({
          precio: Number(form.elements.precio.value),
          mensaje: form.elements.mensaje.value.trim()
        });
        await apiRequest(`/api/orders/${form.dataset.orderId}/transport-offers`, { method: 'POST', body });
        showToast('Oferta enviada al comprador.');
        return loadDashboard();
      }
    } catch (error) {
      showToast(error.message);
    }
  });

  document.getElementById('chatThreadForm').addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.currentTarget;
    const content = document.getElementById('chatThreadInput').value.trim();
    try {
      if (activeTransportRequestId) {
        await apiRequest(`/api/transport/requests/${activeTransportRequestId}/messages`, {
          method: 'POST', body: JSON.stringify({ contenido: content })
        });
      } else if (activeConversation) {
        await apiRequest(`/api/conversations/${activeConversation}/messages`, {
          method: 'POST', body: JSON.stringify({ contenido: content })
        });
      } else {
        showToast('Selecciona una conversación antes de enviar el mensaje.');
        return;
      }
      form.reset();
      await (activeTransportRequestId
        ? refreshTransportRequestMessages()
        : refreshActiveMessages());
    } catch (error) {
      showToast(error.message);
    }
  });

  document.getElementById('userDashboard').addEventListener('click', event => {
    if (event.target.id === 'cancelProductEdit') {
      document.getElementById('farmerProductForm').reset();
      document.getElementById('productEditId').value = '';
      document.getElementById('productImagePreview').hidden = true;
      document.querySelector('#farmerProductForm button[type="submit"]').textContent = 'Publicar cosecha';
      event.target.hidden = true;
    }
  });
  document.getElementById('userDashboard').addEventListener('change', event => {
    if (event.target.id === 'transportOrder') {
      const option = event.target.selectedOptions[0];
      const linked = Boolean(option.value);
      const values = {
        transportCargo: option.dataset.cargo || '',
        transportQuantity: option.dataset.quantity || '',
        transportUnit: option.dataset.unit || 'kg',
        transportDestination: option.dataset.destination || ''
      };
      for (const [id, value] of Object.entries(values)) {
        const input = document.getElementById(id);
        input.value = value;
        input.disabled = linked;
      }
      return;
    }
    if (event.target.id !== 'productImage') return;
    const file = event.target.files[0];
    if (!file) return;
    const preview = document.getElementById('productImagePreview');
    preview.src = URL.createObjectURL(file);
    preview.hidden = false;
  });

  function renderizarPerfiles() {
    updateAuthUI();
  }

  document.getElementById('openProfileBtn')?.addEventListener('click', () => {
    renderizarPerfiles();
    abrirModal(profileModal);
  });
  document.getElementById('accountLoginForm')?.addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = document.getElementById('accountStatus');
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    status.textContent = 'Verificando datos de acceso...';
    try {
      const result = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: document.getElementById('loginEmail').value.trim(),
          password: document.getElementById('loginPassword').value
        })
      });
      form.reset();
      setSessionUser(result.user);
      cerrarModal(profileModal);
      cambiarPestana('tab-dashboard');
      showToast(`Bienvenido, ${result.user.nombre}.`);
    } catch (error) {
      status.textContent = error.message;
    } finally {
      submitButton.disabled = false;
    }
  });
  document.getElementById('accountLogout')?.addEventListener('click', async () => {
    try {
      await apiRequest('/api/auth/session', { method: 'DELETE' });
      activeSupportTicketId = null;
      supportChatMode = 'assistant';
      updateSupportChatModeControls();
      if (supportMessagePollTimer) window.clearInterval(supportMessagePollTimer);
      supportMessagePollTimer = null;
      try { sessionStorage.removeItem('agro_support_ticket_id'); }
      catch (error) { console.error('No se pudo limpiar la referencia local a soporte:', error); }
      setSessionUser(null);
      cerrarModal(profileModal);
      showToast('Has cerrado sesión.');
    } catch (error) {
      document.getElementById('accountStatus').textContent = error.message;
    }
  });
  document.getElementById('forgotPasswordOpen')?.addEventListener('click', () => {
    document.getElementById('accountLoginForm').hidden = true;
    document.getElementById('forgotPasswordOpen').hidden = true;
    document.getElementById('forgotPasswordForm').hidden = false;
    document.getElementById('recoveryCodeForm').hidden = true;
    document.getElementById('accountStatus').textContent = '';
  });
  document.getElementById('forgotPasswordCancel')?.addEventListener('click', () => {
    document.getElementById('forgotPasswordForm').hidden = true;
    document.getElementById('recoveryCodeForm').hidden = true;
    document.getElementById('accountLoginForm').hidden = false;
    document.getElementById('forgotPasswordOpen').hidden = false;
  });
  document.getElementById('verifyRecoveryCodeCancel')?.addEventListener('click', () => {
    document.getElementById('recoveryCodeForm').hidden = true;
    document.getElementById('forgotPasswordForm').hidden = false;
    document.getElementById('accountStatus').textContent = '';
  });
  document.getElementById('recoveryChannel')?.addEventListener('change', event => {
    const whatsapp = event.target.value === 'whatsapp';
    const identifier = document.getElementById('forgotIdentifier');
    identifier.type = whatsapp ? 'tel' : 'email';
    identifier.autocomplete = whatsapp ? 'tel' : 'email';
    identifier.placeholder = whatsapp ? '+51 999 123 456' : 'correo@ejemplo.com';
    document.getElementById('recoveryIdentifierLabel').textContent =
      whatsapp ? 'Celular de WhatsApp registrado' : 'Correo de tu cuenta';
  });
  document.getElementById('forgotPasswordForm')?.addEventListener('submit', async event => {
    event.preventDefault();
    const status = document.getElementById('accountStatus');
    try {
      const result = await apiRequest('/api/auth/recovery-code', {
        method: 'POST',
        body: JSON.stringify({
          canal: document.getElementById('recoveryChannel').value,
          identificador: document.getElementById('forgotIdentifier').value.trim()
        })
      });
      status.textContent = result.message;
      document.getElementById('forgotPasswordForm').hidden = true;
      document.getElementById('recoveryCodeForm').hidden = false;
      document.getElementById('recoveryCode').focus();
    } catch (error) {
      status.textContent = error.message;
    }
  });
  document.getElementById('recoveryCodeForm')?.addEventListener('submit', async event => {
    event.preventDefault();
    const status = document.getElementById('accountStatus');
    try {
      const result = await apiRequest('/api/auth/verify-recovery-code', {
        method: 'POST',
        body: JSON.stringify({
          canal: document.getElementById('recoveryChannel').value,
          identificador: document.getElementById('forgotIdentifier').value.trim(),
          codigo: document.getElementById('recoveryCode').value.trim()
        })
      });
      resetToken = result.token;
      document.getElementById('recoveryCodeForm').hidden = true;
      document.getElementById('forgotPasswordForm').hidden = true;
      document.getElementById('resetPasswordForm').hidden = false;
      status.textContent = result.message;
      document.getElementById('newPassword').focus();
    } catch (error) {
      status.textContent = error.message;
    }
  });
  if (resetToken) {
    document.getElementById('accountLoginForm').hidden = true;
    document.getElementById('forgotPasswordOpen').hidden = true;
    document.getElementById('recoveryCodeForm').hidden = true;
    document.getElementById('resetPasswordForm').hidden = false;
    document.getElementById('accountStatus').textContent = 'Ingresa una contraseña nueva para tu cuenta.';
    abrirModal(profileModal);
  }
  document.getElementById('resetPasswordForm')?.addEventListener('submit', async event => {
    event.preventDefault();
    const password = document.getElementById('newPassword').value;
    if (password !== document.getElementById('newPasswordConfirm').value) {
      document.getElementById('accountStatus').textContent = 'Las contraseñas no coinciden.';
      return;
    }
    try {
      const result = await apiRequest('/api/auth/reset-password', {
        method: 'POST', body: JSON.stringify({ token: resetToken, password })
      });
      document.getElementById('accountStatus').textContent = result.message;
      document.getElementById('resetPasswordForm').hidden = true;
      document.getElementById('recoveryCodeForm').hidden = true;
      document.getElementById('accountLoginForm').hidden = false;
      window.history.replaceState({}, '', window.location.pathname);
    } catch (error) {
      document.getElementById('accountStatus').textContent = error.message;
    }
  });
  document.querySelectorAll('[data-password-toggle]').forEach(button => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.passwordToggle);
      if (!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      button.textContent = show ? 'Ocultar' : 'Mostrar';
      button.setAttribute('aria-label', `${show ? 'Ocultar' : 'Mostrar'} contraseña`);
    });
  });
  document.querySelectorAll('[data-role-select]').forEach(button => {
    button.addEventListener('click', () => seleccionarRol(button.dataset.roleSelect));
  });

  const registroForm = document.getElementById('registroForm');
  if (registroForm) {
    registroForm.addEventListener('reset', () => {
      window.setTimeout(() => seleccionarRol(selectedRole), 0);
    });

    registroForm.addEventListener('submit', async event => {
      event.preventDefault();
      const password = document.getElementById('passwordRegistro').value;
      const confirmPassword = document.getElementById('confirmarPasswordRegistro').value;
      if (password !== confirmPassword) {
        const confirmInput = document.getElementById('confirmarPasswordRegistro');
        const passwordInput = document.getElementById('passwordRegistro');
        const clearMismatch = () => confirmInput.setCustomValidity('');
        confirmInput.setCustomValidity('Las contraseñas no coinciden.');
        confirmInput.reportValidity();
        confirmInput.addEventListener('input', clearMismatch, { once: true });
        passwordInput.addEventListener('input', clearMismatch, { once: true });
        return;
      }

      if (selectedRole === 'Distribuidor') {
        const today = new Date();
        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const licenseExpiry = new Date(`${document.getElementById('licenciaVencimiento').value}T00:00:00`);
        if (licenseExpiry < todayDate) {
          const input = document.getElementById('licenciaVencimiento');
          input.setCustomValidity('La fecha de vencimiento debe ser hoy o posterior.');
          input.reportValidity();
          input.addEventListener('change', () => input.setCustomValidity(''), { once: true });
          return;
        }
      }

      const btnSubmit = document.getElementById('btnSubmit');
      const btnText = btnSubmit?.querySelector('.btn-text');
      const spinner = btnSubmit?.querySelector('.spinner');
      if (btnSubmit) btnSubmit.disabled = true;
      if (btnText) btnText.textContent = 'Creando cuenta...';
      if (spinner) spinner.hidden = false;

      const datosRegistro = {
        rol: roleInput.value,
        nombre: document.getElementById('nombre').value.trim(),
        dni_ruc: document.getElementById('dni_ruc').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        email: document.getElementById('email').value.trim(),
        password,
        ubicacion_general: document.getElementById('ubicacion').value.trim()
      };

      if (selectedRole === 'Comprador') {
        datosRegistro.direccion_entrega = document.getElementById('direccionEntrega').value.trim();
      } else if (selectedRole === 'Distribuidor') {
        datosRegistro.vehiculo = document.getElementById('vehiculo').value.trim();
        datosRegistro.capacidad = document.getElementById('capacidad').value.trim();
        datosRegistro.placa = document.getElementById('placaVehiculo').value.trim();
        datosRegistro.licencia_numero = document.getElementById('licenciaNumero').value.trim();
        datosRegistro.licencia_categoria = document.getElementById('licenciaCategoria').value.trim();
        datosRegistro.licencia_vencimiento = document.getElementById('licenciaVencimiento').value;
        datosRegistro.zonas_servicio = document.getElementById('zonasServicio').value.trim();
        datosRegistro.soat_vigente = document.getElementById('soatVigente').value === 'Sí';
        datosRegistro.revision_tecnica = document.getElementById('revisionTecnica').value === 'Sí';
      }

      try {
        const result = await apiRequest('/api/auth/register', {
          method: 'POST', body: JSON.stringify(datosRegistro)
        });
        setSessionUser(result.user);
        registroForm.reset();
        seleccionarRol('Comprador');
        cerrarModal(profileModal);
        cambiarPestana('tab-dashboard');
        showToast(`Cuenta de ${roleLabels[result.user.rol]} creada. Tu sesión ya está iniciada.`);
      } catch (error) {
        console.error('No se pudo crear la cuenta:', error);
        document.getElementById('accountStatus').textContent = error.message;
        showToast(error.message);
      } finally {
        if (btnSubmit) btnSubmit.disabled = false;
        if (btnText) btnText.textContent = 'Crear cuenta';
        if (spinner) spinner.hidden = true;
      }
    });
  }

  document.getElementById('dashboardRefresh')?.addEventListener('click', () => loadDashboard());
  document.getElementById('supportTicketForm')?.addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = document.getElementById('supportTicketStatus');
    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    status.textContent = 'Enviando consulta a soporte...';
    try {
      const message = document.getElementById('supportMessage').value.trim();
      const result = activeSupportTicketId
        ? await apiRequest(`/api/support/tickets/${activeSupportTicketId}/messages`, {
          method: 'POST', body: JSON.stringify({ mensaje: message })
        })
        : await apiRequest('/api/support/tickets', {
          method: 'POST',
          body: JSON.stringify({
            asunto: document.getElementById('supportSubject').value.trim(),
            email: document.getElementById('supportEmail').value.trim(),
            mensaje: message,
            historial: supportTranscript
          })
        });
      form.reset();
      if (result.ticketId) activateSupportTicket(result.ticketId);
      status.textContent = result.message || 'Tu mensaje se añadió a la conversación de soporte.';
      setChatOpen(true);
    } catch (error) {
      status.textContent = error.message;
    } finally {
      submit.disabled = false;
    }
  });

  seleccionarRol('Comprador');

  renderizarDestacados();
  aplicarFiltrosYLógica();
  async function refreshPublishedProducts() {
    const { products } = await apiRequest('/api/products');
    const publishedProducts = products.map(product => ({
      id: `server-${product.id}`,
      serverProductId: Number(product.id),
      nombre: product.nombre,
      categoria: product.categoria,
      region: product.region,
      tipo: 'Menor',
      precio: Number(product.precio),
      unidad: `/ ${product.unidad}`,
      img: product.imagen || '',
      desc: product.descripcion || 'Cosecha publicada por un productor registrado.',
      cantidad: Number(product.cantidad),
      productor: product.productor,
      destacado: false
    }));
    baseProductos = [...publishedProducts, ...baseProductos.filter(product => !product.serverProductId)];
    aplicarFiltrosYLógica();
  }
  refreshPublishedProducts().catch(error => {
    console.error('No se pudo cargar el catálogo de cosechas publicadas:', error);
    showToast('No se pudo actualizar el catálogo publicado. Inicia el servidor y actualiza la página.');
  });
  window.setInterval(() => {
    if (document.visibilityState === 'visible') {
      refreshPublishedProducts().catch(error => console.error('No se pudo sincronizar el catálogo:', error));
    }
  }, 10000);
  if (resetToken) {
    setSessionUser(null);
  } else {
    apiRequest('/api/auth/me').then(({ user }) => {
      setSessionUser(user);
      cambiarPestana(user ? 'tab-dashboard' : 'tab-inicio');
    }).catch(error => {
      if (!/Inicia sesión/.test(error.message)) console.error('No se pudo restaurar la sesión:', error);
      setSessionUser(null);
    });
  }
});