const botonAlquiler = document.getElementById('botonAlquiler');
const botonVenta = document.getElementById('botonVenta');
const botonQuitarFiltros = document.getElementById('botonQuitarFiltros');
const propertiesCards = document.querySelector('.properties');
let swiper;
let properties = [];

// Diccionarios bien definidos y rigurosos
const tipos = {
    0: 'casa',
    1: 'chalet',
    2: 'duplex',
    3: 'dpto tipo casa',
    4: 'departamento',
    8: 'galpon',
    11: 'local',
    12: 'oficina',
    14: 'lote',
    16: 'casa 2 familias',
    17: 'casa PH',
    18: 'chalet PH',
    20: 'galpon con vivienda',
    21: 'local con vivienda',
    22: 'cochera',
    23: 'salon',
    24: 'inmueble comercial',
    25: 'semipiso',
    27: 'triplex',
    28: 'vivienda en blocks',
    29: 'casa con dpto',
    30: 'fraccion',
    32: 'monoambiente',
    40: 'cabaña'
};

const operaciones = {
    0: 'venta',
    1: 'venta condicionada',
    2: 'alquiler'
};

const fetchProperties = async () => {
    try {
        const response = await fetch('https://server-api-argencasas.vercel.app/props');
        const data = await response.json();
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
        const operacionNombre = operaciones[property.operacion] || 'operación';
        const titulo = `${tipoNombre} en ${operacionNombre}`;


        const direccion = `${property.calle || 'Dirección'} ${property.altura || ''}`;
        const precio = (property.moneda === 1 ? '$' : 'U$D') + (property.valor || 'Consultar');
        const imagen = property.imagenes?.[0] || 'https://via.placeholder.com/300x200?text=Sin+imagen';
        const descripcion = property.descripcion || 'Sin descripción';
        const link = `detalle.html?id=${property.nro}`;

        const div = document.createElement('div');
        console.log({
            tipo: property.tipo,
            operacion: property.operacion,
            tipoNombre,
            operacionNombre,
            titulo
        });

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
        loop: false,
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
botonVenta.addEventListener('click', () => displayProperties('venta'&&'venta condicionada'));
botonQuitarFiltros.addEventListener('click', () => displayProperties('todos'));

fetchProperties();

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
