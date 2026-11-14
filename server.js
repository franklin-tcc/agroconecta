const crypto = require('node:crypto');
const { AsyncLocalStorage } = require('node:async_hooks');
const fs = require('node:fs');
const net = require('node:net');
const path = require('node:path');
const tls = require('node:tls');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

function loadEnvironmentFile() {
  const file = path.join(__dirname, '.env');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || Object.prototype.hasOwnProperty.call(process.env, match[1])) continue;
    process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}

loadEnvironmentFile();

const app = express();
if (process.env.RENDER) app.set('trust proxy', 1);
const PORT = Number(process.env.PORT) || 3000;
const DB_PATH = process.env.AGROCONECTA_DB ||
  'C:/Users/Usuario/Desktop/Base de datos. DALTO/bd_Agroconecta.db';
const hasTursoUrl = Boolean(process.env.TURSO_DATABASE_URL);
const hasTursoToken = Boolean(process.env.TURSO_AUTH_TOKEN);
if (hasTursoUrl !== hasTursoToken) {
  throw new Error('Configura TURSO_DATABASE_URL y TURSO_AUTH_TOKEN juntos, o deja ambos vacíos para usar SQLite local.');
}
if (process.env.RENDER && !hasTursoUrl) {
  throw new Error('Render requiere TURSO_DATABASE_URL y TURSO_AUTH_TOKEN para evitar crear una base local efímera.');
}
const tursoClient = hasTursoUrl
  ? require('@tursodatabase/serverless/compat').createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
  })
  : null;
const PASSWORD_ITERATIONS = 310000;
const SESSION_DAYS = 7;
const RESET_MINUTES = 20;
const COOKIE_NAME = 'agroconecta_session';
const allowedOrigins = new Set(
  (process.env.ALLOWED_ORIGINS || `http://localhost:${PORT},http://127.0.0.1:${PORT}`)
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)
);

const db = tursoClient ? null : new sqlite3.Database(DB_PATH, error => {
  if (error) console.error('No se pudo abrir la base de datos:', error.message);
});
if (db) {
  db.configure('busyTimeout', 5000);
  db.run('PRAGMA foreign_keys = ON');
}
const transactionContext = new AsyncLocalStorage();

function remoteExecutor() {
  return transactionContext.getStore() || tursoClient;
}

function normalizeRow(row) {
  if (!row || typeof row !== 'object') return row;
  const plain = {};
  for (const key of Object.keys(row)) {
    const value = row[key];
    plain[key] = typeof value === 'bigint' ? Number(value) : value;
  }
  return plain;
}

function run(sql, params = []) {
  if (tursoClient) {
    return remoteExecutor().execute({ sql, args: params }).then(result => ({
      id: result.lastInsertRowid == null ? 0 : Number(result.lastInsertRowid),
      changes: Number(result.rowsAffected || 0)
    }));
  }
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) return reject(error);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  if (tursoClient) {
    return remoteExecutor().execute({ sql, args: params }).then(result => normalizeRow(result.rows[0]));
  }
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => error ? reject(error) : resolve(row));
  });
}

function all(sql, params = []) {
  if (tursoClient) {
    return remoteExecutor().execute({ sql, args: params }).then(result => result.rows.map(normalizeRow));
  }
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => error ? reject(error) : resolve(rows));
  });
}

let transactionQueue = Promise.resolve();
function transaction(work) {
  if (tursoClient) {
    return (async () => {
      const current = await tursoClient.transaction('write');
      try {
        const result = await transactionContext.run(current, work);
        await current.commit();
        return result;
      } catch (error) {
        await current.rollback();
        throw error;
      }
    })();
  }
  const pending = transactionQueue.then(async () => {
    await run('BEGIN IMMEDIATE');
    try {
      const result = await work();
      await run('COMMIT');
      return result;
    } catch (error) {
      await run('ROLLBACK');
      throw error;
    }
  });
  transactionQueue = pending.catch(() => {});
  return pending;
}

async function ensureColumn(tableName, columnName, definition) {
  const columns = await all(`PRAGMA table_info(${tableName})`);
  const exists = columns.some(col =>
    String(col.name ?? col[1] ?? '').toLowerCase() === columnName.toLowerCase()
  );
  if (exists) return;
  try {
    await run(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  } catch (error) {
    if (!/duplicate column name/i.test(error.message)) throw error;
  }
}

const ready = new Promise((resolve, reject) => {
  const initializeSchema = async () => {
    try {
      if (db) await run('PRAGMA journal_mode = WAL');
      await run(`CREATE TABLE IF NOT EXISTS Usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rol TEXT NOT NULL CHECK(rol IN ('Comprador', 'Productor', 'Distribuidor')),
        nombre TEXT NOT NULL,
        dni_ruc TEXT NOT NULL,
        telefono TEXT NOT NULL,
        email TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        password_salt TEXT NOT NULL,
        ubicacion_general TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`);
      await run(`CREATE TABLE IF NOT EXISTS Compradores (
        usuario_id INTEGER PRIMARY KEY,
        direccion_entrega TEXT NOT NULL,
        FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
      )`);
      await run(`CREATE TABLE IF NOT EXISTS Productores (
        usuario_id INTEGER PRIMARY KEY,
        departamento TEXT NOT NULL,
        provincia TEXT NOT NULL,
        distrito TEXT NOT NULL,
        comunidad TEXT NOT NULL DEFAULT '',
        metodos_cobro TEXT NOT NULL DEFAULT '',
        asociacion TEXT NOT NULL DEFAULT '',
        carnet_url TEXT NOT NULL DEFAULT '',
        FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
      )`);
      await run(`CREATE TABLE IF NOT EXISTS Cultivos_Productor (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        productor_id INTEGER NOT NULL,
        categoria TEXT NOT NULL DEFAULT 'General',
        nombre_cultivo TEXT NOT NULL,
        FOREIGN KEY (productor_id) REFERENCES Usuarios(id) ON DELETE CASCADE
      )`);
      await run(`CREATE TABLE IF NOT EXISTS Transportistas (
        usuario_id INTEGER PRIMARY KEY,
        vehiculo TEXT NOT NULL,
        capacidad TEXT NOT NULL DEFAULT '',
        placa TEXT NOT NULL DEFAULT '',
        licencia_numero TEXT NOT NULL DEFAULT '',
        licencia_categoria TEXT NOT NULL DEFAULT '',
        licencia_vencimiento TEXT NOT NULL DEFAULT '',
        zonas_servicio TEXT NOT NULL DEFAULT '',
        soat_vigente INTEGER NOT NULL DEFAULT 0,
        revision_tecnica INTEGER NOT NULL DEFAULT 0,
        licencia_frontal_url TEXT NOT NULL DEFAULT '',
        licencia_posterior_url TEXT NOT NULL DEFAULT '',
        FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
      )`);
      await run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_usuarios_email_normalized
        ON Usuarios(lower(trim(email))) WHERE email IS NOT NULL AND trim(email) <> ''`);
      await run(`CREATE TABLE IF NOT EXISTS AuthSessions (
        token_hash TEXT PRIMARY KEY, usuario_id INTEGER NOT NULL,
        expires_at INTEGER NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
      )`);
      await run(`CREATE INDEX IF NOT EXISTS idx_auth_sessions_expiration ON AuthSessions(expires_at)`);
      await run(`CREATE TABLE IF NOT EXISTS ProductListings (
        id INTEGER PRIMARY KEY AUTOINCREMENT, productor_id INTEGER NOT NULL,
        nombre TEXT NOT NULL, categoria TEXT NOT NULL, descripcion TEXT NOT NULL DEFAULT '',
        region TEXT NOT NULL, precio REAL NOT NULL CHECK(precio > 0),
        unidad TEXT NOT NULL DEFAULT 'kg', cantidad INTEGER NOT NULL CHECK(cantidad >= 0),
        estado TEXT NOT NULL DEFAULT 'activo' CHECK(estado IN ('activo', 'inactivo')),
        imagen TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (productor_id) REFERENCES Usuarios(id) ON DELETE CASCADE
      )`);
      await run(`CREATE TABLE IF NOT EXISTS FarmerLocations (
        usuario_id INTEGER PRIMARY KEY, latitude REAL NOT NULL, longitude REAL NOT NULL,
        precision_m REAL NOT NULL DEFAULT 0, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
      )`);
      await run(`CREATE TABLE IF NOT EXISTS Orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT, comprador_id INTEGER NOT NULL,
        productor_id INTEGER NOT NULL, product_id INTEGER NOT NULL,
        nombre_producto TEXT NOT NULL, cantidad INTEGER NOT NULL CHECK(cantidad > 0),
        unidad TEXT NOT NULL, precio_unitario REAL NOT NULL, total REAL NOT NULL,
        direccion_entrega TEXT NOT NULL, requiere_transporte INTEGER NOT NULL DEFAULT 0,
        transportista_id INTEGER, estado TEXT NOT NULL DEFAULT 'pendiente',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (comprador_id) REFERENCES Usuarios(id),
        FOREIGN KEY (productor_id) REFERENCES Usuarios(id),
        FOREIGN KEY (product_id) REFERENCES ProductListings(id),
        FOREIGN KEY (transportista_id) REFERENCES Usuarios(id)
      )`);
      await run(`CREATE INDEX IF NOT EXISTS idx_orders_participants ON Orders(comprador_id, productor_id, transportista_id)`);
      await run(`CREATE TABLE IF NOT EXISTS TransportOffers (
        id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER NOT NULL,
        transportista_id INTEGER NOT NULL, precio REAL NOT NULL CHECK(precio > 0),
        mensaje TEXT NOT NULL DEFAULT '', estado TEXT NOT NULL DEFAULT 'pendiente',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(order_id, transportista_id),
        FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE,
        FOREIGN KEY (transportista_id) REFERENCES Usuarios(id) ON DELETE CASCADE
      )`);
      await run(`CREATE TABLE IF NOT EXISTS TransportRequests (
        id INTEGER PRIMARY KEY AUTOINCREMENT, creador_id INTEGER NOT NULL,
        order_id INTEGER, comprador_id INTEGER, productor_id INTEGER,
        carga TEXT NOT NULL, cantidad INTEGER NOT NULL CHECK(cantidad > 0),
        unidad TEXT NOT NULL DEFAULT 'kg', origen TEXT NOT NULL, destino TEXT NOT NULL,
        fecha_recojo TEXT NOT NULL DEFAULT '', detalles TEXT NOT NULL DEFAULT '',
        precio_acordado REAL, estado TEXT NOT NULL DEFAULT 'abierta'
          CHECK(estado IN ('abierta', 'aceptada', 'completada', 'cancelada')),
        transportista_id INTEGER, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (creador_id) REFERENCES Usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE SET NULL,
        FOREIGN KEY (comprador_id) REFERENCES Usuarios(id) ON DELETE SET NULL,
        FOREIGN KEY (productor_id) REFERENCES Usuarios(id) ON DELETE SET NULL,
        FOREIGN KEY (transportista_id) REFERENCES Usuarios(id) ON DELETE SET NULL
      )`);
      await run(`CREATE INDEX IF NOT EXISTS idx_transport_requests_open
        ON TransportRequests(estado, created_at DESC)`);
      await run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_transport_requests_active_order
        ON TransportRequests(order_id)
        WHERE order_id IS NOT NULL AND estado IN ('abierta', 'aceptada')`);
      await run(`CREATE TABLE IF NOT EXISTS TransportRequestMessages (
        id INTEGER PRIMARY KEY AUTOINCREMENT, solicitud_id INTEGER NOT NULL,
        usuario_id INTEGER NOT NULL, contenido TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (solicitud_id) REFERENCES TransportRequests(id) ON DELETE CASCADE,
        FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
      )`);
      await run(`CREATE INDEX IF NOT EXISTS idx_transport_request_messages
        ON TransportRequestMessages(solicitud_id, id)`);
      await run(`CREATE TABLE IF NOT EXISTS Conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER NOT NULL,
        tipo TEXT NOT NULL CHECK(tipo IN ('producto', 'transporte')),
        transportista_id INTEGER, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE
      )`);
      await ensureColumn('Conversations', 'transportista_id', 'INTEGER');
      await run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_product_conversation
        ON Conversations(order_id) WHERE tipo='producto'`);
      await run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_transport_conversation
        ON Conversations(order_id, transportista_id) WHERE tipo='transporte'`);
      await run(`CREATE TABLE IF NOT EXISTS ConversationMembers (
        conversation_id INTEGER NOT NULL, usuario_id INTEGER NOT NULL,
        PRIMARY KEY(conversation_id, usuario_id),
        FOREIGN KEY (conversation_id) REFERENCES Conversations(id) ON DELETE CASCADE,
        FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
      )`);
      await run(`CREATE TABLE IF NOT EXISTS Messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT, conversation_id INTEGER NOT NULL,
        usuario_id INTEGER NOT NULL, contenido TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES Conversations(id) ON DELETE CASCADE,
        FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
      )`);
      await run(`CREATE INDEX IF NOT EXISTS idx_messages_conversation ON Messages(conversation_id, id)`);
      await run(`CREATE TABLE IF NOT EXISTS PasswordResetTokens (
        token_hash TEXT PRIMARY KEY, usuario_id INTEGER NOT NULL,
        expires_at INTEGER NOT NULL, used_at INTEGER,
        FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
      )`);
      await run(`CREATE TABLE IF NOT EXISTS PasswordResetCodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT, usuario_id INTEGER NOT NULL,
        canal TEXT NOT NULL CHECK(canal IN ('email', 'whatsapp')),
        codigo_hash TEXT NOT NULL, codigo_salt TEXT NOT NULL,
        expires_at INTEGER NOT NULL, attempts INTEGER NOT NULL DEFAULT 0,
        used_at TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
      )`);
      await run(`CREATE INDEX IF NOT EXISTS idx_password_reset_codes_user
        ON PasswordResetCodes(usuario_id, canal, created_at)`);
      await run(`CREATE TABLE IF NOT EXISTS SupportTickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT, usuario_id INTEGER,
        email TEXT, asunto TEXT NOT NULL, mensaje TEXT NOT NULL,
        estado TEXT NOT NULL DEFAULT 'abierto', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        access_token_hash TEXT,
        FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE SET NULL
      )`);
      await ensureColumn('SupportTickets', 'access_token_hash', 'TEXT');
      await run(`CREATE TABLE IF NOT EXISTS SupportMessages (
        id INTEGER PRIMARY KEY AUTOINCREMENT, ticket_id INTEGER NOT NULL,
        usuario_id INTEGER, remitente TEXT NOT NULL CHECK(remitente IN ('usuario', 'admin')),
        contenido TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ticket_id) REFERENCES SupportTickets(id) ON DELETE CASCADE,
        FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE SET NULL
      )`);
      await run(`CREATE INDEX IF NOT EXISTS idx_support_messages_ticket
        ON SupportMessages(ticket_id, id)`);
      await run(`INSERT INTO SupportMessages(ticket_id, usuario_id, remitente, contenido)
        SELECT t.id, t.usuario_id, 'usuario', t.mensaje FROM SupportTickets t
        WHERE NOT EXISTS (SELECT 1 FROM SupportMessages m WHERE m.ticket_id=t.id)`);
      resolve();
    } catch (error) {
      reject(error);
    }
  };
  if (tursoClient) {
    initializeSchema();
  } else {
    db.once('open', initializeSchema);
    db.once('error', reject);
  }
});

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizeWhatsAppPhone(value) {
  let digits = String(value || '').replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length === 9) digits = `51${digits}`;
  return /^\d{10,15}$/.test(digits) ? digits : null;
}

