// Base de Datos Geográfica de Departamentos, Provincias y Distritos del Perú
const UBIGEO_PERU = {
    "Cusco": {
        "Paucartambo": ["Paucartambo", "Caicay", "Challabamba", "Colquepata", "Huancarani", "Kosñipata"],
        "Urubamba": ["Urubamba", "Chinchero", "Huayllabamba", "Machupicchu", "Maras", "Ollantaytambo", "Yucay"],
        "Cusco": ["Cusco", "Ccorca", "Poroy", "San Jerónimo", "San Sebastián", "Santiago", "Saylla", "Wanchaq"],
        "Canchis": ["Sicuani", "Checacupe", "Combapata", "Marangani", "Pitumarca", "San Pablo", "San Pedro", "Tinta"],
        "Anta": ["Anta", "Ancahuasi", "Cacharimayo", "Chinchaypujio", "Huarocondo", "Limatambo", "Zurite"],
        "Calca": ["Calca", "Coya", "Lamay", "Lares", "Pisac", "San Salvador", "Taray", "Yanatile"],
        "La Convención": ["Quillabamba", "Echarate", "Huayopata", "Maranura", "Santa Teresa", "Vilcabamba", "Pichari", "Kimbiri"],
        "Espinar": ["Yauri", "Condoroma", "Coporaque", "Ocoruro", "Pallpata", "Pichigua", "Suyckutambo"],
        "Chumbivilcas": ["Santo Tomás", "Capacmarca", "Chamaca", "Livitaca", "Llusco", "Quiñota", "Velasille"]
    },
    "Lima": {
        "Lima": ["Cercado de Lima", "Miraflores", "San Isidro", "Ate", "Lurigancho", "Lurín", "San Martín de Porres", "Comas", "Surco"],
        "Cañete": ["San Vicente de Cañete", "Mala", "Asia", "Lunahuaná", "Imperial", "Chilca"],
        "Huaral": ["Huaral", "Chancay", "Aucallama"],
        "Huaura": ["Huacho", "Hualmay", "Sayán", "Végueta"]
    },
    "Arequipa": {
        "Arequipa": ["Arequipa", "Cayma", "Cerro Colorado", "Yanahuara", "Misty", "Sachaca", "Socabaya"],
        "Caylloma": ["Chivay", "Maca", "Cabanaconde", "Majes"],
        "Camaná": ["Camaná", "José María Quimper", "Samuel Pastor"]
    },
    "Puno": {
        "Puno": ["Puno", "Acora", "Atuncolla", "Chucuito", "Platería"],
        "San Román": ["Juliaca", "Cabana", "Cabanillas", "Caracoto"],
        "Azángaro": ["Azángaro", "Asillo", "Chupa"],
        "El Collao": ["Ilave", "Capazo", "Pilcuyo"]
    },
    "Junín": {
        "Huancayo": ["Huancayo", "El Tambo", "Chilca", "Sapallanga", "Huancán"],
        "Chanchamayo": ["La Merced", "Pichanaqui", "San Ramón", "Perené"],
        "Tarma": ["Tarma", "Acobamba", "Palca"]
    },
    "La Libertad": {
        "Trujillo": ["Trujillo", "Víctor Larco", "Huanchaco", "Moche", "Laredo"],
        "Sánchez Carrión": ["Huamachuco", "Curgos", "Marcabal"]
    },
    "Piura": {
        "Piura": ["Piura", "Castilla", "Catacaos", "Tambogrande", "26 de Octubre"],
        "Sullana": ["Sullana", "Bellavista", "Marcavelica", "Querecotillo"]
    },
    "Áncash": {
        "Huaraz": ["Huaraz", "Independencia", "Jangas"],
        "Santa": ["Chimbote", "Nuevo Chimbote", "Coishco", "Nepeña"]
    },
    "Ica": {
        "Ica": ["Ica", "Parcona", "Subtanjalla", "La Tinguiña", "Salas"],
        "Chincha": ["Chincha Alta", "Pueblo Nuevo", "Grocio Prado"],
        "Pisco": ["Pisco", "Paracas", "San Andrés"]
    },
    "Cajamarca": {
        "Cajamarca": ["Cajamarca", "Baños del Inca", "Llacanora"],
        "Jaén": ["Jaén", "Bellavista", "Colasay"]
    },
    "Ayacucho": {
        "Huamanga": ["Ayacucho", "Carmen Alto", "San Juan Bautista"],
        "Huanta": ["Huanta", "Luricocha", "Sivia"]
    },
    "Huánuco": {
        "Huánuco": ["Huánuco", "Amarilis", "Pillco Marca"],
        "Leoncio Prado": ["Tingo María", "Rupa-Rupa", "Luyando"]
    },
    "Lambayeque": {
        "Chiclayo": ["Chiclayo", "La Victoria", "José Leonardo Ortiz", "Pimentel"],
        "Ferreñafe": ["Ferreñafe", "Pueblo Nuevo"]
    },
    "San Martín": {
        "Moyobamba": ["Moyobamba", "Calzada", "Soritor"],
        "San Martín": ["Tarapoto", "Morales", "Banda de Shilcayo"]
    },
    "Loreto": {
        "Maynas": ["Iquitos", "Punchana", "Belén", "San Juan Bautista"]
    },
    "Ucayali": {
        "Coronel Portillo": ["Pucallpa", "Yarinacocha", "Manantay"]
    },
    "Tacna": {
        "Tacna": ["Tacna", "Alto de la Alianza", "Ciudad Nueva", "Pocollay"]
    },
    "Moquegua": {
        "Mariscal Nieto": ["Moquegua", "Samegua", "Torata"],
        "Ilo": ["Ilo", "Pacocha"]
    },
    "Apurímac": {
        "Abancay": ["Abancay", "Tamburco"],
        "Andahuaylas": ["Andahuaylas", "Talavera", "San Jerónimo"]
    },
    "Huancavelica": {
        "Huancavelica": ["Huancavelica", "Ascensión"]
    },
    "Pasco": {
        "Pasco": ["Chaupimarca", "Yanacancha"]
    },
    "Tumbes": {
        "Tumbes": ["Tumbes", "Corrales", "San Jacinto"]
    },
    "Madre de Dios": {
        "Tambopata": ["Puerto Maldonado", "Inambari", "Laberinto"]
    },
    "Amazonas": {
        "Chachapoyas": ["Chachapoyas", "Huancas"],
        "Bagua": ["Bagua", "Aramango"]
    },
    "Callao": {
        "Callao": ["Callao", "Bellavista", "Carmen de la Legua", "La Perla", "La Punta", "Ventanilla", "Mi Perú"]
    }
};

