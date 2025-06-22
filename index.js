const botonAlquiler = document.getElementById('botonAlquiler');
const botonVenta = document.getElementById('botonVenta');
const botonQuitarFiltros = document.getElementById('botonQuitarFiltros');
const propertiesCards = document.querySelector('.properties');
let swiper;
let properties = [];

// Mapeo de tipos y operaciones
const tipos = {
    0: 'propiedad',
    1: 'local',
    2: 'terreno',
    3: 'departamento',
    4: 'casa',
    8: 'galpón',
    11: 'ph',
    17: 'semipiso',
    22: 'chalet',
    25: 'inmueble comercial'
};

const operaciones = {
    0: 'venta',
    1: 'alquiler'
};

const fetchProperties = async () => {
    try {
        const response = await fetch('https://api.argencasas.com/props?api_key=6b8d4ba4dfdeadbe7ffe3ba8e40cb162');
        const data = await response.json();
        console.log("Datos recibidos:", data);
        properties = data.records || [];
        displayProperties('todos');
    } catch (error) {
        console.error("Error al cargar propiedades desde la API:", error);
        propertiesCards.innerHTML = '<p>Error al cargar propiedades. Intente más tarde.</p>';
    }
};

const displayProperties = (tipoFiltro) => {
    propertiesCards.innerHTML = '';

    const filtradas = properties.filter(property => {
        const operacionNombre = operaciones[property.operacion] || '';
        return tipoFiltro === 'todos' || operacionNombre === tipoFiltro;
    });

    filtradas.forEach((property) => {
        const tipoNombre = tipos[property.tipo] || 'propiedad';
        const operacionNombre = operaciones[property.operacion] || '';
        const titulo = `${tipoNombre} en ${operacionNombre}`;

        const direccion = `${property.calle || 'Dirección'} ${property.altura || ''}`;
        const precio = (property.moneda === 1 ? '$' : 'U$D'|| property.moneda === 0 ? 'U$D' : '$') + (property.valor || 'Consultar');
        const imagen = property.imagenes?.[0] || 'https://via.placeholder.com/300x200?text=Sin+imagen';
        const descripcion = property.descripcion || 'Sin descripción';
        const link = `detalle.html?id=${property.nro}`; // construimos el link

        const div = document.createElement('div');
        div.innerHTML = `
            <div class="propertyCard">        
                <div class="swiper swiper-properties">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide">
                            <img src="${imagen}" alt="Foto propiedad" class='propertyImg'>
                        </div>
                    </div>
                    <div class="swiper-pagination"></div>              
                </div> 
                <a href="${link}" class='aProperty'>
                    <h2>${titulo}</h2>
                    <p>${direccion}</p>
                    <p class='propertyDescription'>${descripcion.slice(0, 150)}...</p>
                    <p>${precio}</p>
                </a>                
                <a href="${link}" class="verProp">Ver propiedad</a>
            </div>`;
        propertiesCards.appendChild(div);
    });

    initSwiper();
};

const initSwiper = () => {
    if (swiper) swiper.destroy(true, true);
    swiper = new Swiper('.swiper-properties', {
        direction: 'horizontal',
        loop: false, // desactivamos loop si hay una sola imagen
        autoplay: {
            delay: 3000,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });
};

botonAlquiler.addEventListener('click', () => displayProperties('alquiler'));
botonVenta.addEventListener('click', () => displayProperties('venta'));
botonQuitarFiltros.addEventListener('click', () => displayProperties('todos'));

// Carga inicial
fetchProperties();

// Swiper del Hero
new Swiper('.swiper-hero', {
    direction: 'horizontal',
    loop: true,
    autoplay: {
        delay: 2200,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});