async function findRecoveryUser(channel, identifier) {
  if (channel === 'email') {
    const email = normalizeEmail(identifier);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Ingresa un correo válido.' };
    return { user: await get(`SELECT id, nombre, email, telefono FROM Usuarios
      WHERE lower(trim(email))=?`, [email]) };
  }
  const phone = normalizeWhatsAppPhone(identifier);
  if (!phone) return { error: 'Ingresa un teléfono válido con código de país o un celular peruano de 9 dígitos.' };
  const users = await all(`SELECT id, nombre, email, telefono FROM Usuarios
    WHERE telefono IS NOT NULL AND trim(telefono)<>''`);
  const matches = users.filter(user => normalizeWhatsAppPhone(user.telefono) === phone);
  return { user: matches.length === 1 ? matches[0] : null };
}

function cleanText(value, maxLength = 200) {
  return String(value || '').trim().slice(0, maxLength);
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(String(password), salt, PASSWORD_ITERATIONS, 32, 'sha256').toString('hex');
  return { hash, salt };
}

const rateBuckets = new Map();
function rateLimit(limit, windowMs) {
  return (req, res, next) => {
    const now = Date.now();
    const key = `${req.ip}:${req.path}`;
    const bucket = rateBuckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
      if (rateBuckets.size > 10000) {
        for (const [entry, value] of rateBuckets) {
          if (value.resetAt <= now) rateBuckets.delete(entry);
        }
      }
      return next();
    }
    bucket.count += 1;
    if (bucket.count > limit) return res.status(429).json({ error: 'Demasiadas solicitudes. Espera un momento e inténtalo otra vez.' });
    next();
  };
}

function tokenHash(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function safeUser(row) {
  return {
    id: row.id,
    rol: row.rol,
    nombre: row.nombre,
    email: row.email,
    telefono: row.telefono,
    ubicacion: row.ubicacion_general || '',
    dni_ruc: row.dni_ruc,
    direccion_entrega: row.direccion_entrega || '',
    productor: row.departamento ? {
      departamento: row.departamento,
      provincia: row.provincia,
      distrito: row.distrito,
      comunidad: row.comunidad || ''
    } : undefined,
    transportista: row.vehiculo ? {
      vehiculo: row.vehiculo,
      capacidad: row.capacidad || '',
      placa: row.placa || '',
      licencia_categoria: row.licencia_categoria || '',
      licencia_vencimiento: row.licencia_vencimiento || '',
      zonas_servicio: row.zonas_servicio || ''
    } : undefined
  };
}

function setSessionCookie(res, token) {
  const secure = process.env.COOKIE_SECURE === 'true';
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000
  });
}

function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'lax', path: '/' });
}

async function createSession(userId, res) {
  const token = crypto.randomBytes(32).toString('base64url');
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  await transaction(() => run(
    'INSERT INTO AuthSessions(token_hash, usuario_id, expires_at) VALUES (?, ?, ?)',
    [tokenHash(token), userId, expiresAt]
  ));
  setSessionCookie(res, token);
}

async function currentUser(req) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return null;
  return get(`SELECT u.id, u.rol, u.nombre, u.email, u.telefono, u.dni_ruc, u.ubicacion_general,
      c.direccion_entrega, p.departamento, p.provincia, p.distrito, p.comunidad,
      t.vehiculo, t.capacidad, t.placa, t.licencia_categoria, t.licencia_vencimiento, t.zonas_servicio
    FROM AuthSessions s JOIN Usuarios u ON u.id = s.usuario_id
    LEFT JOIN Compradores c ON c.usuario_id = u.id
    LEFT JOIN Productores p ON p.usuario_id = u.id
    LEFT JOIN Transportistas t ON t.usuario_id = u.id
    WHERE s.token_hash = ? AND s.expires_at > ?`, [tokenHash(token), Date.now()]);
}

async function requireAuth(req, res, next) {
  try {
    await ready;
    const user = await currentUser(req);
    if (!user) return res.status(401).json({ error: 'Inicia sesión para continuar.' });
    req.user = safeUser(user);
    next();
  } catch (error) {
    next(error);
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ error: 'Tu tipo de cuenta no tiene permiso para esta acción.' });
    }
    next();
  };
}

function createSmtpReader(socket) {
  let buffer = '';
  let responseLines = [];
  const responses = [];
  const waiters = [];

  function onData(chunk) {
    buffer += chunk.toString('utf8');
    let newline;
    while ((newline = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, newline).replace(/\r$/, '');
      buffer = buffer.slice(newline + 1);
      responseLines.push(line);
      if (/^\d{3} /.test(line)) {
        const response = responseLines.join('\n');
        responseLines = [];
        const waiter = waiters.shift();
        if (waiter) waiter.resolve(response);
        else responses.push(response);
      }
    }
  }

  function onError(error) {
    while (waiters.length) waiters.shift().reject(error);
  }

  socket.on('data', onData);
  socket.on('error', onError);
  return {
    read() {
      if (responses.length) return Promise.resolve(responses.shift());
      return new Promise((resolve, reject) => waiters.push({ resolve, reject }));
    },
    close() {
      socket.off('data', onData);
      socket.off('error', onError);
    }
  };
}

