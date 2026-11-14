const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const sqlite3 = require('sqlite3').verbose();
const { test } = require('node:test');

const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'agroconecta-test-'));
process.env.AGROCONECTA_DB = path.join(temporaryDirectory, 'test.sqlite');
process.env.ADMIN_API_KEY = 'test-admin-key';
process.env.SMTP_HOST = '';
process.env.SMTP_USER = '';
process.env.SMTP_PASS = '';

function createExistingSchema() {
  const setup = new sqlite3.Database(process.env.AGROCONECTA_DB);
  const schema = `
    CREATE TABLE Usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rol TEXT NOT NULL CHECK(rol IN ('Comprador', 'Productor', 'Distribuidor')),
      nombre TEXT NOT NULL, dni_ruc TEXT NOT NULL, telefono TEXT NOT NULL,
      email TEXT UNIQUE, password_hash TEXT NOT NULL, password_salt TEXT NOT NULL,
      ubicacion_general TEXT, fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE Compradores (
      usuario_id INTEGER PRIMARY KEY, direccion_entrega TEXT NOT NULL,
      FOREIGN KEY(usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
    );
    CREATE TABLE Productores (
      usuario_id INTEGER PRIMARY KEY, departamento TEXT NOT NULL, provincia TEXT NOT NULL,
      distrito TEXT NOT NULL, comunidad TEXT, metodos_cobro TEXT, asociacion TEXT, carnet_url TEXT,
      FOREIGN KEY(usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
    );
    CREATE TABLE Cultivos_Productor (
      id INTEGER PRIMARY KEY AUTOINCREMENT, productor_id INTEGER,
      categoria TEXT, nombre_cultivo TEXT NOT NULL,
      FOREIGN KEY(productor_id) REFERENCES Productores(usuario_id) ON DELETE CASCADE
    );
    CREATE TABLE Transportistas (
      usuario_id INTEGER PRIMARY KEY, vehiculo TEXT NOT NULL, capacidad TEXT, placa TEXT,
      licencia_numero TEXT, licencia_categoria TEXT, licencia_vencimiento DATE,
      zonas_servicio TEXT, soat_vigente BOOLEAN, revision_tecnica BOOLEAN,
      licencia_frontal_url TEXT, licencia_posterior_url,
      FOREIGN KEY(usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
    );`;
  return new Promise((resolve, reject) => {
    setup.exec(schema, error => {
      if (error) {
        setup.close();
        return reject(error);
      }
      setup.run(`INSERT INTO Usuarios
        (rol, nombre, dni_ruc, telefono, email, password_hash, password_salt, ubicacion_general)
        VALUES ('Comprador', 'Cuenta antigua', '99999999', '999999999',
        'legado@example.com', 'ClaveAntigua-9', 'salt_temporal', 'Cusco')`, function insertLegacy(insertError) {
        if (insertError) {
          setup.close();
          return reject(insertError);
        }
        setup.run('INSERT INTO Compradores(usuario_id, direccion_entrega) VALUES (?, ?)',
          [this.lastID, 'Cusco'], childError => {
            setup.close();
            childError ? reject(childError) : resolve();
          });
      });
    });
  });
}

