# Despliegue de AgroConecta en Render con Turso

Esta configuración utiliza Render para ejecutar el servidor y Turso como base de datos persistente. El archivo `.env` y la base SQLite local no se modifican ni se copian.

## 1. Crear la base de datos Turso

1. Crea una base de datos en Turso y genera un token de autenticación con permisos para esa base.
2. Guarda la URL de conexión y el token en un gestor seguro. No los incluyas en el código ni los compartas.
3. La aplicación crea las tablas que necesita al iniciar. Una base Turso nueva comienza vacía; la información de la base local no se migra automáticamente.

## 2. Publicar el servicio en Render

Render necesita acceso a un repositorio Git que contenga este proyecto. En Render, crea un **Blueprint** desde ese repositorio para que lea `render.yaml`. El servicio está configurado con:

- Instalación: `npm ci`
- Inicio: `npm start`
- Comprobación de salud: `/healthz`
- Node.js: versión 22

En la configuración del servicio, completa las variables secretas marcadas `sync: false`:

| Variable | Valor |
| --- | --- |
| `TURSO_DATABASE_URL` | URL de la base de datos Turso |
| `TURSO_AUTH_TOKEN` | Token de acceso de esa base |
| `APP_BASE_URL` | URL HTTPS pública asignada por Render |
| `ADMIN_API_KEY` | Clave administrativa larga, aleatoria y exclusiva |

No agregues `AGROCONECTA_DB` a Render. Si Turso no está configurado, el servidor se detiene intencionalmente en Render en lugar de guardar datos en el disco efímero del servicio.

## 3. Recuperación de cuenta y soporte

La recuperación por correo necesita que configures `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` y `SMTP_FROM`. Para Gmail se requiere una contraseña de aplicación, no la contraseña normal de la cuenta.

La recuperación por WhatsApp es opcional y requiere una aplicación de Meta WhatsApp Cloud API, un número habilitado y una plantilla aprobada. Configura `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_API_VERSION`, `WHATSAPP_TEMPLATE_NAME` y `WHATSAPP_TEMPLATE_LANGUAGE`. Sin esa configuración, la aplicación informa que el canal no está disponible.

La bandeja de soporte es `admin.html`; su API requiere el valor secreto de `ADMIN_API_KEY`. La bandeja consulta mensajes mientras permanece abierta; no se envían avisos externos de nuevos tickets.

## 4. Comprobar el despliegue

1. Espera a que Render indique que el servicio está activo y que `/healthz` responde correctamente.
2. Abre la URL HTTPS de Render y prueba crear una cuenta, cerrar sesión e iniciar sesión.
3. Publica una cosecha de prueba y confirma que sigue visible después de reiniciar o volver a desplegar el servicio.
4. Prueba recuperación y soporte solo después de configurar sus proveedores.

Render sirve el mismo sitio HTTPS en móviles y computadoras; los usuarios comparten los datos porque se conectan al mismo servidor y a la misma base Turso.

## 5. Datos que ya existen en SQLite

Desplegar con Turso **no importa** ni elimina la base local. La migración de datos debe planificarse como una tarea separada: primero respalda el archivo SQLite, verifica compatibilidad de esquema y volumen, y luego importa mediante un procedimiento controlado. No copies el archivo SQLite al repositorio ni lo subas como variable o secreto de Render.