async function smtpResponse(reader, socket, command, acceptedCodes) {
  const responsePromise = reader.read();
  if (command) socket.write(`${command}\r\n`);
  const response = await responsePromise;
  const code = Number(response.slice(0, 3));
  if (!acceptedCodes.includes(code)) throw new Error(`SMTP rechazó una operación (${code}).`);
  return response;
}

function base64Lines(value) {
  return Buffer.from(value, 'utf8').toString('base64').match(/.{1,76}/g)?.join('\r\n') || '';
}

async function sendSmtpEmail(user, subjectText, text) {
  const host = process.env.SMTP_HOST;
  const username = process.env.SMTP_USER;
  const password = process.env.SMTP_PASS;
  if (!host || !username || !password) return false;
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === 'true';
  let socket = secure
    ? tls.connect({ host, port, servername: host })
    : net.connect({ host, port });
  socket.setTimeout(15000, () => socket.destroy(new Error('Tiempo de espera al conectar con Gmail.')));
  await new Promise((resolve, reject) => {
    const readyEvent = secure ? 'secureConnect' : 'connect';
    socket.once(readyEvent, resolve);
    socket.once('error', reject);
  });
  let reader = createSmtpReader(socket);
  try {
    await smtpResponse(reader, socket, null, [220]);
    await smtpResponse(reader, socket, `EHLO agroconecta.local`, [250]);
    if (!secure) {
      await smtpResponse(reader, socket, 'STARTTLS', [220]);
      reader.close();
      socket = tls.connect({ socket, servername: host });
      await new Promise((resolve, reject) => {
        socket.once('secureConnect', resolve);
        socket.once('error', reject);
      });
      reader = createSmtpReader(socket);
      await smtpResponse(reader, socket, 'EHLO agroconecta.local', [250]);
    }
    await smtpResponse(reader, socket, 'AUTH LOGIN', [334]);
    await smtpResponse(reader, socket, Buffer.from(username).toString('base64'), [334]);
    await smtpResponse(reader, socket, Buffer.from(password).toString('base64'), [235]);
    const from = normalizeEmail(process.env.SMTP_FROM || username);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from)) throw new Error('SMTP_FROM no contiene un correo válido.');
    await smtpResponse(reader, socket, `MAIL FROM:<${from}>`, [250]);
    await smtpResponse(reader, socket, `RCPT TO:<${user.email}>`, [250, 251]);
    await smtpResponse(reader, socket, 'DATA', [354]);
    const subject = `=?UTF-8?B?${Buffer.from(subjectText).toString('base64')}?=`;
    const body = [
      `From: AgroConecta <${from}>`,
      `To: <${user.email}>`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: base64',
      '',
      base64Lines(text)
    ].join('\r\n').replace(/^\./gm, '..');
    await smtpResponse(reader, socket, `${body}\r\n.`, [250]);
    await smtpResponse(reader, socket, 'QUIT', [221]);
  } finally {
    reader.close();
    socket.end();
  }
  return true;
}

async function sendPasswordResetEmail(user, resetUrl) {
  const text = `Hola ${user.nombre},\n\nAbre este enlace para cambiar tu contraseña de AgroConecta antes de 20 minutos:\n${resetUrl}\n\nSi no solicitaste este cambio, ignora el correo.`;
  return sendSmtpEmail(user, 'Restablece tu contraseña de AgroConecta', text);
}

async function sendRecoveryCodeEmail(user, code) {
  const text = `Hola ${user.nombre},\n\nTu código de recuperación de AgroConecta es ${code}. Vence en 10 minutos y solo puede usarse una vez.\n\nSi no solicitaste este código, ignora este mensaje.`;
  return sendSmtpEmail(user, 'Código de recuperación de AgroConecta', text);
}

async function sendWhatsAppRecoveryCode(user, code) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const apiVersion = process.env.WHATSAPP_API_VERSION;
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME;
  const language = process.env.WHATSAPP_TEMPLATE_LANGUAGE;
  const phone = normalizeWhatsAppPhone(user.telefono);
  if (!phoneNumberId || !accessToken || !apiVersion || !templateName || !language) {
    throw new Error('Configura el número, token, versión y plantilla aprobada de WhatsApp Business.');
  }
  if (!/^\d+$/.test(phoneNumberId) || !/^v\d+\.\d+$/.test(apiVersion) ||
      !/^[a-z0-9_]+$/i.test(templateName) || !/^[a-z]{2}(?:_[A-Z]{2})?$/.test(language)) {
    throw new Error('La configuración de WhatsApp Business no tiene un formato válido.');
  }
  if (!phone) throw new Error('El teléfono registrado no tiene un formato internacional válido.');
  const response = await fetch(
    `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phone,
        type: 'template',
        template: {
          name: templateName,
          language: { code: language },
          components: [{
            type: 'body',
            parameters: [{ type: 'text', text: code }]
          }]
        }
      })
    }
  );
  if (!response.ok) throw new Error(`WhatsApp rechazó el envío del código (HTTP ${response.status}).`);
  return true;
}

function validateRegistration(body) {
  const role = body.rol;
  if (!['Comprador', 'Productor', 'Distribuidor'].includes(role)) return 'Selecciona un perfil válido.';
  if (!cleanText(body.nombre, 120) || !cleanText(body.telefono, 30) || !cleanText(body.dni_ruc, 20)) {
    return 'Completa nombre, teléfono y DNI o RUC.';
  }
  if (!/^(?:\d{8}|\d{11})$/.test(cleanText(body.dni_ruc, 20))) {
    return 'El DNI debe tener 8 dígitos o el RUC debe tener 11 dígitos.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(body.email))) return 'Ingresa un correo válido.';
  if (typeof body.password !== 'string' || body.password.length < 8 || body.password.length > 200) {
    return 'La contraseña debe tener entre 8 y 200 caracteres.';
  }
  if (role === 'Comprador' && !cleanText(body.direccion_entrega, 300)) return 'Indica la dirección de entrega.';
  if (role === 'Productor' && (!cleanText(body.departamento, 80) ||
  !cleanText(body.provincia, 80) || !cleanText(body.distrito, 80))) {
    return 'Completa departamento, provincia y distrito.';
  }
  if (role === 'Productor' && body.ubicacion !== undefined) {
    const latitude = Number(body.ubicacion?.latitude);
    const longitude = Number(body.ubicacion?.longitude);
    const precision = Number(body.ubicacion?.precision_m ?? 0);
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
    !Number.isFinite(longitude) || longitude < -180 || longitude > 180 ||
    !Number.isFinite(precision) || precision < 0 || precision > 100000) {
  return 'La ubicación geográfica no es válida. Vuelve a guardarla desde el mapa.';
    }
  }
  if (role === 'Distribuidor' && (!cleanText(body.vehiculo, 80) ||
      !cleanText(body.licencia_numero, 50) || !cleanText(body.zonas_servicio, 200))) {
    return 'Completa los datos obligatorios del servicio de transporte.';
  }
  return null;
}

async function registerAccount(req, res) {
  const body = req.body || {};
  const validationError = validateRegistration(body);
  if (validationError) return res.status(400).json({ error: validationError });

  const email = normalizeEmail(body.email);
  const password = hashPassword(body.password);
  try {
    const userId = await transaction(async () => {
      const emailInUse = await get('SELECT id FROM Usuarios WHERE lower(trim(email)) = ? LIMIT 1', [email]);
      if (emailInUse) {
        throw Object.assign(new Error('Ya existe una cuenta con ese correo. Inicia sesión o recupera tu contraseña.'), { status: 409 });
      }
      const identityInUse = await get('SELECT id FROM Usuarios WHERE lower(trim(dni_ruc)) = ? LIMIT 1',
        [cleanText(body.dni_ruc, 20).toLowerCase()]);
      if (identityInUse) {
        throw Object.assign(new Error('Ya existe una cuenta con ese DNI o RUC.'), { status: 409 });
      }
      const user = await run(`INSERT INTO Usuarios
        (rol, nombre, dni_ruc, telefono, email, password_hash, password_salt, ubicacion_general)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
        body.rol, cleanText(body.nombre, 120), cleanText(body.dni_ruc, 20),
        cleanText(body.telefono, 30), email, password.hash, password.salt,
        cleanText(body.ubicacion_general, 200)
      ]);
      if (body.rol === 'Comprador') {
        await run('INSERT INTO Compradores(usuario_id, direccion_entrega) VALUES (?, ?)',
          [user.id, cleanText(body.direccion_entrega, 300)]);
      } else if (body.rol === 'Productor') {
        await run(`INSERT INTO Productores
          (usuario_id, departamento, provincia, distrito, comunidad, metodos_cobro, asociacion, carnet_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
          user.id, cleanText(body.departamento, 80), cleanText(body.provincia, 80),
          cleanText(body.distrito, 80), cleanText(body.comunidad, 120),
          cleanText(body.metodos_cobro, 200), cleanText(body.asociacion, 160), ''
        ]);
        if (body.ubicacion) {
          await run(`INSERT INTO FarmerLocations(usuario_id, latitude, longitude, precision_m)
            VALUES (?, ?, ?, ?)`, [
            user.id,
            Number(Number(body.ubicacion.latitude).toFixed(3)),
            Number(Number(body.ubicacion.longitude).toFixed(3)),
            Number(body.ubicacion.precision_m || 0)
          ]);
        }
        if (Array.isArray(body.cultivos)) {
          for (const crop of body.cultivos.slice(0, 30)) {
            const name = cleanText(typeof crop === 'object' ? crop.nombre : crop, 100);
            if (name) await run(
              'INSERT INTO Cultivos_Productor(productor_id, categoria, nombre_cultivo) VALUES (?, ?, ?)',
              [user.id, cleanText(typeof crop === 'object' ? crop.categoria : 'General', 60), name]
            );
          }
        }
      } else {
        await run(`INSERT INTO Transportistas
          (usuario_id, vehiculo, capacidad, placa, licencia_numero, licencia_categoria,
           licencia_vencimiento, zonas_servicio, soat_vigente, revision_tecnica,
           licencia_frontal_url, licencia_posterior_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
          user.id, cleanText(body.vehiculo, 80), cleanText(body.capacidad, 80),
          cleanText(body.placa, 30), cleanText(body.licencia_numero, 50),
          cleanText(body.licencia_categoria, 30), cleanText(body.licencia_vencimiento, 20),
          cleanText(body.zonas_servicio, 200), body.soat_vigente ? 1 : 0,
          body.revision_tecnica ? 1 : 0, '', ''
        ]);
      }
      return user.id;
    });
    await createSession(userId, res);
    const row = await get(`SELECT u.id, u.rol, u.nombre, u.email, u.telefono, u.dni_ruc,
      u.ubicacion_general, c.direccion_entrega, p.departamento, p.provincia, p.distrito, p.comunidad,
      t.vehiculo, t.capacidad, t.placa, t.licencia_categoria, t.licencia_vencimiento, t.zonas_servicio
      FROM Usuarios u LEFT JOIN Compradores c ON c.usuario_id=u.id
      LEFT JOIN Productores p ON p.usuario_id=u.id LEFT JOIN Transportistas t ON t.usuario_id=u.id
      WHERE u.id = ?`, [userId]);
    return res.status(201).json({ user: safeUser(row) });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ error: error.message });
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE' || /UNIQUE constraint failed/i.test(error.message)) {
      return res.status(409).json({ error: 'Ya existe una cuenta con ese correo. Inicia sesión o recupera tu contraseña.' });
    }
    throw error;
  }
}