// Base de Datos Completa de Cultivos Peruanos por Categoría
const CULTIVOS_BD = {
    verduras: [
        "Tomate", "Cebolla Roja", "Cebolla Blanca", "Zanahoria", "Lechuga Orgánica", "Espinaca", 
        "Vainita", "Ajo", "Pimiento", "Zapallo Carga", "Zapallo Macre", "Alcachofa", "Espárrago", 
        "Brócoli", "Coliflor", "Nabo", "Rábano", "Apio", "Kion / Jengibre", "Porro", "Caigua", 
        "Pepinillo", "Beterraga", "Rocoto", "Ají Amarillo", "Ají Limo", "Ají Panca"
    ],
    frutas: [
        "Palta Hass", "Palta Fuerte", "Mango Haden", "Mango Kent", "Plátano de Seda", "Plátano Bellaco", 
        "Plátano Bizcocho", "Papaya", "Naranja Huando", "Naranja de Jugo", "Mandarina Satsuma", 
        "Maracuyá", "Fresa", "Chirimoya", "Lúcuma", "Camu Camu", "Arándano", "Granadilla", "Piña Golden", 
        "Piña Hawaiana", "Uva Quebranta", "Limón Sutil", "Manzana Delicia", "Manzana Ana", "Pera", 
        "Durazno", "Melón", "Sandía", "Pitahaya Roja", "Pitahaya Amarilla", "Aguaymanto", "Tumbo", "Cacao", "Café"
    ],
    tuberculos: [
        "Papa Nativa Huayro", "Papa Nativa Tumbay", "Papa Amarilla", "Papa Canchán", "Papa Peruanita", 
        "Papa Blanca", "Camote Morado", "Camote Amarillo", "Olluco Rojo", "Olluco Amarillo", 
        "Oca", "Mashua", "Yuca", "Maca", "Yacón", "Uncucha", "Arracacha"
    ],
    granos: [
        "Maíz Blanco Gigante", "Maíz Morado", "Maíz Amarillo Duro", "Quinua Blanca", "Quinua Roja", 
        "Quinua Negra", "Kiwicha", "Cañihua", "Trigo", "Cebada", "Arroz", "Avena", "Tarwi / Chocho", 
        "Habas Secas", "Frejol Canario", "Frejol Panamito", "Garbanzo", "Lenteja"
    ]
};

