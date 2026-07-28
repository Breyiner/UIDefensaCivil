import { api } from "@/helpers/index.js";
import tiempoRelativo from "@/componentes/tiempos/tiempoRelativo";

const NOTIF_STATUS = { 4: 'pending', 5: 'returned', 6: 'pending', 7: 'pending' };

const ROL_MAP = { 1: 'administrador', 2: 'supervisor', 3: 'voluntario' };

function crearCardNotificacion(n, rolId) {
  const card = document.createElement('div');
  card.className = 'v-notification-card';

  if (n.entidad.tipo !== 'Plan Familiar') return card;

  // icono
  const icono = document.createElement('div');
  icono.className = 'v-card-icon';
  const iconoI = document.createElement('i');
  iconoI.className = 'ri-parent-fill';
  icono.appendChild(iconoI);

  // info: titulo + ubicacion
  const info = document.createElement('div');
  info.className = 'v-card-info';

  const titulo = document.createElement('h3');
  titulo.textContent = 'Familia ' + n.entidad.apellidos;

  const ubicacion = document.createElement('p');
  ubicacion.className = 'v-card-location';
  const ubicacionI = document.createElement('i');
  ubicacionI.className = 'ri-map-pin-fill';
  ubicacion.appendChild(ubicacionI);
  ubicacion.append(' ' + (n.entidad.direccion || ''));

  info.appendChild(titulo);
  info.appendChild(ubicacion);

  // estado: tiempo + badge
  const badgeCls = 'v-status-badge v-status-' + (NOTIF_STATUS[n.entidad.estado_id] || 'pending');
  const estado = document.createElement('div');
  estado.className = 'v-card-status';

  const tiempo = document.createElement('span');
  tiempo.className = 'v-time';
  tiempo.textContent = tiempoRelativo(n.created_at);

  const badge = document.createElement('span');
  badge.className = badgeCls;
  badge.textContent = n.entidad.estado;

  estado.appendChild(tiempo);
  estado.appendChild(badge);

  // main: junta icono + info + estado
  const main = document.createElement('div');
  main.className = 'v-card-main';
  main.appendChild(icono);
  main.appendChild(info);
  main.appendChild(estado);
  card.appendChild(main);

  // motivo (solo si hay comentario)
  if (n.entidad.comentario) {
    const reason = document.createElement('div');
    reason.className = 'v-card-reason';

    const reasonP = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = 'Motivo: ';
    reasonP.appendChild(strong);
    reasonP.append(n.entidad.comentario);

    reason.appendChild(reasonP);
    card.appendChild(reason);
  }

  // evento click para ir al plan
  if (n.id > 0) {
    const baseUrl = rolId == 2
      ? '#/supervisor/plan_familiar/revision?familia_id='
      : '#/voluntario/plan_familiar/familia?id=';

    card.addEventListener('click', async (e) => {
      e.stopPropagation();
      await api.patch('notifications/' + n.id, { is_read: true });
      window.location.href = baseUrl + n.entidad.id;
    });
  }

  return card;
}

export function crearNotificationPanel(headerCont, rolId, userId) {
  const panel = document.createElement('div');
  panel.className = 'notif-panel';

  const headerNoti = document.createElement('div');
  headerNoti.className = 'notif-panel-header';

  const headerTitle = document.createElement('h2');
  headerTitle.textContent = 'Notificaciones Recientes';
  const headerIcon = document.createElement('i');
  headerIcon.className = 'ri-notification-3-fill v-bell-small';
  headerNoti.appendChild(headerTitle);
  headerNoti.appendChild(headerIcon);

  const list = document.createElement('div');
  list.className = 'notif-panel-list';

  const footer = document.createElement('div');
  footer.className = 'notif-panel-footer';

  const verTodoBtn = document.createElement('button');
  verTodoBtn.className = 'v-btn v-btn-orange v-btn-see-all';
  verTodoBtn.textContent = 'Ver todo';

  let isOpen = false;

  function close() {
    panel.classList.remove('notif-panel--visible');
    isOpen = false;
  }

  verTodoBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const rolSegmento = ROL_MAP[rolId] || 'voluntario';
    location.hash = '#/' + rolSegmento + '/notificaciones';
    close();
  });

  footer.appendChild(verTodoBtn);

  panel.appendChild(headerNoti);
  panel.appendChild(list);
  panel.appendChild(footer);
  headerCont.appendChild(panel);

  function open() {
    if (isOpen) return;
    cargarNotificaciones(list, userId, rolId);
    panel.classList.add('notif-panel--visible');
    isOpen = true;
  }

  function toggle() {
    if (isOpen) close();
    else open();
  }

  document.addEventListener('click', (e) => {
    if (isOpen && !panel.contains(e.target) && !e.target.closest('.header__boton--notificacion')) {
      close();
    }
  });

  return { toggle, close };
}

async function cargarNotificaciones(list, userId, rolId) {
  try {
    const notificaciones = await api.get('notifications/user/' + userId);
    list.innerHTML = '';
    const maxNotis = 4;
    const data = notificaciones && notificaciones.length > 0
      ? notificaciones.slice(0, maxNotis)
      : [];
    data.forEach(n => {
      const card = crearCardNotificacion(n, rolId);
      if (card.querySelector('.v-card-main')) list.appendChild(card);
    });
    if (list.children.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'notif-panel-empty';
      empty.textContent = 'No hay notificaciones recientes';
      list.appendChild(empty);
    }
  } catch (error) {
    const empty = document.createElement('div');
    empty.className = 'notif-panel-empty';
    empty.textContent = 'Error al cargar notificaciones';
    list.innerHTML = '';
    list.appendChild(empty);
  }
}