function createConversation(orderId, type, userIds, transportistaId = null) {
  return new Promise(async (resolve, reject) => {
    try {
      const found = await get(`SELECT id FROM Conversations WHERE order_id = ? AND tipo = ?
        AND transportista_id IS ?`, [orderId, type, transportistaId]);
      const conversationId = found
        ? found.id
        : (await run('INSERT INTO Conversations(order_id, tipo, transportista_id) VALUES (?, ?, ?)',
          [orderId, type, transportistaId])).id;
      for (const userId of new Set(userIds)) {
        await run('INSERT OR IGNORE INTO ConversationMembers(conversation_id, usuario_id) VALUES (?, ?)',
          [conversationId, userId]);
      }
      resolve(conversationId);
    } catch (error) {
      reject(error);
    }
  });
}

function createTicket({ userId = null, email = '', subject = 'Consulta de soporte', message }) {
  const accessToken = crypto.randomBytes(32).toString('base64url');
  return transaction(async () => {
    const result = await run(
      `INSERT INTO SupportTickets(usuario_id, email, asunto, mensaje, access_token_hash)
        VALUES (?, ?, ?, ?, ?)`,
      [userId, normalizeEmail(email) || null, cleanText(subject, 160),
        cleanText(message, 1800), tokenHash(accessToken)]
    );
    await run(`INSERT INTO SupportMessages(ticket_id, usuario_id, remitente, contenido)
      VALUES (?, ?, 'usuario', ?)`, [result.id, userId, cleanText(message, 1800)]);
    return { id: result.id, accessToken };
  });
}

function setSupportTicketCookie(res, ticketId, accessToken) {
  res.cookie(`agroconecta_support_${ticketId}`, accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === 'true',
    path: `/api/support/tickets/${ticketId}`,
    maxAge: 24 * 60 * 60 * 1000
  });
}

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
app.use(express.json({ limit: '3mb' }));
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  req.cookies = {};
  for (const part of String(req.headers.cookie || '').split(';')) {
    const separator = part.indexOf('=');
    if (separator < 0) continue;
    const name = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    try { req.cookies[name] = decodeURIComponent(value); }
    catch { req.cookies[name] = value; }
  }
  next();
});
app.use(async (req, res, next) => {
  try {
    await ready;
    next();
  } catch (error) {
    next(error);
  }
});

app.get('/healthz', async (req, res) => {
  try {
    await get('SELECT 1 AS ok');
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('La comprobación de salud no pudo consultar la base de datos:', error.message);
    res.status(503).json({ ok: false });
  }
});

app.post(['/api/auth/register', '/registrar'], registerAccount);

app.post('/api/auth/login', rateLimit(10, 15 * 60 * 1000), async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = req.body?.password;
  if (!email || typeof password !== 'string') return res.status(400).json({ error: 'Ingresa correo y contraseña.' });
  const user = await get(`SELECT id, rol, password_hash, password_salt FROM Usuarios
    WHERE lower(trim(email)) = ?`, [email]);
  if (!user) return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });

  let valid = false;
  if (user.password_salt === 'salt_temporal') {
    const stored = Buffer.from(String(user.password_hash));
    const supplied = Buffer.from(password);
    valid = stored.length === supplied.length && crypto.timingSafeEqual(stored, supplied);
  } else {
    const actual = crypto.pbkdf2Sync(password, user.password_salt, PASSWORD_ITERATIONS, 32, 'sha256');
    const expected = Buffer.from(user.password_hash, 'hex');
    valid = expected.length === actual.length && crypto.timingSafeEqual(actual, expected);
  }
  if (!valid) return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
  if (user.password_salt === 'salt_temporal') {
    const upgraded = hashPassword(password);
    await transaction(() => run('UPDATE Usuarios SET password_hash = ?, password_salt = ? WHERE id = ?',
      [upgraded.hash, upgraded.salt, user.id]));
  }
  await createSession(user.id, res);
  const profile = await get(`SELECT u.id, u.rol, u.nombre, u.email, u.telefono, u.dni_ruc,
    u.ubicacion_general, c.direccion_entrega, p.departamento, p.provincia, p.distrito, p.comunidad,
    t.vehiculo, t.capacidad, t.placa, t.licencia_categoria, t.licencia_vencimiento, t.zonas_servicio
    FROM Usuarios u LEFT JOIN Compradores c ON c.usuario_id=u.id
    LEFT JOIN Productores p ON p.usuario_id=u.id LEFT JOIN Transportistas t ON t.usuario_id=u.id
    WHERE u.id = ?`, [user.id]);
  res.json({ user: safeUser(profile) });
});

app.get('/api/auth/me', async (req, res) => {
  const user = await currentUser(req);
  if (!user && req.cookies[COOKIE_NAME]) {
    return res.status(401).json({ error: 'Inicia sesión para continuar.' });
  }
  res.json({ user: user ? safeUser(user) : null });
});

app.delete('/api/auth/session', async (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  if (token) await transaction(() => run('DELETE FROM AuthSessions WHERE token_hash = ?', [tokenHash(token)]));
  clearSessionCookie(res);
  res.json({ ok: true });
});

app.post('/api/auth/recovery-code', rateLimit(5, 15 * 60 * 1000), async (req, res) => {
  const channel = cleanText(req.body?.canal, 20);
  const identifier = cleanText(req.body?.identificador, 180);
  if (!['email', 'whatsapp'].includes(channel) || !identifier) {
    return res.status(400).json({ error: 'Selecciona correo o WhatsApp e ingresa el dato asociado a tu cuenta.' });
  }
  if (channel === 'email' && (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS)) {
    return res.status(503).json({ error: 'La recuperación por correo no está configurada en el servidor.' });
  }
  if (channel === 'whatsapp' && (!process.env.WHATSAPP_PHONE_NUMBER_ID ||
      !process.env.WHATSAPP_ACCESS_TOKEN || !process.env.WHATSAPP_API_VERSION ||
      !process.env.WHATSAPP_TEMPLATE_NAME || !process.env.WHATSAPP_TEMPLATE_LANGUAGE)) {
    return res.status(503).json({ error: 'La recuperación por WhatsApp no está configurada en el servidor.' });
  }
  const lookup = await findRecoveryUser(channel, identifier);
  if (lookup.error) return res.status(400).json({ error: lookup.error });
  const genericMessage = 'Si existe una cuenta con ese dato, enviaremos un código de recuperación válido por 10 minutos.';
  if (!lookup.user) return res.json({ ok: true, message: genericMessage });
  const recent = await get(`SELECT COUNT(*) AS total FROM PasswordResetCodes
    WHERE usuario_id=? AND canal=? AND created_at>=datetime('now', '-15 minutes')`,
  [lookup.user.id, channel]);
  if (Number(recent?.total || 0) >= 3) return res.json({ ok: true, message: genericMessage });

  const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
  const salt = crypto.randomBytes(16).toString('hex');
  const codeHash = crypto.pbkdf2Sync(code, salt, 200000, 32, 'sha256').toString('hex');
  const codeRecord = await transaction(async () => {
    await run('DELETE FROM PasswordResetCodes WHERE usuario_id=? AND canal=? AND used_at IS NULL',
      [lookup.user.id, channel]);
    return run(`INSERT INTO PasswordResetCodes
      (usuario_id, canal, codigo_hash, codigo_salt, expires_at)
      VALUES (?, ?, ?, ?, ?)`, [
      lookup.user.id, channel, codeHash, salt, Date.now() + 10 * 60 * 1000
    ]);
  });
  try {
    if (channel === 'email') await sendRecoveryCodeEmail(lookup.user, code);
    else await sendWhatsAppRecoveryCode(lookup.user, code);
  } catch (error) {
    await transaction(() => run('UPDATE PasswordResetCodes SET used_at=CURRENT_TIMESTAMP WHERE id=?',
      [codeRecord.id]));
    console.error(`No se pudo enviar el código de recuperación por ${channel}:`, error.message);
    return res.status(502).json({ error: 'No se pudo enviar el código. Verifica la configuración e inténtalo nuevamente.' });
  }
  res.json({ ok: true, message: genericMessage });
});

app.post('/api/auth/verify-recovery-code', rateLimit(10, 15 * 60 * 1000), async (req, res) => {
  const channel = cleanText(req.body?.canal, 20);
  const identifier = cleanText(req.body?.identificador, 180);
  const code = String(req.body?.codigo || '');
  if (!['email', 'whatsapp'].includes(channel) || !identifier || !/^\d{6}$/.test(code)) {
    return res.status(400).json({ error: 'El código ingresado no es válido.' });
  }
  const lookup = await findRecoveryUser(channel, identifier);
  const reset = lookup.user ? await get(`SELECT id, usuario_id, codigo_hash, codigo_salt
      FROM PasswordResetCodes
      WHERE usuario_id=? AND canal=? AND expires_at>? AND used_at IS NULL AND attempts<5
      ORDER BY id DESC LIMIT 1`, [lookup.user.id, channel, Date.now()]) : null;
  if (!reset) return res.status(400).json({ error: 'El código venció o no es válido. Solicita uno nuevo.' });
  const supplied = crypto.pbkdf2Sync(code, reset.codigo_salt, 200000, 32, 'sha256');
  const expected = Buffer.from(reset.codigo_hash, 'hex');
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) {
    await transaction(() => run(`UPDATE PasswordResetCodes SET attempts=attempts+1
      WHERE id=? AND used_at IS NULL AND expires_at>? AND attempts<5`, [reset.id, Date.now()]));
    return res.status(400).json({ error: 'El código ingresado no es válido. Revisa el mensaje e inténtalo nuevamente.' });
  }
  const token = crypto.randomBytes(32).toString('base64url');
  try {
    await transaction(async () => {
      const consumed = await run(`UPDATE PasswordResetCodes SET used_at=CURRENT_TIMESTAMP
        WHERE id=? AND used_at IS NULL AND expires_at>? AND attempts<5`, [reset.id, Date.now()]);
      if (!consumed.changes) throw Object.assign(new Error(
        'El código venció o ya fue utilizado. Solicita uno nuevo.'
      ), { status: 400 });
      await run('DELETE FROM PasswordResetTokens WHERE usuario_id=?', [reset.usuario_id]);
      await run(`INSERT INTO PasswordResetTokens(token_hash, usuario_id, expires_at)
        VALUES (?, ?, ?)`, [tokenHash(token), reset.usuario_id, Date.now() + RESET_MINUTES * 60 * 1000]);
    });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ error: error.message });
    throw error;
  }
  res.json({ ok: true, token, message: 'Código verificado. Crea una nueva contraseña.' });
});

