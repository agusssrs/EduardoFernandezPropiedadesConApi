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

const getPropId = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
};

const fetchPropiedad = async (id) => {
  const response = await fetch('https://api.argencasas.com/props?api_key=6b8d4ba4dfdeadbe7ffe3ba8e40cb162');
  const data = await response.json();
  return data.records.find(p => p.nro == id);
};

const renderPropiedad = (prop) => {
  const tipoNombre = tipos[prop.tipo] || 'propiedad';
  const operacionNombre = operaciones[prop.operacion] || 'operación';
  const titulo = `${tipoNombre} en ${operacionNombre}`;
  const direccion = `${prop.calle || ''} ${prop.altura || ''}`;
  const precio = (prop.moneda === 1 ? '$' : 'U$D') + (prop.valor || 'Consultar');
  const banios = (prop.banios || 0);
  const dormitorios = (prop.dormitorios || 0);

  document.getElementById('titulo').innerText = titulo;
  document.getElementById('direccion').innerText = direccion;
  document.getElementById('precio').innerText = precio;
  document.getElementById('descripcion').innerText = prop.descripcion || 'Sin descripción';
  document.getElementById('banios').innerText = 'Baños: ' + banios;
  document.getElementById('dormitorios').innerText = 'Dormitorios: ' + dormitorios;

  const imgContainer = document.getElementById('imagenes');
  const imagenes = prop.imagenes || [];

  imgContainer.innerHTML = '';

  if (imagenes.length === 0) {
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');
    slide.innerHTML = "<p>Sin imágenes disponibles</p>";
    imgContainer.appendChild(slide);
  } else {
    for (let i = 0; i < Math.min(imagenes.length, 4); i++) {
      const slide = document.createElement('div');
      slide.classList.add('swiper-slide');
      slide.innerHTML = `<img src="${imagenes[i]}" alt="Imagen ${i + 1}" class="detalle-img">`;
      imgContainer.appendChild(slide);
    }
  }

  new Swiper('.swiper-detalle', {
    loop: true,
    autoplay: {
      delay: 3000,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });
};

const main = async () => {
  const id = getPropId();
  if (!id) return;
  const propiedad = await fetchPropiedad(id);
  if (propiedad) {
    renderPropiedad(propiedad);
  } else {
    document.getElementById('detallePropiedad').innerHTML = "<p>Propiedad no encontrada.</p>";
  }
};

main();