let ubicacionGPSGuardada = null;
let farmerMap = null;
let farmerMapMarker = null;

// 1. Cargar Departamentos
document.addEventListener('DOMContentLoaded', () => {
    const depSelect = document.getElementById('departamento');
    if (!depSelect) return;
    Object.keys(UBIGEO_PERU).forEach(dep => {
        const opt = document.createElement('option');
        opt.value = dep;
        opt.innerText = dep;
        depSelect.appendChild(opt);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const embedded = new URLSearchParams(window.location.search).get('embedded') === '1';
    if (embedded) document.body.classList.add('embedded-page');
    const backLink = document.querySelector('.back-to-site');
    if (embedded && backLink) backLink.hidden = true;

    function reportarAltura() {
        if (!embedded || window.parent === window) return;
        const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        const targetOrigin = window.location.origin === 'null' ? '*' : window.location.origin;
        window.parent.postMessage({ type: 'agroconecta:resize', height }, targetOrigin);
    }

    window.reportarAlturaAgricultor = reportarAltura;
    window.addEventListener('resize', reportarAltura);
    if (window.ResizeObserver) new ResizeObserver(reportarAltura).observe(document.body);
    window.setTimeout(reportarAltura, 0);
});

// 2. Toggle Visibilidad de Contraseña
function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        btn.innerText = 'Ocultar';
        btn.setAttribute('aria-label', 'Ocultar contraseña');
    } else {
        input.type = 'password';
        btn.innerText = 'Mostrar';
        btn.setAttribute('aria-label', 'Mostrar contraseña');
    }
}

// 3. Navegación entre Pasos
function siguientePaso(paso) {
    if (paso > 1 && !validarCamposPaso(paso - 1)) return;

    document.querySelectorAll('.seccion-paso').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.step-item').forEach(st => st.classList.remove('active'));

    document.getElementById(`paso-${paso}`).classList.add('active');
    
    for (let i = 1; i <= paso; i++) {
        document.getElementById(`step-${i}`).classList.add('active');
    }
    window.setTimeout(() => window.reportarAlturaAgricultor?.(), 0);
}

// 4. Validaciones
function validarCamposPaso(pasoActual) {
    const contenedor = document.getElementById(`paso-${pasoActual}`);
    const inputs = contenedor.querySelectorAll('[required]');

    for (let input of inputs) {
        const missingValue = input.type === 'checkbox' ? !input.checked : !input.value.trim();
        if (missingValue) {
            Swal.fire({
                title: 'Campo Requerido',
                text: 'Por favor completa este campo antes de continuar.',
                icon: 'warning',
                confirmButtonColor: '#0f3d2e'
            });
            input.focus();
            return false;
        }
    }

    if (pasoActual === 1) {
        const pass = document.getElementById('password').value;
        const confirm = document.getElementById('confirm_password').value;

        if (pass.length < 8) {
            Swal.fire({ title: 'Contraseña corta', text: 'La contraseña debe tener al menos 8 caracteres.', icon: 'error', confirmButtonColor: '#0f3d2e' });
            return false;
        }

        if (pass !== confirm) {
            Swal.fire({ title: 'Error de Contraseña', text: 'Las contraseñas escritas no coinciden.', icon: 'error', confirmButtonColor: '#0f3d2e' });
            return false;
        }
    }

    return true;
}