app.post('/api/auth/forgot-password', rateLimit(5, 60 * 60 * 1000), async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Ingresa un correo válido.' });
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return res.status(503).json({
    error: 'La recuperación por correo todavía no está configurada. El administrador debe completar SMTP_USER y SMTP_PASS en el archivo .env.'
  });
  const user = await get('SELECT id, nombre, email FROM Usuarios WHERE lower(trim(email)) = ?', [email]);
  if (user) {
    const token = crypto.randomBytes(32).toString('base64url');
    const expiresAt = Date.now() + RESET_MINUTES * 60 * 1000;
    await transaction(async () => {
      await run('DELETE FROM PasswordResetTokens WHERE usuario_id = ?', [user.id]);
      await run('INSERT INTO PasswordResetTokens(token_hash, usuario_id, expires_at) VALUES (?, ?, ?)',
        [tokenHash(token), user.id, expiresAt]);
    });
    const baseUrl = (process.env.APP_BASE_URL || `http://localhost:${PORT}`).replace(/\/+$/, '');
    const resetUrl = `${baseUrl}/?restablecer=${encodeURIComponent(token)}`;
    try {
      await sendPasswordResetEmail(user, resetUrl);
    } catch (error) {
      await transaction(() => run('DELETE FROM PasswordResetTokens WHERE usuario_id = ?', [user.id]));
      console.error('No se pudo enviar el correo de recuperación:', error.message);
      return res.status(502).json({ error: 'No se pudo enviar el correo de recuperación. Verifica la configuración SMTP e inténtalo nuevamente.' });
    }
  }
  res.json({ ok: true, message: 'Si el correo está registrado, recibirás instrucciones para recuperar la cuenta.' });
});

app.post('/api/auth/reset-password', async (req, res) => {
  const token = String(req.body?.token || '');
  const password = req.body?.password;
  if (token.length < 32 || typeof password !== 'string' || password.length < 8 || password.length > 200) {
    return res.status(400).json({ error: 'Enlace inválido o contraseña fuera del rango permitido.' });
  }
  const reset = await get('SELECT usuario_id FROM PasswordResetTokens WHERE token_hash = ? AND expires_at > ? AND used_at IS NULL',
    [tokenHash(token), Date.now()]);
  if (!reset) return res.status(400).json({ error: 'El enlace venció o ya fue utilizado. Solicita uno nuevo.' });
  const credential = hashPassword(password);
  await transaction(async () => {
    await run('UPDATE Usuarios SET password_hash = ?, password_salt = ? WHERE id = ?',
      [credential.hash, credential.salt, reset.usuario_id]);
    await run('DELETE FROM AuthSessions WHERE usuario_id = ?', [reset.usuario_id]);
    await run('DELETE FROM PasswordResetTokens WHERE usuario_id = ?', [reset.usuario_id]);
  });
  clearSessionCookie(res);
  res.json({ ok: true, message: 'La contraseña fue actualizada. Ya puedes iniciar sesión.' });
});

app.get('/api/products', async (req, res) => {
  const products = await all(`SELECT p.id, p.productor_id, p.nombre, p.categoria, p.descripcion,
    p.region, p.precio, p.unidad, p.cantidad, p.imagen, u.nombre AS productor
    FROM ProductListings p JOIN Usuarios u ON u.id = p.productor_id
    WHERE p.estado = 'activo' AND p.cantidad > 0 ORDER BY p.created_at DESC`);
  res.json({ products });
});

app.get('/api/my/products', requireAuth, requireRole('Productor'), async (req, res) => {
  res.json({ products: await all('SELECT * FROM ProductListings WHERE productor_id = ? ORDER BY id DESC', [req.user.id]) });
});

function validateProduct(body) {
  const price = Number(body.precio);
  const quantity = Number(body.cantidad);
  if (!cleanText(body.nombre, 100) || !cleanText(body.categoria, 60) ||
      !cleanText(body.region, 80) || !cleanText(body.unidad, 30)) return 'Completa nombre, categoría, región y unidad.';
  if (!Number.isFinite(price) || price <= 0 || price > 10000000) return 'El precio debe ser mayor que cero.';
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > 10000000) return 'Indica una cantidad válida.';
  return null;
}

function validateProductImage(value) {
  if (value === undefined || value === null || value === '') return { value: null, error: null };
  if (typeof value !== 'string' || value.length > 1500000) {
    return { value: null, error: 'La imagen supera el tamaño permitido. Usa una imagen de hasta 1 MB.' };
  }
  const match = value.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/);
  if (!match) return { value: null, error: 'Sube una imagen JPG, PNG o WebP válida.' };
  const image = Buffer.from(match[2], 'base64');
  if (image.length > 1000000 || image.toString('base64') !== match[2]) {
    return { value: null, error: 'La imagen supera el tamaño permitido o está dañada.' };
  }
  const type = match[1];
  const validSignature = type === 'jpeg'
    ? image.length >= 3 && image[0] === 0xff && image[1] === 0xd8 && image[2] === 0xff
    : type === 'png'
      ? image.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
      : image.length >= 12 && image.toString('ascii', 0, 4) === 'RIFF' &&
        image.toString('ascii', 8, 12) === 'WEBP';
  return validSignature
    ? { value, error: null }
    : { value: null, error: 'El contenido del archivo no coincide con su formato de imagen.' };
}

