
export const crearAside = (enlaces) => {
  // Crear el aside principal
  const aside = document.createElement('aside');
  aside.classList.add('sidebar');
  
  // Crear el contenedor de la lista
  const divLista = document.createElement('div');
  divLista.classList.add('sidebar__lista');
  
  // Construir y montar el sidebar
  enlaces.forEach(enlace => divLista.appendChild(crearEnlace(enlace)));
  aside.appendChild(divLista);
  
  return aside;
}


// Función para crear cada enlace
function crearEnlace({ icono, texto, info, perfil, href }) {
  const a = document.createElement('a');
  a.href = href
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

export const crearAsideSupervisor = () => {

  const enlaces = [
    { icono: 'ri-gallery-view-2',      texto: 'Inicio',           info: null,         perfil: false, href: '#/supervisor' },
    { icono: 'ri-file-user-line',      texto: 'Planes Familiares',info: null,         perfil: false, href: '#/supervisor/plan_familiar' },
    { icono: 'ri-group-line',          texto: 'Voluntarios',      info: null,         perfil: false, href: '#/supervisor/usuarios/gestion' },
    { icono: 'ri-bar-chart-2-line',    texto: 'Estadisticas',     info: null,         perfil: false, href: '#/supervisor/estadisticas' },
    { icono: 'ri-arrow-left-right-line',texto: 'Peticiones',      info: null,         perfil: false, href: '#/supervisor/usuarios/peticiones' },
];

  return crearAside(enlaces);

}


export const marcarActivo = (nav, hash) => {
  nav.querySelectorAll('.sidebar-mobile__link').forEach(link => {
    link.classList.remove('sidebar-mobile__link--active');
    if (link.getAttribute('href') === hash) {
      link.classList.add('sidebar-mobile__link--active');
    }
  });
};


//sidebar para movile 

export const crearAsideMobile = () => {
  const enlaces = [
    { icono: 'ri-gallery-view-2',       href: '#/supervisor' },
    { icono: 'ri-file-user-line',       href: '#/supervisor/plan_familiar' },
    { icono: 'ri-group-line',           href: '#/supervisor/usuarios/gestion' },
    { icono: 'ri-bar-chart-2-line',     href: '#/supervisor/estadisticas' },
    { icono: 'ri-arrow-left-right-line', href: '#/supervisor/usuarios/peticiones' },
  ];

  const nav = document.createElement('nav');
  nav.classList.add('sidebar-mobile');
  nav.id = 'sidebarMobile';

  enlaces.forEach(({ icono, href }) => {
    const a = document.createElement('a');
    a.href = href;
    a.classList.add('sidebar-mobile__link');

    const i = document.createElement('i');
    i.classList.add(icono, 'sidebar-mobile__icono');

    a.appendChild(i);
    nav.appendChild(a);
  });

  marcarActivo(nav, window.location.hash);

  return nav;
}