test('accounts, purchases, transport offers, chats and support use the existing SQLite schema', async () => {
  await createExistingSchema();
  const { app, ready, db } = require('../server');
  await ready;
  const httpServer = app.listen(0);
  await new Promise(resolve => httpServer.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${httpServer.address().port}`;

  async function request(url, options = {}) {
    const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}) };
    Object.assign(headers, options.headers || {});
    if (options.cookie) headers.Cookie = options.cookie;
    const response = await fetch(`${baseUrl}${url}`, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    const body = await response.json();
    const setCookie = response.headers.get('set-cookie');
    return {
      status: response.status,
      body,
      cookie: setCookie ? setCookie.split(';')[0] : options.cookie
    };
  }

  function account(role, email, id) {
    const shared = {
      rol: role,
      nombre: `Usuario ${id}`,
      dni_ruc: String(10000000 + id),
      telefono: '999123456',
      email,
      password: `PruebaSegura-${id}`,
      ubicacion_general: 'Cusco'
    };
    if (role === 'Comprador') return { ...shared, direccion_entrega: 'Cusco, Perú' };
    if (role === 'Productor') return {
      ...shared, departamento: 'Cusco', provincia: 'Cusco', distrito: 'Cusco',
      comunidad: 'Valle Sagrado', cultivos: [{ categoria: 'Frutas', nombre: 'Palta' }],
      ubicacion: { latitude: -13.5324, longitude: -71.9675, precision_m: 18 }
    };
    return {
      ...shared, vehiculo: 'Camioneta', capacidad: '2 toneladas',
      licencia_numero: 'LIC-123', licencia_categoria: 'A-IIb',
      zonas_servicio: 'Cusco y Urubamba', soat_vigente: true, revision_tecnica: true
    };
  }

  let buyerCookie;
  let farmerCookie;
  let driverCookie;
  try {
    const buyer = await request('/api/auth/register', {
      method: 'POST', body: account('Comprador', 'comprador@example.com', 1)
    });
    assert.equal(buyer.status, 201);
    buyerCookie = buyer.cookie;
    assert.equal(buyer.body.user.rol, 'Comprador');

    const storedBuyer = await new Promise((resolve, reject) => {
      db.get('SELECT password_hash, password_salt FROM Usuarios WHERE email=?',
        ['comprador@example.com'], (error, row) => error ? reject(error) : resolve(row));
    });
    assert.notEqual(storedBuyer.password_hash, 'PruebaSegura-1');
    assert.notEqual(storedBuyer.password_salt, 'salt_temporal');

    const reusedIdentity = await request('/api/auth/register', {
      method: 'POST',
      body: { ...account('Comprador', 'otra-cuenta@example.com', 8), dni_ruc: '10000001' }
    });
    assert.equal(reusedIdentity.status, 409);

    const duplicate = await request('/api/auth/register', {
      method: 'POST', body: account('Distribuidor', ' COMPRADOR@example.com ', 2)
    });
    assert.equal(duplicate.status, 409);

    const legacyLogin = await request('/api/auth/login', {
      method: 'POST', body: { email: 'legado@example.com', password: 'ClaveAntigua-9' }
    });
    assert.equal(legacyLogin.status, 200);
    const upgradedLegacy = await new Promise((resolve, reject) => {
      db.get('SELECT password_hash, password_salt FROM Usuarios WHERE email=?',
        ['legado@example.com'], (error, row) => error ? reject(error) : resolve(row));
    });
    assert.notEqual(upgradedLegacy.password_salt, 'salt_temporal');
    assert.notEqual(upgradedLegacy.password_hash, 'ClaveAntigua-9');

    const loggedOut = await request('/api/auth/session', {
      method: 'DELETE', cookie: buyerCookie
    });
    assert.equal(loggedOut.status, 200);
    assert.equal((await request('/api/auth/me')).body.user, null);
    const login = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'COMPRADOR@example.com', password: 'PruebaSegura-1' }
    });
    assert.equal(login.status, 200);
    buyerCookie = login.cookie;

    const farmer = await request('/api/auth/register', {
      method: 'POST', body: account('Productor', 'agricultor@example.com', 3)
    });
    assert.equal(farmer.status, 201);
    farmerCookie = farmer.cookie;
    const storedLocation = await new Promise((resolve, reject) => {
      db.get('SELECT latitude, longitude, precision_m FROM FarmerLocations WHERE usuario_id=?',
        [farmer.body.user.id], (error, row) => error ? reject(error) : resolve(row));
    });
    assert.deepEqual(storedLocation, { latitude: -13.532, longitude: -71.968, precision_m: 18 });

    const publication = await request('/api/my/products', {
      method: 'POST',
      cookie: farmerCookie,
      body: {
        nombre: 'Palta de prueba', categoria: 'Frutas', descripcion: 'Cosecha local',
        region: 'Sierra', precio: 5.5, unidad: 'kg', cantidad: 20,
        imagen: 'data:image/jpeg;base64,/9j/AA=='
      }
    });
    assert.equal(publication.status, 201);
    const catalog = await request('/api/products');
    assert.equal(catalog.body.products.length, 1);
    assert.equal(catalog.body.products[0].productor, 'Usuario 3');
    assert.equal(catalog.body.products[0].imagen, 'data:image/jpeg;base64,/9j/AA==');
    const rejectedImage = await request('/api/my/products', {
      method: 'POST',
      cookie: farmerCookie,
      body: {
        nombre: 'Imagen inválida', categoria: 'Frutas', region: 'Sierra',
        precio: 1, unidad: 'kg', cantidad: 1, imagen: 'data:image/svg+xml;base64,PHN2Zz4='
      }
    });
    assert.equal(rejectedImage.status, 400);

    const order = await request('/api/orders', {
      method: 'POST',
      cookie: buyerCookie,
      body: {
        items: [{ product_id: publication.body.id, cantidad: 3 }],
        direccion_entrega: 'Cusco, Perú',
        requiere_transporte: true
      }
    });
    assert.equal(order.status, 201);
    const buyerChats = await request('/api/conversations', { cookie: buyerCookie });
    const purchaseChat = buyerChats.body.conversations.find(chat => chat.tipo === 'producto');
    assert.ok(purchaseChat);
    const sentMessage = await request(`/api/conversations/${purchaseChat.id}/messages`, {
      method: 'POST', cookie: buyerCookie, body: { contenido: '¿Cuándo estará lista la cosecha?' }
    });
    assert.equal(sentMessage.status, 201);
    const farmerChats = await request('/api/conversations', { cookie: farmerCookie });
    assert.ok(farmerChats.body.conversations.some(chat => chat.id === purchaseChat.id));
    const farmerMessages = await request(`/api/conversations/${purchaseChat.id}/messages`, { cookie: farmerCookie });
    assert.equal(farmerMessages.body.messages[0].contenido, '¿Cuándo estará lista la cosecha?');

    const driver = await request('/api/auth/register', {
      method: 'POST', body: account('Distribuidor', 'transportista@example.com', 4)
    });
    assert.equal(driver.status, 201);
    driverCookie = driver.cookie;
    const deliveryOrder = await request('/api/orders', {
      method: 'POST',
      cookie: buyerCookie,
      body: {
        items: [{ product_id: publication.body.id, cantidad: 2 }],
        direccion_entrega: 'Cusco, Perú',
        requiere_transporte: false
      }
    });
    const deliveryRequest = await request('/api/transport/requests', {
      method: 'POST',
      cookie: buyerCookie,
      body: {
        pedido_id: deliveryOrder.body.orderIds[0],
        origen: 'Centro de acopio del Valle Sagrado',
        fecha_recojo: '2026-11-15T10:30'
      }
    });
    assert.equal(deliveryRequest.status, 201);
    const openTransportRequests = await request('/api/transport/requests', { cookie: driverCookie });
    assert.ok(openTransportRequests.body.requests.some(item => item.id === deliveryRequest.body.id));
    const acceptDelivery = await request(`/api/transport/requests/${deliveryRequest.body.id}/accept`, {
      method: 'POST',
      cookie: driverCookie,
      body: { precio: 35 }
    });
    assert.equal(acceptDelivery.status, 200);
    const duplicateAccept = await request(`/api/transport/requests/${deliveryRequest.body.id}/accept`, {
      method: 'POST',
      cookie: driverCookie,
      body: { precio: 35 }
    });
    assert.equal(duplicateAccept.status, 409);
    const deliveryChatMessage = await request(
      `/api/transport/requests/${deliveryRequest.body.id}/messages`,
      { method: 'POST', cookie: buyerCookie, body: { contenido: '¿Puedes llegar a las diez?' } }
    );
    assert.equal(deliveryChatMessage.status, 201);
    const farmerDeliveryMessages = await request(
      `/api/transport/requests/${deliveryRequest.body.id}/messages`, { cookie: farmerCookie }
    );
    assert.equal(farmerDeliveryMessages.body.messages[0].contenido, '¿Puedes llegar a las diez?');
    const driverDeliveryMessages = await request(
      `/api/transport/requests/${deliveryRequest.body.id}/messages`, { cookie: driverCookie }
    );
    assert.equal(driverDeliveryMessages.body.messages[0].usuario_id, buyer.body.user.id);

    const jobs = await request('/api/transport/jobs', { cookie: driverCookie });
    assert.equal(jobs.body.jobs.length, 1);
    const offer = await request(`/api/orders/${order.body.orderIds[0]}/transport-offers`, {
      method: 'POST', cookie: driverCookie,
      body: { precio: 24, mensaje: 'Entrega por carretera, mañana por la tarde.' }
    });
    assert.equal(offer.status, 201);

    const buyerTransportChats = await request('/api/conversations', { cookie: buyerCookie });
    const transportChat = buyerTransportChats.body.conversations.find(chat => chat.tipo === 'transporte');
    assert.ok(transportChat);
    const driverMessage = await request(`/api/conversations/${transportChat.id}/messages`, {
      method: 'POST', cookie: driverCookie, body: { contenido: 'Confirmo la ruta y el precio indicado.' }
    });
    assert.equal(driverMessage.status, 201);
    const offers = await request(`/api/orders/${order.body.orderIds[0]}/transport-offers`, { cookie: buyerCookie });
    assert.equal(offers.body.offers.length, 1);
    const accepted = await request(
      `/api/orders/${order.body.orderIds[0]}/transport-offers/${offers.body.offers[0].id}/accept`,
      { method: 'POST', cookie: buyerCookie }
    );
    assert.equal(accepted.status, 200);

    const escalated = await request('/api/support/assistant', {
      method: 'POST', cookie: buyerCookie, body: { mensaje: 'Mi situación no aparece en las opciones habituales' }
    });
    assert.equal(escalated.status, 200);
    assert.equal(escalated.body.derivado, true);
    const supportTicketId = escalated.body.ticketId;
    const buyerSupportMessages = await request(
      `/api/support/tickets/${supportTicketId}/messages`, { cookie: buyerCookie }
    );
    assert.equal(buyerSupportMessages.status, 200);
    assert.equal(buyerSupportMessages.body.messages[0].contenido,
      'Mi situación no aparece en las opciones habituales');
    const foreignSupportMessages = await request(
      `/api/support/tickets/${supportTicketId}/messages`, { cookie: farmerCookie }
    );
    assert.equal(foreignSupportMessages.status, 404);
    const supportQueue = await request('/api/admin/tickets');
    assert.equal(supportQueue.status, 401);
    const authorizedQueue = await fetch(`${baseUrl}/api/admin/tickets`, {
      headers: { Authorization: 'Bearer test-admin-key' }
    });
    assert.equal(authorizedQueue.status, 200);
    const queuedTickets = (await authorizedQueue.json()).tickets;
    assert.equal(queuedTickets.length, 1);
    const anonymousTicket = await request('/api/support/tickets', {
      method: 'POST',
      body: {
        asunto: 'Ayuda con una consulta',
        email: 'visitante@example.com',
        mensaje: 'Necesito ayuda con mi publicación.'
      }
    });
    assert.equal(anonymousTicket.status, 201);
    assert.match(anonymousTicket.cookie, /^agroconecta_support_\d+=/);
    const anonymousThread = await request(
      `/api/support/tickets/${anonymousTicket.body.ticketId}/messages`,
      { cookie: anonymousTicket.cookie }
    );
    assert.equal(anonymousThread.status, 200);
    assert.equal(anonymousThread.body.messages[0].contenido, 'Necesito ayuda con mi publicación.');
    const deniedAnonymousThread = await request(
      `/api/support/tickets/${anonymousTicket.body.ticketId}/messages`
    );
    assert.equal(deniedAnonymousThread.status, 404);
    const adminReply = await request(`/api/admin/tickets/${supportTicketId}/messages`, {
      method: 'POST',
      headers: { Authorization: 'Bearer test-admin-key' },
      body: { mensaje: 'Ya estamos revisando tu caso.' }
    });
    assert.equal(adminReply.status, 201);
    const userSeesAdminReply = await request(
      `/api/support/tickets/${supportTicketId}/messages?after=1`, { cookie: buyerCookie }
    );
    assert.equal(userSeesAdminReply.body.messages[0].remitente, 'admin');
    assert.equal(userSeesAdminReply.body.messages[0].contenido, 'Ya estamos revisando tu caso.');
    const updateTicket = await request(`/api/admin/tickets/${queuedTickets[0].id}`, {
      method: 'PATCH',
      headers: { Authorization: 'Bearer test-admin-key' },
      body: { estado: 'en_revision' }
    });
    assert.equal(updateTicket.status, 200);

    const missingEmailConfiguration = await request('/api/auth/forgot-password', {
      method: 'POST', body: { email: 'comprador@example.com' }
    });
    assert.equal(missingEmailConfiguration.status, 503);
    const missingEmailCodeConfiguration = await request('/api/auth/recovery-code', {
      method: 'POST', body: { canal: 'email', identificador: 'comprador@example.com' }
    });
    assert.equal(missingEmailCodeConfiguration.status, 503);
    const invalidRecoveryCode = await request('/api/auth/verify-recovery-code', {
      method: 'POST',
      body: { canal: 'email', identificador: 'comprador@example.com', codigo: '123456' }
    });
    assert.equal(invalidRecoveryCode.status, 400);

    const buyerId = buyer.body.user.id;
    const resetToken = crypto.randomBytes(32).toString('base64url');
    await new Promise((resolve, reject) => {
      db.run('INSERT INTO PasswordResetTokens(token_hash, usuario_id, expires_at) VALUES (?, ?, ?)',
        [crypto.createHash('sha256').update(resetToken).digest('hex'), buyerId, Date.now() + 60000],
        error => error ? reject(error) : resolve());
    });
    const reset = await request('/api/auth/reset-password', {
      method: 'POST',
      body: { token: resetToken, password: 'NuevaClaveSegura-2026' }
    });
    assert.equal(reset.status, 200);
    assert.equal((await request('/api/auth/me', { cookie: buyerCookie })).status, 401);
    const newLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'comprador@example.com', password: 'NuevaClaveSegura-2026' }
    });
    assert.equal(newLogin.status, 200);
  } finally {
    await new Promise(resolve => httpServer.close(resolve));
    await new Promise((resolve, reject) => db.close(error => error ? reject(error) : resolve()));
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  }
});