app.post('/api/my/products', requireAuth, requireRole('Productor'), async (req, res) => {
  const error = validateProduct(req.body || {});
  if (error) return res.status(400).json({ error });
  const body = req.body;
  const image = validateProductImage(body.imagen);
  if (image.error) return res.status(400).json({ error: image.error });
  const result = await transaction(() => run(`INSERT INTO ProductListings
    (productor_id, nombre, categoria, descripcion, region, precio, unidad, cantidad, imagen)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
    req.user.id, cleanText(body.nombre, 100), cleanText(body.categoria, 60),
    cleanText(body.descripcion, 800), cleanText(body.region, 80), Number(body.precio),
    cleanText(body.unidad, 30), Number(body.cantidad), image.value || ''
  ]));
  res.status(201).json({ id: result.id, message: 'Cosecha publicada.' });
});

app.patch('/api/my/products/:id', requireAuth, requireRole('Productor'), async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'Producto inválido.' });
  if (req.body?.estado === 'inactivo') {
    const result = await transaction(() => run(
      "UPDATE ProductListings SET estado = 'inactivo', updated_at = CURRENT_TIMESTAMP WHERE id = ? AND productor_id = ?",
      [id, req.user.id]
    ));
    return result.changes ? res.json({ ok: true }) : res.status(404).json({ error: 'No se encontró la cosecha.' });
  }
  if (req.body?.estado === 'activo') {
    const product = await get('SELECT cantidad FROM ProductListings WHERE id = ? AND productor_id = ?',
      [id, req.user.id]);
    if (!product) return res.status(404).json({ error: 'No se encontró la cosecha.' });
    if (product.cantidad <= 0) return res.status(409).json({ error: 'Actualiza la cantidad antes de reactivar esta publicación.' });
    const result = await transaction(() => run(`UPDATE ProductListings
      SET estado = 'activo', updated_at = CURRENT_TIMESTAMP WHERE id = ? AND productor_id = ?`,
    [id, req.user.id]));
    return result.changes ? res.json({ ok: true }) : res.status(404).json({ error: 'No se encontró la cosecha.' });
  }
  const error = validateProduct(req.body || {});
  if (error) return res.status(400).json({ error });
  const body = req.body;
  const image = validateProductImage(body.imagen);
  if (image.error) return res.status(400).json({ error: image.error });
  const result = await transaction(() => run(`UPDATE ProductListings SET
    nombre = ?, categoria = ?, descripcion = ?, region = ?, precio = ?, unidad = ?,
    cantidad = ?, imagen = COALESCE(?, imagen),
    estado = CASE WHEN ? > 0 THEN 'activo' ELSE 'inactivo' END,
    updated_at = CURRENT_TIMESTAMP WHERE id = ? AND productor_id = ?`, [
    cleanText(body.nombre, 100), cleanText(body.categoria, 60), cleanText(body.descripcion, 800),
    cleanText(body.region, 80), Number(body.precio), cleanText(body.unidad, 30),
    Number(body.cantidad), image.value, Number(body.cantidad), id, req.user.id
  ]));
  res.json(result.changes ? { ok: true } : { error: 'No se encontró la cosecha.' });
});

app.post('/api/orders', requireAuth, requireRole('Comprador'), async (req, res) => {
  const items = req.body?.items;
  const address = cleanText(req.body?.direccion_entrega, 300);
  if (!Array.isArray(items) || items.length < 1 || items.length > 20 || !address) {
    return res.status(400).json({ error: 'Agrega productos publicados y confirma la dirección de entrega.' });
  }
  const ids = items.map(item => Number(item.product_id));
  const quantities = items.map(item => Number(item.cantidad));
  if (ids.some(id => !Number.isInteger(id) || id < 1) ||
      quantities.some(quantity => !Number.isInteger(quantity) || quantity < 1 || quantity > 100000)) {
    return res.status(400).json({ error: 'El carrito tiene un producto o cantidad inválida.' });
  }
  try {
    const orderIds = await transaction(async () => {
      const created = [];
      for (let index = 0; index < ids.length; index += 1) {
        const product = await get(`SELECT id, productor_id, nombre, precio, unidad, cantidad
          FROM ProductListings WHERE id = ? AND estado = 'activo'`, [ids[index]]);
        if (!product || product.cantidad < quantities[index]) throw Object.assign(new Error(
          'Una cosecha dejó de estar disponible o no tiene suficiente cantidad. Actualiza el catálogo.'
        ), { status: 409 });
        if (product.productor_id === req.user.id) throw Object.assign(new Error(
          'No puedes realizar un pedido de una cosecha publicada por tu propia cuenta.'
        ), { status: 400 });
        const total = Number((product.precio * quantities[index]).toFixed(2));
        const inserted = await run(`INSERT INTO Orders
          (comprador_id, productor_id, product_id, nombre_producto, cantidad, unidad,
           precio_unitario, total, direccion_entrega, requiere_transporte)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
          req.user.id, product.productor_id, product.id, product.nombre, quantities[index],
          product.unidad, product.precio, total, address, req.body?.requiere_transporte ? 1 : 0
        ]);
        await run(`UPDATE ProductListings SET cantidad = cantidad - ?,
          estado = CASE WHEN cantidad - ? <= 0 THEN 'inactivo' ELSE estado END,
          updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [quantities[index], quantities[index], product.id]);
        await createConversation(inserted.id, 'producto', [req.user.id, product.productor_id]);
        created.push(inserted.id);
      }
      return created;
    });
    res.status(201).json({ orderIds, message: 'Solicitud de compra enviada. Ya puedes conversar con el agricultor.' });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ error: error.message });
    throw error;
  }
});

app.get('/api/orders', requireAuth, async (req, res) => {
  const field = req.user.rol === 'Comprador' ? 'o.comprador_id' :
    req.user.rol === 'Productor' ? 'o.productor_id' : 'o.transportista_id';
  const orders = await all(`SELECT o.*, b.nombre AS comprador, p.nombre AS productor,
    t.nombre AS transportista FROM Orders o
    JOIN Usuarios b ON b.id = o.comprador_id JOIN Usuarios p ON p.id = o.productor_id
    LEFT JOIN Usuarios t ON t.id = o.transportista_id
    WHERE ${field} = ? ORDER BY o.id DESC`, [req.user.id]);
  res.json({ orders });
});

app.get('/api/transport/requests', requireAuth, async (req, res) => {
  const requests = req.user.rol === 'Distribuidor'
    ? await all(`SELECT r.*, creator.nombre AS creador, buyer.nombre AS comprador,
        farmer.nombre AS productor, driver.nombre AS transportista,
        (SELECT contenido FROM TransportRequestMessages m
          WHERE m.solicitud_id=r.id ORDER BY m.id DESC LIMIT 1) AS ultimo_mensaje
      FROM TransportRequests r
      JOIN Usuarios creator ON creator.id=r.creador_id
      LEFT JOIN Usuarios buyer ON buyer.id=r.comprador_id
      LEFT JOIN Usuarios farmer ON farmer.id=r.productor_id
      LEFT JOIN Usuarios driver ON driver.id=r.transportista_id
      WHERE r.estado='abierta' OR r.transportista_id=?
      ORDER BY r.id DESC LIMIT 100`, [req.user.id])
    : await all(`SELECT r.*, creator.nombre AS creador, buyer.nombre AS comprador,
        farmer.nombre AS productor, driver.nombre AS transportista,
        (SELECT contenido FROM TransportRequestMessages m
          WHERE m.solicitud_id=r.id ORDER BY m.id DESC LIMIT 1) AS ultimo_mensaje
      FROM TransportRequests r
      JOIN Usuarios creator ON creator.id=r.creador_id
      LEFT JOIN Usuarios buyer ON buyer.id=r.comprador_id
      LEFT JOIN Usuarios farmer ON farmer.id=r.productor_id
      LEFT JOIN Usuarios driver ON driver.id=r.transportista_id
      WHERE r.creador_id=? OR r.comprador_id=? OR r.productor_id=?
      ORDER BY r.id DESC LIMIT 100`, [req.user.id, req.user.id, req.user.id]);
  res.json({ requests });
});

app.post('/api/transport/requests', requireAuth, requireRole('Comprador', 'Productor'), async (req, res) => {
  const orderId = req.body?.pedido_id ? Number(req.body.pedido_id) : null;
  if (orderId !== null && (!Number.isInteger(orderId) || orderId < 1)) {
    return res.status(400).json({ error: 'Selecciona un pedido válido o crea una solicitud independiente.' });
  }
  const origin = cleanText(req.body?.origen, 240);
  const requestedDestination = cleanText(req.body?.destino, 240);
  const pickup = cleanText(req.body?.fecha_recojo, 30);
  if (!origin || (!orderId && !requestedDestination)) {
    return res.status(400).json({ error: 'Indica el lugar de origen y el destino del transporte.' });
  }
  if (pickup && (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(pickup) || Number.isNaN(Date.parse(pickup)))) {
    return res.status(400).json({ error: 'La fecha de recojo no es válida.' });
  }
  let order = null;
  if (orderId) {
    order = await get(`SELECT id, comprador_id, productor_id, nombre_producto, cantidad, unidad,
        direccion_entrega, transportista_id, estado
      FROM Orders WHERE id=?`, [orderId]);
    if (!order) return res.status(404).json({ error: 'No se encontró el pedido elegido.' });
    if (![order.comprador_id, order.productor_id].includes(req.user.id)) {
      return res.status(403).json({ error: 'Solo las personas del pedido pueden asociarlo a la solicitud.' });
    }
    if (order.transportista_id || ['completado', 'cancelado'].includes(order.estado)) {
      return res.status(409).json({ error: 'Ese pedido ya tiene transporte o no está disponible.' });
    }
    const activeRequest = await get(`SELECT id FROM TransportRequests
      WHERE order_id=? AND estado IN ('abierta', 'aceptada')`, [orderId]);
    if (activeRequest) return res.status(409).json({ error: 'Ese pedido ya tiene una solicitud de transporte activa.' });
  }
  const cargo = order ? order.nombre_producto : cleanText(req.body?.carga, 120);
  const quantity = order ? order.cantidad : Number(req.body?.cantidad);
  const unit = order ? order.unidad : cleanText(req.body?.unidad, 30);
  const destination = order ? order.direccion_entrega : requestedDestination;
  if (!cargo || !Number.isInteger(quantity) || quantity < 1 || quantity > 1000000 || !unit) {
    return res.status(400).json({ error: 'Indica una carga, cantidad y unidad válidas.' });
  }
  const buyerId = order?.comprador_id || (req.user.rol === 'Comprador' ? req.user.id : null);
  const farmerId = order?.productor_id || (req.user.rol === 'Productor' ? req.user.id : null);
  const result = await transaction(() => run(`INSERT INTO TransportRequests
    (creador_id, order_id, comprador_id, productor_id, carga, cantidad, unidad, origen,
     destino, fecha_recojo, detalles)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
    req.user.id, order?.id || null, buyerId, farmerId, cargo, quantity, unit, origin,
    destination, pickup, cleanText(req.body?.detalles, 800)
  ]));
  res.status(201).json({ id: result.id, message: 'Solicitud publicada para transportistas.' });
});

app.post('/api/transport/requests/:id/accept', requireAuth, requireRole('Distribuidor'), async (req, res) => {
  const id = Number(req.params.id);
  const price = Number(req.body?.precio);
  if (!Number.isInteger(id) || id < 1 || !Number.isFinite(price) || price <= 0 || price > 10000000) {
    return res.status(400).json({ error: 'Indica un precio de transporte válido.' });
  }
  const request = await get(`SELECT order_id FROM TransportRequests
    WHERE id=? AND estado='abierta' AND transportista_id IS NULL`, [id]);
  if (!request) return res.status(409).json({ error: 'La solicitud ya fue aceptada o dejó de estar disponible.' });
  try {
    const accepted = await transaction(async () => {
      if (request.order_id) {
        const orderUpdate = await run(`UPDATE Orders SET transportista_id=?, estado='transporte_asignado',
          updated_at=CURRENT_TIMESTAMP WHERE id=? AND transportista_id IS NULL
          AND estado NOT IN ('completado', 'cancelado')`, [req.user.id, request.order_id]);
        if (!orderUpdate.changes) throw Object.assign(new Error(
          'El pedido ya tiene otro transporte asignado.'
        ), { status: 409 });
      }
      const update = await run(`UPDATE TransportRequests
        SET estado='aceptada', transportista_id=?, precio_acordado=?
        WHERE id=? AND estado='abierta' AND transportista_id IS NULL`, [req.user.id, price, id]);
      if (!update.changes) throw Object.assign(new Error(
        'La solicitud ya fue aceptada o dejó de estar disponible.'
      ), { status: 409 });
      return true;
    });
    if (!accepted) return res.status(409).json({ error: 'La solicitud ya no está disponible.' });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ error: error.message });
    throw error;
  }
  res.status(200).json({ ok: true, message: 'Solicitud aceptada. Ya se abrió el chat de coordinación.' });
});

async function getTransportRequestForMember(id, userId) {
  const request = await get('SELECT * FROM TransportRequests WHERE id=?', [id]);
  if (!request) return null;
  return [request.creador_id, request.comprador_id, request.productor_id, request.transportista_id]
    .includes(userId) ? request : null;
}

app.get('/api/transport/requests/:id/messages', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1 || !(await getTransportRequestForMember(id, req.user.id))) {
    return res.status(404).json({ error: 'No tienes acceso a esta conversación.' });
  }
  const after = Math.max(0, Number(req.query.after) || 0);
  const messages = await all(`SELECT m.id, m.contenido, m.created_at, m.usuario_id, u.nombre AS autor
    FROM TransportRequestMessages m JOIN Usuarios u ON u.id=m.usuario_id
    WHERE m.solicitud_id=? AND m.id>? ORDER BY m.id ASC LIMIT 200`, [id, after]);
  res.json({ messages });
});

app.post('/api/transport/requests/:id/messages', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const content = cleanText(req.body?.contenido, 2000);
  if (!content) return res.status(400).json({ error: 'Escribe un mensaje antes de enviarlo.' });
  if (!Number.isInteger(id) || id < 1 || !(await getTransportRequestForMember(id, req.user.id))) {
    return res.status(404).json({ error: 'No tienes acceso a esta conversación.' });
  }
  const message = await transaction(async () => {
    const result = await run(`INSERT INTO TransportRequestMessages(solicitud_id, usuario_id, contenido)
      VALUES (?, ?, ?)`, [id, req.user.id, content]);
    return get(`SELECT m.id, m.contenido, m.created_at, m.usuario_id, u.nombre AS autor
      FROM TransportRequestMessages m JOIN Usuarios u ON u.id=m.usuario_id WHERE m.id=?`, [result.id]);
  });
  res.status(201).json({ message });
});