// 5. Carga de Ubigeo
function cargarProvincias() {
    const dep = document.getElementById('departamento').value;
    const provSelect = document.getElementById('provincia');
    const distSelect = document.getElementById('distrito');

    provSelect.innerHTML = '<option value="">Selecciona Provincia</option>';
    distSelect.innerHTML = '<option value="">Selecciona Distrito</option>';

    if (dep && UBIGEO_PERU[dep]) {
        Object.keys(UBIGEO_PERU[dep]).forEach(prov => {
            const opt = document.createElement('option');
            opt.value = prov;
            opt.innerText = prov;
            provSelect.appendChild(opt);
        });
    }
}

function cargarDistritos() {
    const dep = document.getElementById('departamento').value;
    const prov = document.getElementById('provincia').value;
    const distSelect = document.getElementById('distrito');

    distSelect.innerHTML = '<option value="">Selecciona Distrito</option>';

    if (dep && prov && UBIGEO_PERU[dep][prov]) {
        UBIGEO_PERU[dep][prov].forEach(dist => {
            const opt = document.createElement('option');
            opt.value = dist;
            opt.innerText = dist;
            distSelect.appendChild(opt);
        });
    }
}

function actualizarReferenciaMapa() {
    const locationStatus = document.getElementById('farmerLocationStatus');
    if (locationStatus && !ubicacionGPSGuardada) {
        locationStatus.textContent = 'La ubicación es opcional; aún no se ha guardado.';
    }
}

function obtenerUbicacionGPS() {
    const status = document.getElementById('farmerLocationStatus');
    if (!navigator.geolocation) {
        status.textContent = 'Este navegador no permite obtener la ubicación. Puedes continuar sin guardarla.';
        return;
    }
    status.textContent = 'Solicitando permiso de ubicación…';
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude, accuracy } = position.coords;
        const rounded = [Number(latitude.toFixed(3)), Number(longitude.toFixed(3))];
        ubicacionGPSGuardada = {
            latitude,
            longitude,
            precision_m: Math.round(accuracy || 0)
        };
        const mapElement = document.getElementById('farmerMap');
        mapElement.hidden = false;
        if (!window.L) {
            ubicacionGPSGuardada = null;
            status.textContent = 'No se pudo cargar el mapa. Revisa tu conexión e inténtalo otra vez.';
            return;
        }
        if (!farmerMap) {
            farmerMap = L.map(mapElement).setView(rounded, 14);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; OpenStreetMap'
            }).addTo(farmerMap);
            farmerMapMarker = L.marker(rounded).addTo(farmerMap);
        } else {
            farmerMap.setView(rounded, 14);
            farmerMapMarker.setLatLng(rounded);
        }
        window.setTimeout(() => farmerMap.invalidateSize(), 100);
        status.textContent = `Ubicación guardada de forma aproximada (precisión del dispositivo: ${Math.round(accuracy || 0)} m).`;
        window.setTimeout(() => window.reportarAlturaAgricultor?.(), 150);
    }, error => {
        const message = error.code === 1
            ? 'No se autorizó el acceso a la ubicación. Puedes habilitarlo en el navegador o continuar sin guardarla.'
            : error.code === 3
                ? 'La ubicación tardó demasiado. Inténtalo nuevamente o continúa sin guardarla.'
                : 'No se pudo obtener la ubicación. Verifica los permisos del navegador e inténtalo otra vez.';
        status.textContent = message;
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
}

// 7. Renderizado Dinámico Masivo de Cultivos
function renderizarCultivos() {
    const seleccionados = Array.from(document.querySelectorAll('.categoria-card input:checked')).map(cb => cb.value);
    const contenedor = document.getElementById('contenedor-cultivos');

    contenedor.innerHTML = '';

    if (seleccionados.length === 0) return;

    seleccionados.forEach(cat => {
        if (CULTIVOS_BD[cat]) {
            const titulo = document.createElement('label');
            titulo.style.marginTop = '10px';
            titulo.innerHTML = `<strong>Cultivos de ${cat.toUpperCase()}:</strong>`;
            contenedor.appendChild(titulo);

            const grid = document.createElement('div');
            grid.className = 'checkbox-row';
            grid.style.marginBottom = '14px';

            CULTIVOS_BD[cat].forEach(prod => {
                grid.innerHTML += `<label><input type="checkbox" name="cultivo_item" value="${prod}"> ${prod}</label>`;
            });

            contenedor.appendChild(grid);
        }
    });
}

