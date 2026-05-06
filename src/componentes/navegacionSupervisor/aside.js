

export const crearAside = () => {
  // Crear el aside principal
  
  const aside = document.createElement('aside');
  aside.classList.add('sidebar');
  
  // Crear el contenedor de la lista
  const divLista = document.createElement('div');
  divLista.classList.add('sidebar__lista');
  
  // Datos de los enlaces
  const enlaces = [
    { icono: 'ri-gallery-view-2',      texto: 'Inicio',           info: null,         perfil: false },
    { icono: 'ri-file-user-line',      texto: 'Planes Familiares',info: null,         perfil: false },
    { icono: 'ri-group-line',          texto: 'Voluntarios',      info: null,         perfil: false },
    { icono: 'ri-bar-chart-2-line',    texto: 'Estadisticas',     info: null,         perfil: false },
    { icono: 'ri-arrow-left-right-line',texto: 'Peticiones',      info: null,         perfil: false },
    { icono: 'ri-user-line',           texto: 'Nombre',           info: 'Supervisor', perfil: true  },
  ];
  
  // Construir y montar el sidebar
  enlaces.forEach(enlace => divLista.appendChild(crearEnlace(enlace)));
  aside.appendChild(divLista);
  return aside
  
}


// Función para crear cada enlace
function crearEnlace({ icono, texto, info, perfil }) {
  const a = document.createElement('a');
  a.href = '#';
  a.classList.add('sidebar__link');
  if (perfil) a.classList.add('sidebar__link--perfil');

  const i = document.createElement('i');
  i.classList.add(icono, 'icono__grande');
  if (perfil) i.classList.add('icono__grande--perfil');

  const divOculto = document.createElement('div');
  divOculto.classList.add('siderbar__oculto');

  const pTexto = document.createElement('p');
  pTexto.classList.add('sidebar__texto');
  pTexto.textContent = texto;
  divOculto.appendChild(pTexto);

  if (info) {
    const pInfo = document.createElement('p');
    pInfo.classList.add('sidebar__info');
    pInfo.textContent = info;
    divOculto.appendChild(pInfo);
  }

  a.appendChild(i);
  a.appendChild(divOculto);
  return a;
}