app.get('/api/transport/jobs', requireAuth, requireRole('Distribuidor'), async (req, res) => {
  const jobs = await all(`SELECT o.id, o.nombre_producto, o.cantidad, o.unidad, o.direccion_entrega,
    o.total, o.estado, o.created_at, b.nombre AS comprador, p.nombre AS productor,
    EXISTS(SELECT 1 FROM TransportOffers f WHERE f.order_id=o.id AND f.transportista_id=?) AS ya_ofertado
    FROM Orders o JOIN Usuarios b ON b.id=o.comprador_id JOIN Usuarios p ON p.id=o.productor_id
    WHERE o.requiere_transporte=1 AND o.transportista_id IS NULL
      AND o.estado IN ('pendiente', 'confirmado', 'listo')
      AND o.productor_id <> ? ORDER BY o.id DESC`, [req.user.id, req.user.id]);
  res.json({ jobs });
});

app.post('/api/orders/:id/transport-offers', requireAuth, requireRole('Distribuidor'), async (req, res) => {
  const orderId = Number(req.params.id);
  const price = Number(req.body?.precio);
  const message = cleanText(req.body?.mensaje, 400);
  if (!Number.isInteger(orderId) || !Number.isFinite(price) || price <= 0 || price > 10000000) {
    return res.status(400).json({ error: 'Indica un precio de transporte válido.' });
  }
  const order = await get(`SELECT id, comprador_id, productor_id FROM Orders
    WHERE id=? AND requiere_transporte=1 AND transportista_id IS NULL`, [orderId]);
  if (!order) return res.status(404).json({ error: 'El pedido ya no está disponible para ofertar.' });
  if (order.comprador_id === req.user.id || order.productor_id === req.user.id) {
    return res.status(403).json({ error: 'No puedes ofertar en tu propio pedido.' });
  }
  await transaction(async () => {
    const previous = await get('SELECT id FROM TransportOffers WHERE order_id=? AND transportista_id=?',
      [orderId, req.user.id]);
    if (previous) {
      await run("UPDATE TransportOffers SET precio=?, mensaje=?, estado='pendiente', created_at=CURRENT_TIMESTAMP WHERE id=?",
        [price, message, previous.id]);
    } else {
      await run('INSERT INTO TransportOffers(order_id, transportista_id, precio, mensaje) VALUES (?, ?, ?, ?)',
        [orderId, req.user.id, price, message]);
    }
    await createConversation(orderId, 'transporte',
      [order.comprador_id, order.productor_id, req.user.id], req.user.id);
  });
  res.status(201).json({ ok: true, message: 'Tu oferta fue enviada.' });
});

app.get('/api/orders/:id/transport-offers', requireAuth, async (req, res) => {
  const orderId = Number(req.params.id);
  const order = await get('SELECT comprador_id, productor_id FROM Orders WHERE id=?', [orderId]);
  if (!order) return res.status(404).json({ error: 'Pedido no encontrado.' });
  if (![order.comprador_id, order.productor_id].includes(req.user.id)) {
    return res.status(403).json({ error: 'No puedes consultar las ofertas de este pedido.' });
  }
  res.json({ offers: await all(`SELECT f.id, f.order_id, f.precio, f.mensaje, f.estado,
    f.created_at, u.nombre AS transportista, t.vehiculo, t.capacidad, t.zonas_servicio
    FROM TransportOffers f JOIN Usuarios u ON u.id=f.transportista_id
    LEFT JOIN Transportistas t ON t.usuario_id=u.id WHERE f.order_id=? ORDER BY f.id DESC`, [orderId]) });
});

app.post('/api/orders/:id/transport-offers/:offerId/accept', requireAuth, async (req, res) => {
  const orderId = Number(req.params.id);
  const offerId = Number(req.params.offerId);
  const order = await get('SELECT comprador_id, productor_id, transportista_id FROM Orders WHERE id=?', [orderId]);
  if (!order) return res.status(404).json({ error: 'Pedido no encontrado.' });
  if (order.comprador_id !== req.user.id) return res.status(403).json({ error: 'Solo el comprador puede elegir el transporte.' });
  if (order.transportista_id) return res.status(409).json({ error: 'Ya se asignó un transportista a este pedido.' });
  const offer = await get("SELECT transportista_id FROM TransportOffers WHERE id=? AND order_id=? AND estado='pendiente'",
    [offerId, orderId]);
  if (!offer) return res.status(404).json({ error: 'La oferta ya no está disponible.' });
  await transaction(async () => {
    await run("UPDATE Orders SET transportista_id=?, estado='transporte_asignado', updated_at=CURRENT_TIMESTAMP WHERE id=?",
      [offer.transportista_id, orderId]);
    await run("UPDATE TransportOffers SET estado=CASE WHEN id=? THEN 'aceptada' ELSE 'no_seleccionada' END WHERE order_id=?",
      [offerId, orderId]);
    await run(`UPDATE TransportRequests SET estado='cancelada'
      WHERE order_id=? AND estado='abierta'`, [orderId]);
    await createConversation(orderId, 'transporte',
      [order.comprador_id, order.productor_id, offer.transportista_id], offer.transportista_id);
  });
  res.json({ ok: true, message: 'Transportista asignado. Se abrió un chat con las partes.' });
});

app.patch('/api/orders/:id/status', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const status = cleanText(req.body?.estado, 30);
  const order = await get('SELECT comprador_id, productor_id, estado FROM Orders WHERE id=?', [id]);
  if (!order) return res.status(404).json({ error: 'Pedido no encontrado.' });
  if (status === 'listo' && order.productor_id === req.user.id && ['pendiente', 'confirmado'].includes(order.estado)) {
    await transaction(() => run("UPDATE Orders SET estado='listo', updated_at=CURRENT_TIMESTAMP WHERE id=?", [id]));
    return res.json({ ok: true });
  }
  if (status === 'completado' && order.comprador_id === req.user.id && order.estado !== 'completado') {
    await transaction(() => run("UPDATE Orders SET estado='completado', updated_at=CURRENT_TIMESTAMP WHERE id=?", [id]));
    return res.json({ ok: true });
  }
  return res.status(403).json({ error: 'No está permitido cambiar el estado de este pedido.' });
});

app.get('/api/conversations', requireAuth, async (req, res) => {
  const conversations = await all(`SELECT c.id, c.order_id, c.tipo, c.created_at,
  c.transportista_id,
    o.nombre_producto, o.estado, o.total,
    (SELECT contenido FROM Messages m WHERE m.conversation_id=c.id ORDER BY m.id DESC LIMIT 1) AS ultimo_mensaje,
    (SELECT created_at FROM Messages m WHERE m.conversation_id=c.id ORDER BY m.id DESC LIMIT 1) AS mensaje_fecha
    FROM Conversations c JOIN ConversationMembers cm ON cm.conversation_id=c.id
    JOIN Orders o ON o.id=c.order_id WHERE cm.usuario_id=? ORDER BY c.id DESC`, [req.user.id]);
  res.json({ conversations });
});

app.get('/api/conversations/:id/messages', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const member = await get('SELECT 1 FROM ConversationMembers WHERE conversation_id=? AND usuario_id=?',
    [id, req.user.id]);
  if (!member) return res.status(404).json({ error: 'No existe esa conversación.' });
  const after = Math.max(0, Number(req.query.after) || 0);
  const messages = await all(`SELECT m.id, m.contenido, m.created_at, m.usuario_id, u.nombre AS autor
    FROM Messages m JOIN Usuarios u ON u.id=m.usuario_id
    WHERE m.conversation_id=? AND m.id>? ORDER BY m.id ASC LIMIT 200`, [id, after]);
  res.json({ messages });
});

app.post('/api/conversations/:id/messages', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const content = cleanText(req.body?.contenido, 2000);
  if (!content) return res.status(400).json({ error: 'Escribe un mensaje antes de enviarlo.' });
  const member = await get('SELECT 1 FROM ConversationMembers WHERE conversation_id=? AND usuario_id=?',
    [id, req.user.id]);
  if (!member) return res.status(404).json({ error: 'No existe esa conversación.' });
  const message = await transaction(async () => {
    const result = await run('INSERT INTO Messages(conversation_id, usuario_id, contenido) VALUES (?, ?, ?)',
      [id, req.user.id, content]);
    return get(`SELECT m.id, m.contenido, m.created_at, m.usuario_id, u.nombre AS autor
      FROM Messages m JOIN Usuarios u ON u.id=m.usuario_id WHERE m.id=?`, [result.id]);
  });
  res.status(201).json({ message });
});

const assistantAnswers = [
  [/registr|crear.*cuenta|correo.*unico/i, 'Cada correo solo puede registrar una cuenta y un perfil. Después de crearla, la sesión queda iniciada; usa “Mi cuenta” para volver a entrar. Si olvidaste tu clave, solicita recuperación desde el acceso.'],
  [/contrasen|ingresar|iniciar sesion|recuper|clave/i, 'Inicia sesión desde “Mi cuenta” con el correo y la contraseña de tu registro. En “Olvidé mi contraseña” puedes pedir un código de un solo uso por correo o WhatsApp; el canal debe estar configurado por el administrador.'],
  [/compr|carrito|pedido/i, 'Inicia sesión como comprador, agrega al carrito cosechas publicadas por agricultores, confirma dirección y cantidad, y envía la solicitud. El chat del pedido te conecta con el productor; los pagos se acuerdan directamente y no se procesan aquí.'],
  [/product|agricult|cosecha|public|editar|foto/i, 'La cuenta de agricultor incluye un panel para publicar, editar y pausar cosechas, con fotografía JPG, PNG o WebP optimizada. Las unidades disponibles se actualizan cuando se solicita un pedido.'],
  [/transport|delivery|envio|flete|conductor/i, 'En el Tablero de transporte, compradores y agricultores publican una ruta independiente o la vinculan a un pedido. El transportista acepta la solicitud con una tarifa y, si está vinculada al pedido, se abre un chat grupal con comprador, agricultor y transportista.'],
  [/chat|mensaje|convers/i, 'Los chats de compra conectan al comprador con el agricultor. El tablero de transporte abre una conversación para coordinar ruta y tarifa; si la solicitud está vinculada a un pedido, participan comprador, agricultor y transportista.'],
  [/pago|yape|plin|transfer|efectivo/i, 'AgroConecta no recibe ni custodia pagos en esta versión. Comprador y agricultor deben acordar por el chat un método de pago y guardar sus comprobantes. No compartas códigos de verificación.'],
  [/devol|reembols|cancel|danad|reclamo/i, 'Si surge un problema, conserva comprobantes y fotos, comunica el caso por el chat y contacta soporte desde el menú. Las solicitudes se revisan; la web no procesa reembolsos automáticamente.'],
  [/licencia|soat|vehicul|verific/i, 'El registro de transportista recopila datos del vehículo y la licencia, pero no carga ni verifica documentos. No envíes documentos sensibles por el chat.'],
  [/soporte|administr|ayuda humana|persona|agente/i, 'Si no logro resolverlo, dejaré tu consulta en la bandeja del administrador y podrás continuar en el mismo chat cuando responda. No incluyas contraseñas ni datos bancarios.'],
  [/hola|buenos dias|buenas tardes|buenas noches/i, 'Hola. Puedo ayudarte con cuentas, catálogo, pedidos, publicaciones agrícolas, transporte, chats, pagos y soporte. ¿Qué necesitas hacer en AgroConecta?']
];