function toggleOtroCultivo() {
    document.getElementById('box-otro-cultivo').classList.toggle('oculto');
}

function actualizarNombreArchivo(input) {
    if (input.files && input.files[0]) {
        document.getElementById('upload-text').innerText = `Archivo: ${input.files[0].name}`;
    }
}

// 8. Registro de la cuenta y del perfil agrícola en el servidor.
async function procesarRegistro(event) {
    event.preventDefault();

    if (!validarCamposPaso(3)) return;

    const nombres = document.getElementById('nombres').value.trim();
    const dni = document.getElementById('dni').value.trim();
    const ruc = document.getElementById('ruc').value.trim();
    const celular = document.getElementById('celular').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const password = document.getElementById('password').value;
    const departamento = document.getElementById('departamento').value;
    const provincia = document.getElementById('provincia').value;
    const distrito = document.getElementById('distrito').value;
    const comunidad = document.getElementById('comunidad').value.trim();
    const ubicacionGeneral = [comunidad, distrito, provincia, departamento].filter(Boolean).join(', ');
    const cultivos = Array.from(document.querySelectorAll('input[name="cultivo_item"]:checked')).map(input => {
        let categoriaDetectada = 'Otros';
        for (const [cat, lista] of Object.entries(CULTIVOS_BD)) {
            if (lista.includes(input.value)) {
                categoriaDetectada = cat;
                break;
            }
        }
        return { nombre: input.value, categoria: categoriaDetectada };
    });

    const otroCultivo = document.getElementById('otro_cultivo_input') ? document.getElementById('otro_cultivo_input').value.trim() : '';
    if (otroCultivo) {
        cultivos.push({ nombre: otroCultivo, categoria: 'Otros' });
    }
    const metodosCobro = Array.from(document.querySelectorAll('input[name="cobro"]:checked'))
        .map(input => input.value).join(', ');
    const asociacion = document.getElementById('asociacion') ? document.getElementById('asociacion').value.trim() : '';
    const datosUsuario = {
        rol: 'Productor',
        nombre: nombres,
        dni_ruc: ruc || dni,
        telefono: celular,
        email: correo,
        password: password,
        ubicacion_general: ubicacionGeneral,
        departamento: departamento,
        provincia: provincia,
        distrito: distrito,
        comunidad: comunidad,
        metodos_cobro: metodosCobro,
        asociacion: asociacion,
        carnet_url: '',
        cultivos: cultivos
    };
    if (ubicacionGPSGuardada) datosUsuario.ubicacion = ubicacionGPSGuardada;

    const submitButton = document.querySelector('#form-agricultor button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    try {
        const respuesta = await fetch('/api/auth/register', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosUsuario)
        });
        const datos = await respuesta.json();
        if (!respuesta.ok) {
            Swal.fire({
                title: respuesta.status === 409 ? 'Correo ya registrado' : 'No se pudo completar el registro',
                text: datos.error || 'Revisa tus datos e inténtalo nuevamente.',
                icon: 'error',
                confirmButtonColor: '#075e63'
            });
            return;
        }
        await Swal.fire({
            title: 'Cuenta creada',
            text: `Bienvenido, ${nombres}. Tu cuenta de agricultor ya está lista y tu sesión inició.`,
            icon: 'success',
            confirmButtonColor: '#075e63'
        });
        const targetOrigin = window.location.origin === 'null' ? '*' : window.location.origin;
        if (window.parent !== window) {
            window.parent.postMessage({ type: 'agroconecta:registered', user: datos.user }, targetOrigin);
        }
    } catch (error) {
        console.error('Error al registrar al agricultor:', error);
        await Swal.fire({
            title: 'No se pudo conectar',
            text: 'Verifica que AgroConecta esté abierto desde http://localhost:3000 y que el servidor esté encendido.',
            icon: 'error',
            confirmButtonColor: '#075e63'
        });
    } finally {
        if (submitButton) submitButton.disabled = false;
    }

    document.getElementById('saveFarmerLocation')?.addEventListener('click', obtenerUbicacionGPS);

    window.setTimeout(() => window.reportarAlturaAgricultor?.(), 0);
}