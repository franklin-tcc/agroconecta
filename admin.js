document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('adminLoginForm');
  const keyInput = document.getElementById('adminKey');
  const status = document.getElementById('adminStatus');
  const toolbar = document.getElementById('adminToolbar');
  const ticketList = document.getElementById('adminTickets');
  const conversation = document.getElementById('adminConversation');
  const conversationTitle = document.getElementById('adminConversationTitle');
  const conversationMessages = document.getElementById('adminConversationMessages');
  const replyForm = document.getElementById('adminReplyForm');
  let adminKey = '';
  let activeTicketId = null;
  let pollTimer = null;
  let knownLastMessageIds = new Map();

  function setStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle('error', isError);
  }

  async function adminRequest(url, options = {}) {
    const headers = new Headers(options.headers || {});
    headers.set('Authorization', `Bearer ${adminKey}`);
    if (options.body) headers.set('Content-Type', 'application/json');

    const response = await fetch(url, { ...options, headers });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(result.error || 'No se pudo completar la solicitud.');
    }
    return result;
  }

  function renderTickets(tickets) {
    ticketList.replaceChildren();
    if (tickets.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'admin-empty';
      empty.textContent = 'No hay consultas registradas.';
      ticketList.appendChild(empty);
      return;
    }

    tickets.forEach(ticket => {
      const card = document.createElement('article');
      card.className = 'admin-ticket';

      const title = document.createElement('h2');
      title.textContent = `Consulta #${ticket.id}: ${ticket.asunto}`;

      const metadata = document.createElement('p');
      metadata.className = 'admin-ticket-meta';
      metadata.textContent = `${ticket.email || 'Sin correo de respuesta'} · ${ticket.created_at}`;

      const message = document.createElement('p');
      message.className = 'admin-ticket-message';
      message.textContent = ticket.ultimo_mensaje || ticket.mensaje;

      const controls = document.createElement('div');
      controls.className = 'admin-ticket-controls';

      const open = document.createElement('button');
      open.className = 'btn btn-primary';
      open.type = 'button';
      open.textContent = 'Abrir chat';
      open.addEventListener('click', () => openTicket(ticket));

      const state = document.createElement('select');
      state.setAttribute('aria-label', `Estado de la consulta ${ticket.id}`);
      [
        ['abierto', 'Abierto'],
        ['en_revision', 'En revisión'],
        ['resuelto', 'Resuelto']
      ].forEach(([value, label]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        option.selected = ticket.estado === value;
        state.appendChild(option);
      });

      const save = document.createElement('button');
      save.className = 'btn btn-outline-dark';
      save.type = 'button';
      save.textContent = 'Guardar estado';
      save.addEventListener('click', async () => {
        save.disabled = true;
        try {
          await adminRequest(`/api/admin/tickets/${ticket.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ estado: state.value })
          });
          ticket.estado = state.value;
          setStatus(`Consulta #${ticket.id} actualizada.`);
        } catch (error) {
          setStatus(error.message, true);
        } finally {
          save.disabled = false;
        }
      });

      controls.append(open, state, save);
      card.append(title, metadata, message, controls);
      ticketList.appendChild(card);
    });
  }

  function renderMessages(messages, append) {
    if (!append) conversationMessages.replaceChildren();
    messages.forEach(message => {
      const item = document.createElement('article');
      item.className = `admin-message ${message.remitente === 'admin' ? 'admin' : 'user'}`;
      item.dataset.messageId = String(message.id);
      const author = document.createElement('strong');
      author.textContent = message.autor;
      const body = document.createElement('p');
      body.textContent = message.contenido;
      const time = document.createElement('small');
      time.textContent = message.created_at;
      item.append(author, body, time);
      conversationMessages.appendChild(item);
    });
    conversationMessages.scrollTop = conversationMessages.scrollHeight;
  }

  async function refreshActiveTicket() {
    if (!activeTicketId) return;
    const lastId = Number(conversationMessages.querySelector('[data-message-id]:last-child')?.dataset.messageId) || 0;
    const result = await adminRequest(`/api/admin/tickets/${activeTicketId}/messages?after=${lastId}`);
    renderMessages(result.messages, true);
  }

  async function openTicket(ticket) {
    activeTicketId = Number(ticket.id);
    conversationTitle.textContent = `Consulta #${ticket.id}: ${ticket.asunto}`;
    conversation.hidden = false;
    const result = await adminRequest(`/api/admin/tickets/${activeTicketId}/messages`);
    renderMessages(result.messages, false);
    document.getElementById('adminReplyMessage').focus();
  }

  async function loadTickets({ silent = false, notify = false } = {}) {
    if (!silent) setStatus('Cargando consultas...');
    const result = await adminRequest('/api/admin/tickets');
    if (!Array.isArray(result.tickets)) {
      throw new Error('El servidor devolvió una respuesta de consultas inválida.');
    }
    let newUserMessages = 0;
    result.tickets.forEach(ticket => {
      const previousId = knownLastMessageIds.get(ticket.id);
      if (notify && previousId && ticket.ultimo_remitente === 'usuario' &&
          Number(ticket.ultimo_mensaje_id) > previousId) newUserMessages += 1;
    });
    knownLastMessageIds = new Map(result.tickets.map(ticket =>
      [ticket.id, Number(ticket.ultimo_mensaje_id) || 0]
    ));
    renderTickets(result.tickets);
    if (newUserMessages) {
      setStatus(`${newUserMessages} consulta(s) nueva(s) o con respuesta del usuario.`);
      document.title = `(${newUserMessages}) Soporte | AgroConecta`;
    } else if (!silent) {
      setStatus(`${result.tickets.length} consulta(s) cargada(s).`);
      document.title = 'Bandeja de soporte | AgroConecta';
    }
    await refreshActiveTicket();
  }

  loginForm.addEventListener('submit', async event => {
    event.preventDefault();
    const submit = loginForm.querySelector('button[type="submit"]');
    adminKey = keyInput.value;
    submit.disabled = true;
    setStatus('Verificando clave...');
    try {
      await loadTickets();
      keyInput.value = '';
      loginForm.hidden = true;
      toolbar.hidden = false;
      pollTimer = window.setInterval(() => {
        loadTickets({ silent: true, notify: true }).catch(error => setStatus(error.message, true));
      }, 5000);
    } catch (error) {
      adminKey = '';
      setStatus(`${error.message} Verifica ADMIN_API_KEY en .env y reinicia el servidor.`, true);
      keyInput.focus();
    } finally {
      submit.disabled = false;
    }
  });

  document.getElementById('refreshTickets').addEventListener('click', async event => {
    const button = event.currentTarget;
    button.disabled = true;
    try {
      await loadTickets();
    } catch (error) {
      setStatus(error.message, true);
    } finally {
      button.disabled = false;
    }
  });

  replyForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (!activeTicketId) return;
    const submit = replyForm.querySelector('button[type="submit"]');
    const input = document.getElementById('adminReplyMessage');
    submit.disabled = true;
    try {
      await adminRequest(`/api/admin/tickets/${activeTicketId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ mensaje: input.value.trim() })
      });
      input.value = '';
      await loadTickets({ silent: true });
      setStatus(`Respuesta enviada a la consulta #${activeTicketId}.`);
    } catch (error) {
      setStatus(error.message, true);
    } finally {
      submit.disabled = false;
    }
  });

  document.getElementById('adminLogout').addEventListener('click', () => {
    adminKey = '';
    activeTicketId = null;
    knownLastMessageIds.clear();
    if (pollTimer) window.clearInterval(pollTimer);
    pollTimer = null;
    ticketList.replaceChildren();
    conversationMessages.replaceChildren();
    conversation.hidden = true;
    toolbar.hidden = true;
    loginForm.hidden = false;
    setStatus('Bandeja cerrada.');
    keyInput.focus();
  });
});