app.post('/api/support/assistant', rateLimit(30, 60 * 1000), async (req, res) => {
  const message = cleanText(req.body?.mensaje, 1800);
  if (!message) return res.status(400).json({ error: 'Escribe una consulta.' });
  const match = assistantAnswers.find(([pattern]) => pattern.test(message));
  if (match) return res.json({ respuesta: match[1], derivado: false });
  const user = await currentUser(req);
  const ticket = await createTicket({
    userId: user?.id || null,
    email: user?.email || req.body?.email || '',
    subject: 'Consulta derivada desde el asistente',
    message
  });
  setSupportTicketCookie(res, ticket.id, ticket.accessToken);
  res.json({
    respuesta: `No encontré una respuesta confiable. Registré tu consulta con el ticket #${ticket.id} para que el administrador la revise en la bandeja de soporte. Puedes continuar en este mismo chat; evita enviar contraseñas o datos de pago.`,
    derivado: true,
    ticketId: ticket.id
  });
});

app.post('/api/support/tickets', rateLimit(10, 15 * 60 * 1000), async (req, res) => {
  const message = cleanText(req.body?.mensaje, 1800);
  const subject = cleanText(req.body?.asunto, 160);
  if (!message || !subject) return res.status(400).json({ error: 'Escribe el asunto y el detalle de tu consulta.' });
  const user = await currentUser(req);
  const ticket = await createTicket({
    userId: user?.id || null,
    email: user?.email || req.body?.email || '',
    subject,
    message
  });
  setSupportTicketCookie(res, ticket.id, ticket.accessToken);
  res.status(201).json({
    ticketId: ticket.id,
    message: `Tu consulta quedó registrada con el número #${ticket.id}. Puedes continuar por el chat de soporte.`
  });
});

async function getSupportTicketForUser(req, ticketId) {
  const ticket = await get('SELECT id, usuario_id, access_token_hash, estado FROM SupportTickets WHERE id=?', [ticketId]);
  if (!ticket) return null;
  const user = await currentUser(req);
  const accessToken = req.cookies[`agroconecta_support_${ticketId}`];
  const tokenMatches = accessToken && ticket.access_token_hash &&
    tokenHash(accessToken) === ticket.access_token_hash;
  return (user?.id === ticket.usuario_id || tokenMatches) ? ticket : null;
}

app.get('/api/support/tickets/:id/messages', async (req, res) => {
  const ticketId = Number(req.params.id);
  if (!Number.isInteger(ticketId) || ticketId < 1 ||
      !(await getSupportTicketForUser(req, ticketId))) {
    return res.status(404).json({ error: 'No tienes acceso a esta conversación de soporte.' });
  }
  const after = Math.max(0, Number(req.query.after) || 0);
  const messages = await all(`SELECT m.id, m.contenido, m.created_at, m.remitente,
      CASE WHEN m.remitente='admin' THEN 'Soporte AgroConecta'
        ELSE COALESCE(u.nombre, 'Usuario') END AS autor
    FROM SupportMessages m LEFT JOIN Usuarios u ON u.id=m.usuario_id
    WHERE m.ticket_id=? AND m.id>? ORDER BY m.id ASC LIMIT 200`, [ticketId, after]);
  res.json({ messages });
});

app.post('/api/support/tickets/:id/messages', rateLimit(30, 60 * 1000), async (req, res) => {
  const ticketId = Number(req.params.id);
  const content = cleanText(req.body?.mensaje, 1800);
  if (!content) return res.status(400).json({ error: 'Escribe un mensaje antes de enviarlo.' });
  const ticket = Number.isInteger(ticketId) && ticketId > 0
    ? await getSupportTicketForUser(req, ticketId) : null;
  if (!ticket) return res.status(404).json({ error: 'No tienes acceso a esta conversación de soporte.' });
  if (ticket.estado === 'resuelto') {
    return res.status(409).json({ error: 'Esta consulta está resuelta. Envía una nueva consulta si necesitas más ayuda.' });
  }
  const user = await currentUser(req);
  const result = await transaction(async () => {
    const inserted = await run(`INSERT INTO SupportMessages(ticket_id, usuario_id, remitente, contenido)
      VALUES (?, ?, 'usuario', ?)`, [ticketId, user?.id || null, content]);
    await run("UPDATE SupportTickets SET estado='abierto' WHERE id=? AND estado='resuelto'", [ticketId]);
    return get(`SELECT id, contenido, created_at, remitente, 'Tú' AS autor
      FROM SupportMessages WHERE id=?`, [inserted.id]);
  });
  res.status(201).json({ message: result });
});

function requireAdminKey(req, res, next) {
  const expected = process.env.ADMIN_API_KEY;
  const provided = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!expected || !provided || provided.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected))) {
    return res.status(401).json({ error: 'Clave administrativa inválida.' });
  }
  next();
}

app.get('/api/admin/tickets', requireAdminKey, async (req, res) => {
  res.json({ tickets: await all(`SELECT t.id, t.usuario_id, t.email, t.asunto, t.mensaje, t.estado,
      t.created_at,
      (SELECT contenido FROM SupportMessages m WHERE m.ticket_id=t.id ORDER BY m.id DESC LIMIT 1) AS ultimo_mensaje,
      (SELECT created_at FROM SupportMessages m WHERE m.ticket_id=t.id ORDER BY m.id DESC LIMIT 1) AS ultimo_mensaje_fecha,
      (SELECT id FROM SupportMessages m WHERE m.ticket_id=t.id ORDER BY m.id DESC LIMIT 1) AS ultimo_mensaje_id,
      (SELECT remitente FROM SupportMessages m WHERE m.ticket_id=t.id ORDER BY m.id DESC LIMIT 1) AS ultimo_remitente
    FROM SupportTickets t ORDER BY t.id DESC LIMIT 200`) });
});

app.get('/api/admin/tickets/:id/messages', requireAdminKey, async (req, res) => {
  const ticketId = Number(req.params.id);
  if (!Number.isInteger(ticketId) || ticketId < 1) return res.status(400).json({ error: 'Ticket inválido.' });
  const ticket = await get('SELECT id FROM SupportTickets WHERE id=?', [ticketId]);
  if (!ticket) return res.status(404).json({ error: 'No se encontró el ticket.' });
  const after = Math.max(0, Number(req.query.after) || 0);
  const messages = await all(`SELECT m.id, m.contenido, m.created_at, m.remitente,
      CASE WHEN m.remitente='admin' THEN 'Soporte AgroConecta'
        ELSE COALESCE(u.nombre, 'Usuario') END AS autor
    FROM SupportMessages m LEFT JOIN Usuarios u ON u.id=m.usuario_id
    WHERE m.ticket_id=? AND m.id>? ORDER BY m.id ASC LIMIT 200`, [ticketId, after]);
  res.json({ messages });
});

app.post('/api/admin/tickets/:id/messages', requireAdminKey, async (req, res) => {
  const ticketId = Number(req.params.id);
  const content = cleanText(req.body?.mensaje, 1800);
  if (!Number.isInteger(ticketId) || ticketId < 1 || !content) {
    return res.status(400).json({ error: 'Ticket o mensaje inválido.' });
  }
  const ticket = await get('SELECT id FROM SupportTickets WHERE id=?', [ticketId]);
  if (!ticket) return res.status(404).json({ error: 'No se encontró el ticket.' });
  const result = await transaction(async () => {
    const inserted = await run(`INSERT INTO SupportMessages(ticket_id, usuario_id, remitente, contenido)
      VALUES (?, NULL, 'admin', ?)`, [ticketId, content]);
    await run("UPDATE SupportTickets SET estado='en_revision' WHERE id=?", [ticketId]);
    return get(`SELECT id, contenido, created_at, remitente, 'Soporte AgroConecta' AS autor
      FROM SupportMessages WHERE id=?`, [inserted.id]);
  });
  res.status(201).json({ message: result });
});

app.patch('/api/admin/tickets/:id', requireAdminKey, async (req, res) => {
  const id = Number(req.params.id);
  const status = cleanText(req.body?.estado, 30);
  if (!Number.isInteger(id) || id < 1 || !['abierto', 'en_revision', 'resuelto'].includes(status)) {
    return res.status(400).json({ error: 'Ticket o estado inválido.' });
  }
  const result = await transaction(() => run('UPDATE SupportTickets SET estado=? WHERE id=?', [status, id]));
  if (!result.changes) return res.status(404).json({ error: 'No se encontró el ticket.' });
  res.json({ ok: true });
});

app.use(express.static(path.resolve(__dirname), { index: 'index.html' }));

app.use((error, req, res, next) => {
  console.error('Error de solicitud:', error);
  if (res.headersSent) return next(error);
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({ error: 'El contenido enviado no tiene un formato JSON válido.' });
  }
  res.status(500).json({ error: 'Ocurrió un error interno. Inténtalo nuevamente.' });
});

if (require.main === module) {
  ready.then(() => {
    app.listen(PORT, '0.0.0.0', () => console.log(`AgroConecta disponible en el puerto ${PORT}`));
  }).catch(error => {
    console.error('No se pudo preparar la base de datos:', error);
    process.exitCode = 1;
  });
}

module.exports = { app, ready, db, transaction };