import { api } from "@/helpers/index.js";
import tiempoRelativo from "@/componentes/tiempos/tiempoRelativo";

function h(tag, cls, ...children) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  children.forEach(c => el.append(typeof c === 'string' ? document.createTextNode(c) : c));
  return el;
}

const NOTIF_STATUS = { 4: 'pending', 5: 'returned', 6: 'pending', 7: 'pending' };

const ROL_MAP = { 1: 'administrador', 2: 'supervisor', 3: 'voluntario' };

function crearCardNotificacion(n, rolId) {
  const card = h('div', 'v-notification-card');
  if (n.entidad.tipo !== 'Plan Familiar') return card;

  const icono = h('div', 'v-card-icon', h('i', 'ri-parent-fill'));
  const info = h('div', 'v-card-info',
    h('h3', null, 'Familia ' + n.entidad.apellidos),
    h('p', 'v-card-location', h('i', 'ri-map-pin-fill'), ' ' + (n.entidad.direccion || ''))
  );

  const badgeCls = 'v-status-badge v-status-' + (NOTIF_STATUS[n.entidad.estado_id] || 'pending');
  const estado = h('div', 'v-card-status',
    h('span', 'v-time', tiempoRelativo(n.created_at)),
    h('span', badgeCls, n.entidad.estado)
  );

  card.append(h('div', 'v-card-main', icono, info, estado));

  if (n.entidad.comentario) {
    card.append(h('div', 'v-card-reason',
      h('p', null, h('strong', null, 'Motivo: '), n.entidad.comentario)
    ));
  }

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
  headerNoti.innerHTML = '<h2>Notificaciones Recientes</h2><i class="ri-notification-3-fill v-bell-small"></i>';

  const list = document.createElement('div');
  list.className = 'notif-panel-list';

  const footer = document.createElement('div');
  footer.className = 'notif-panel-footer';
  const verTodoBtn = document.createElement('button');
  verTodoBtn.className = 'v-btn v-btn-orange v-btn-see-all';
  verTodoBtn.textContent = 'Ver todo';
  verTodoBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const rolSegmento = ROL_MAP[rolId] || 'voluntario';
    location.hash = '#/' + rolSegmento + '/notificaciones';
    close();
  });
  footer.appendChild(verTodoBtn);

  panel.append(headerNoti, list, footer);
  headerCont.append(panel);

  let isOpen = false;

  function open() {
    if (isOpen) return;
    cargarNotificaciones(list, userId, rolId);
    panel.classList.add('notif-panel--visible');
    isOpen = true;
  }

  function close() {
    panel.classList.remove('notif-panel--visible');
    isOpen = false;
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
      list.innerHTML = '<div class="notif-panel-empty">No hay notificaciones recientes</div>';
    }
  } catch (error) {
    list.innerHTML = '<div class="notif-panel-empty">Error al cargar notificaciones</div>';
  }
}
