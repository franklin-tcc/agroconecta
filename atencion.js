document.addEventListener('DOMContentLoaded', () => {
  const pages = {
    devoluciones: {
      title: 'Política de devolución y reembolso',
      intro: 'Pautas para comunicar incidencias relacionadas con productos agrícolas, cantidades, calidad y acuerdos de entrega.',
      sections: [
        ['Alcance actual', [
          'AgroConecta funciona como un prototipo de conexión entre productores, compradores y transportistas. Esta página no procesa órdenes, pagos, devoluciones ni reembolsos, y la plataforma no retiene dinero de las partes.',
          'Antes de confirmar una operación, comprador y vendedor deben acordar por escrito el producto, variedad, cantidad, precio, condición esperada, fecha y lugar de entrega, además de quién asume el transporte.'
        ]],
        ['Cómo comunicar una incidencia', [
          'Contacta primero a la contraparte tan pronto como detectes un problema. Describe de forma concreta la diferencia y conserva las conversaciones, comprobantes y fotografías del producto y del empaque.',
          'Si no logran resolverlo directamente, comunícate con atención al cliente e indica la fecha, los perfiles involucrados, el producto y el acuerdo alcanzado. Comparte únicamente la evidencia necesaria; oculta datos financieros o personales que no sean relevantes.'
        ]],
        ['Evaluación y posibles soluciones', [
          'Según el acuerdo entre las partes y las circunstancias, pueden conversar sobre reposición, ajuste de cantidad, reprogramación o devolución directa. Cualquier reembolso debe ser acordado y efectuado por quien recibió el pago, usando un canal de pago legítimo.',
          'AgroConecta puede orientar la comunicación, pero esta versión no determina automáticamente quién tiene la razón ni garantiza que una solicitud sea aceptada.'
        ]],
        ['Productos perecibles y evidencia', [
          'Por tratarse de cosechas perecibles, registra la incidencia al recibir el producto y evita desecharlo o modificarlo antes de comunicarte con el vendedor, salvo que sea necesario para proteger la salud o seguridad.',
          'Los plazos y condiciones definitivos deberán quedar establecidos en cada acuerdo comercial y ser revisados antes del lanzamiento de un servicio transaccional.'
        ]]
      ],
      callout: 'Documento orientativo del prototipo. No reemplaza un acuerdo de compraventa ni asesoría legal; debe revisarse antes de ofrecer pagos o pedidos dentro de la plataforma.'
    },
    propiedad: {
      title: 'Política de propiedad intelectual',
      intro: 'Reglas para el uso responsable de marcas, fotografías, textos y materiales publicados en AgroConecta.',
      sections: [
        ['Derechos sobre el contenido', [
          'Las marcas, identidad visual, textos de la plataforma, diseño y materiales de AgroConecta pertenecen a sus respectivos titulares. Su presencia en el sitio no concede permiso para reproducirlos, modificarlos, redistribuirlos o utilizarlos comercialmente.',
          'Cada usuario debe publicar únicamente fotografías, descripciones, marcas y documentos que haya creado o que esté autorizado a utilizar.'
        ]],
        ['Contenido de productos', [
          'Quien publique un producto declara que la información corresponde a su oferta y que tiene derecho a utilizar el material adjunto. No se deben publicar imágenes de terceros, afirmaciones engañosas ni datos personales de otras personas sin autorización.',
          'En este prototipo la publicación de productos es demostrativa: no existe un sistema completo de revisión, moderación ni verificación de titularidad.'
        ]],
        ['Cómo reportar una posible infracción', [
          'Envía a atención al cliente la dirección de la página o una descripción del contenido, identifica la obra y explica por qué consideras que se vulneran tus derechos. Incluye un medio de contacto y evidencia razonable de titularidad o autorización.',
          'No incluyas documentos de identidad completos ni información privada que no sea necesaria. AgroConecta podrá solicitar información adicional por un canal apropiado antes de tomar medidas.'
        ]],
        ['Medidas', [
          'Una vez que exista un servicio publicado, los reportes podrán revisarse para corregir, limitar o retirar el material cuestionado cuando corresponda. La recepción de un reporte no significa por sí sola que la infracción esté comprobada.'
        ]]
      ],
      callout: 'Los nombres y marcas de terceros mencionados en el sitio se utilizan solo con fines descriptivos; no implican patrocinio, asociación ni autorización.'
    },
    envios: {
      title: 'Información de envío',
      intro: 'La logística de productos agrícolas debe acordarse con claridad entre comprador, productor y transportista.',
      sections: [
        ['Coordinación de entrega', [
          'Antes de cerrar una compra, acuerda el lugar de recojo y destino, fecha y rango horario, cantidad, forma de carga y descarga, persona que recibirá el producto y datos de contacto para la coordinación.',
          'Define expresamente quién contrata y paga el transporte, qué ocurre ante demoras y cómo se manejarán cambios de ruta o de disponibilidad.'
        ]],
        ['Costo y cuidado de la carga', [
          'El costo depende de la distancia, volumen, peso, tipo de vehículo, acceso al punto de entrega y requisitos de conservación. Solicita el monto total y confirma si incluye carga, descarga u otros conceptos antes de aceptar.',
          'Para productos perecibles, acuerda el embalaje, ventilación, protección frente al clima y, si aplica, la necesidad de refrigeración. La plataforma no determina la aptitud de un vehículo para una carga específica.'
        ]],
        ['Seguimiento y recepción', [
          'Comparte el contacto del transportista y confirma la entrega con la contraparte. Al recibir, revisa la cantidad y el estado general de la carga y comunica cualquier diferencia cuanto antes.',
          'No publiques en espacios abiertos tu domicilio exacto, rutas futuras ni información que pueda comprometer la seguridad de personas o mercancías.'
        ]],
        ['Alcance del prototipo', [
          'El comprador o agricultor puede publicar una solicitud de transporte; un transportista registrado puede aceptarla y conversar con las partes cuando la solicitud está vinculada a un pedido. La plataforma no verifica documentos, rastrea vehículos, procesa pagos ni garantiza fechas de entrega. Los archivos de licencia del registro no se transmiten.'
        ]]
      ],
      callout: 'Una solicitud o perfil en la web no constituye una reserva de transporte. La entrega solo queda acordada cuando las partes confirman directamente sus condiciones.'
    },
    actividad: {
      title: 'Reportar actividad sospechosa',
      intro: 'Ayúdanos a identificar intentos de fraude, suplantación, enlaces maliciosos o uso indebido de la plataforma.',
      sections: [
        ['Si crees que tu cuenta está en riesgo', [
          'No compartas tu contraseña, códigos de verificación, datos de tarjeta ni enlaces de recuperación. Evita abrir archivos o enlaces inesperados y cambia las contraseñas reutilizadas en otros servicios.',
          'Si ya compartiste información financiera, contacta inmediatamente a tu banco o proveedor de pago por sus canales oficiales. Si hay peligro inmediato para una persona, comunícate con las autoridades locales.'
        ]],
        ['Qué información ayuda', [
          'Describe qué ocurrió, cuándo, por qué canal y qué perfil o publicación está involucrado. Conserva capturas de pantalla, mensajes y comprobantes originales.',
          'Oculta números completos de documentos, datos bancarios, contraseñas y códigos de acceso. Nunca publiques evidencias con información personal en redes o en el catálogo.'
        ]],
        ['Qué hará AgroConecta', [
          'El reporte se prepara como un borrador de correo que tú revisas y envías desde tu aplicación de correo. Esta web no transmite automáticamente el reporte ni cuenta con una consola de investigación o bloqueo de cuentas.',
          'No te pediremos tu contraseña para investigar un incidente. Verifica cualquier contacto que afirme actuar en nombre de AgroConecta usando los medios publicados en la web.'
        ]]
      ],
      reportForm: true,
      callout: 'El formulario no envía datos por sí solo: prepara un correo para que puedas revisarlo. No incluyas contraseñas, códigos, documentos completos ni información financiera.'
    },
    proteccion: {
      title: 'Protección de compras de AgroConecta',
      intro: 'Buenas prácticas para reducir riesgos al contactar productores y coordinar una compra.',
      sections: [
        ['Antes de acordar una compra', [
          'Confirma la identidad y los medios de contacto de la contraparte. Solicita información suficiente sobre origen, variedad, disponibilidad, presentación y condición del producto.',
          'Deja por escrito cantidad, precio, moneda, fecha, punto de entrega, transporte, método de pago y procedimiento para reportar diferencias. Conserva los mensajes y comprobantes.'
        ]],
        ['Pagos con precaución', [
          'Verifica el nombre del destinatario y los datos de pago por un canal confiable antes de transferir. Desconfía de solicitudes urgentes, cambios repentinos de cuenta, pagos a terceros no acordados o promesas de entrega garantizada sin evidencia.',
          'La web no recibe, custodia, procesa ni devuelve pagos; no existe un sistema de depósito en garantía ni una cobertura financiera automática en esta versión.'
        ]],
        ['Si algo sale mal', [
          'Contacta a la contraparte por los medios previamente confirmados, reúne la evidencia y comunica el incidente a atención al cliente. Para transacciones bancarias sospechosas, contacta además a tu entidad financiera.',
          'El equipo puede orientar la comunicación, pero el prototipo no verifica exhaustivamente a las personas, no arbitra disputas ni asegura la recuperación de dinero.'
        ]],
        ['Compromiso y límites', [
          'La protección más efectiva es la información clara y la verificación independiente antes de asumir compromisos. Utiliza canales de pago reconocidos y evita enviar datos personales que no sean necesarios.'
        ]]
      ],
      callout: '“Protección de compras” describe recomendaciones de seguridad, no una garantía de reembolso, un seguro ni una cobertura comercial ofrecida por la plataforma.'
    },
    datos: {
      title: 'Información de privacidad',
      intro: 'Resumen de los datos tratados por AgroConecta en la instalación local o desplegada.',
      sections: [
        ['Qué datos se solicitan', [
          'Los formularios pueden solicitar nombre, correo, teléfono, DNI o RUC, ubicación y datos relacionados con el rol elegido. El registro de transportista incluye características del vehículo, licencia, rutas y los nombres de archivos seleccionados.',
          'El formulario agrícola solicita información personal, ubicación declarada, cultivos y datos de actividad agrícola. La geolocalización GPS es opcional: solo se solicita permiso al pulsar “Guardar ubicación actual”.'
        ]],
        ['Dónde se guardan', [
          'El servidor guarda en SQLite los datos de cuenta y el perfil elegido (comprador, agricultor o transportista). En la versión local se usa el archivo configurado en la computadora; al desplegar en Render, las cuentas y operaciones se guardan en la base Turso configurada para el servicio. También conserva publicaciones, fotografías optimizadas de cosechas, solicitudes de compra, ofertas de transporte, mensajes de chats y tickets de soporte.',
          'La contraseña se deriva en el servidor con PBKDF2-SHA-256 y una sal aleatoria; la contraseña original no se conserva. La sesión usa una cookie HttpOnly. En producción, el sitio debe funcionar bajo HTTPS y COOKIE_SECURE debe estar activado.'
        ]],
        ['Integraciones y archivos', [
          'Si autorizas el GPS, el servidor conserva una ubicación aproximada (redondeada a cerca de 100 metros) y la precisión informada por el dispositivo; no se publica como parte del catálogo. El mapa usa teselas de OpenStreetMap, cuyo proveedor recibe las solicitudes necesarias para mostrar el área elegida.',
          'Las fotos de cosechas se optimizan en el navegador y se guardan como parte de la publicación en SQLite/Turso. Las imágenes de licencia y constancias agrícolas no se cargan. No publiques fotografías con datos personales o de otras personas sin autorización.'
        ]],
        ['Control y eliminación', [
          'Puedes cerrar la sesión desde “Mi cuenta”; cerrar sesión no elimina el registro de la base de datos. La eliminación o rectificación de datos debe solicitarse al administrador que opera el servidor, quien debe verificar la identidad y aplicar el procedimiento correspondiente.',
          'La recuperación por correo requiere SMTP; la recuperación por WhatsApp requiere Meta WhatsApp Cloud API y una plantilla aprobada. Los códigos son temporales, se guardan como hash y solo se permiten cinco intentos de verificación. Las consultas y respuestas de soporte quedan en una bandeja protegida por una clave administrativa.'
        ]]
      ],
      callout: 'La base de datos y el servidor deben protegerse con acceso restringido, copias de seguridad y HTTPS. No adjuntes documentos de identidad ni licencias: la carga de esos documentos no está habilitada.'
    },
    terminos: {
      title: 'Términos y condiciones',
      intro: 'Condiciones generales para utilizar AgroConecta en su instalación local o desplegada.',
      sections: [
        ['1. Naturaleza del servicio', [
          'AgroConecta permite crear una cuenta única por correo, publicar cosechas, enviar solicitudes de compra, presentar ofertas de transporte y coordinar por chat. Las fichas de catálogo no publicadas por una cuenta son demostrativas y no se pueden comprar desde el carrito.',
          'La web registra solicitudes de compra y transporte, pero no procesa ni custodia pagos. Los usuarios deben acordar por separado las condiciones comerciales, los pagos y la entrega.'
        ]],
        ['2. Uso responsable', [
          'El usuario se compromete a proporcionar datos veraces en los formularios, utilizar únicamente información y materiales que tenga derecho a compartir, y no realizar fraude, suplantación, acoso, extracción automatizada de datos ni acciones que afecten la seguridad o disponibilidad del sitio.',
          'No publiques información sensible de terceros ni utilices el catálogo para ofrecer bienes o servicios ilícitos.'
        ]],
        ['3. Cuentas y acceso', [
          'Cada correo solo puede registrar una cuenta y un rol. Las credenciales se derivan en el servidor; se debe usar una contraseña exclusiva y cerrar la sesión al compartir un dispositivo.',
          'La recuperación por correo requiere SMTP; la recuperación por WhatsApp requiere Meta WhatsApp Cloud API y una plantilla aprobada. La aplicación no verifica la identidad de personas, licencias, vehículos ni asociaciones.'
        ]],
        ['4. Acuerdos entre usuarios', [
          'Los usuarios deben confirmar directamente la disponibilidad, calidad, precio, pago, transporte, entrega y cualquier condición comercial. Las solicitudes de transporte vinculadas a pedidos permiten un chat grupal; la plataforma no es parte de los acuerdos ni garantiza la conducta, identidad, solvencia o cumplimiento de los usuarios.',
          'La coordinación de una disputa puede ser orientativa y no reemplaza los mecanismos legales o de consumo que correspondan.'
        ]],
        ['5. Datos personales y archivos', [
          'Consulta la información de privacidad para conocer los datos de cuenta, perfiles, productos, pedidos, conversaciones y tickets almacenados por el servidor. En esta versión no se suben archivos de licencia o constancias.',
          'Antes de habilitar un servicio comercial, el responsable del proyecto debe publicar una política de privacidad completa, definir finalidad, conservación, medidas de seguridad, derechos de los titulares y canales formales de atención.'
        ]],
        ['6. Disponibilidad y cambios', [
          'La instalación local o el servicio de Render puede interrumpirse o contener errores. La disponibilidad, la entrega de códigos de recuperación y la respuesta a tickets dependen de la configuración y administración del servicio.',
          'La versión definitiva de estos términos debe revisarse legalmente y actualizarse antes de poner en marcha transacciones reales.'
        ]],
        ['7. Contacto', [
          'Las consultas sobre estos términos pueden dirigirse a contacto@agroconecta.pe. Evita incluir contraseñas, códigos de acceso o documentos completos en el mensaje.'
        ]]
      ],
      callout: 'Texto preliminar para un prototipo académico. No constituye asesoría legal ni reemplaza la revisión jurídica, de protección al consumidor y de datos personales previa a un lanzamiento.'
    }
  };

  const navItems = [
    ['devoluciones', 'Devolución y reembolso'],
    ['propiedad', 'Propiedad intelectual'],
    ['envios', 'Información de envío'],
    ['actividad', 'Reportar actividad sospechosa'],
    ['proteccion', 'Protección de compras'],
    ['datos', 'Información de privacidad'],
    ['terminos', 'Términos y condiciones']
  ];
  const selectedKey = new URLSearchParams(window.location.search).get('tema');
  const selected = Object.prototype.hasOwnProperty.call(pages, selectedKey) ? selectedKey : 'terminos';
  const page = pages[selected];
  const title = document.getElementById('policyTitle');
  const intro = document.getElementById('policyIntro');
  const content = document.getElementById('policyContent');
  const navigation = document.getElementById('policyNavigation');

  document.title = `${page.title} | AgroConecta`;
  title.textContent = page.title;
  intro.textContent = page.intro;
  navigation.replaceChildren();
  navItems.forEach(([key, label]) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = `atencion.html?tema=${encodeURIComponent(key)}`;
    link.textContent = label;
    if (key === selected) link.setAttribute('aria-current', 'page');
    item.appendChild(link);
    navigation.appendChild(item);
  });

  content.replaceChildren();
  const updated = document.createElement('p');
  updated.className = 'policy-updated';
  updated.textContent = 'Información del prototipo · Actualizada el 13 de noviembre de 2026';
  content.appendChild(updated);
  page.sections.forEach(([heading, paragraphs]) => {
    const sectionTitle = document.createElement('h2');
    sectionTitle.textContent = heading;
    content.appendChild(sectionTitle);
    paragraphs.forEach(text => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      content.appendChild(paragraph);
    });
  });

  if (page.reportForm) {
    const form = document.createElement('form');
    form.className = 'report-form';
    form.id = 'reportActivityForm';
    form.innerHTML = `
      <label>Tipo de situación
        <select name="tipo" required>
          <option value="">Selecciona una opción</option>
          <option>Posible fraude o solicitud de pago sospechosa</option>
          <option>Suplantación de identidad</option>
          <option>Enlace o mensaje sospechoso</option>
          <option>Contenido o perfil abusivo</option>
          <option>Otro incidente</option>
        </select>
      </label>
      <label>Descripción del incidente
        <textarea name="descripcion" maxlength="1800" required placeholder="Indica qué ocurrió, cuándo y qué perfil o publicación está involucrado. No incluyas contraseñas, códigos ni documentos completos."></textarea>
      </label>
      <label>Correo de contacto (opcional)
        <input name="correo" type="email" autocomplete="email" />
      </label>
      <button class="btn btn-primary" type="submit">Preparar reporte por correo</button>
      <div class="report-feedback" id="reportFeedback" role="status" aria-live="polite"></div>
    `;
    content.appendChild(form);
    form.addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(form);
      const subject = 'Reporte de actividad sospechosa - AgroConecta';
      const body = [
        `Tipo: ${formData.get('tipo')}`,
        `Descripción: ${formData.get('descripcion')}`,
        `Correo de contacto: ${formData.get('correo') || 'No indicado'}`,
        '',
        'Revisa y elimina cualquier dato sensible antes de enviar este correo.'
      ].join('\n');
      const link = document.createElement('a');
      link.href = `mailto:contacto@agroconecta.pe?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      link.className = 'btn btn-secondary';
      link.textContent = 'Abrir borrador de correo';
      const feedback = document.getElementById('reportFeedback');
      feedback.replaceChildren();
      feedback.append('El reporte no se ha enviado. Revisa el borrador y envíalo desde tu aplicación de correo: ', link);
    });
  }

  const callout = document.createElement('p');
  callout.className = 'policy-callout';
  callout.textContent = page.callout;
  content.appendChild(callout);
});
