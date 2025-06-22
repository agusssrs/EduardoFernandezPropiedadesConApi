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
  const titulo = `${tipos[prop.tipo] || 'propiedad'} en ${operaciones[prop.operacion] || ''}`;
  const direccion = `${prop.calle || ''} ${prop.altura || ''}`;
  const precio = (prop.moneda === 1 ? '$' : 'U$D') + (prop.valor || 'Consultar');

  document.getElementById('titulo').innerText = titulo;
  document.getElementById('direccion').innerText = direccion;
  document.getElementById('precio').innerText = precio;
  document.getElementById('descripcion').innerText = prop.descripcion || 'Sin descripción';

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
