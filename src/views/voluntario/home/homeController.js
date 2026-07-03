import { api } from "@/helpers/index.js";
import tiempoRelativo from "@/componentes/tiempos/tiempoRelativo";

function h(tag, cls, ...children) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    children.forEach(c => el.append(typeof c === 'string' ? document.createTextNode(c) : c));
    return el;
}

const NOTIF_STATUS = { 4: 'pending', 5: 'returned', 6: 'pending', 7: 'pending' };

function crearCardNotificacion(n) {
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

    card.addEventListener('click', async () => {
        await api.patch('notifications/' + n.id, { is_read: true });
        window.location.href = '#/voluntario/plan_familiar/familia?id=' + n.entidad.id;
    });

    return card;
}

export default async () => {
    const volunteerName = document.querySelector(".v-volunteer-name");
    if (volunteerName) {
        volunteerName.textContent = localStorage.getItem("full_name") || "Voluntario";
    }

    try {
        const data = await api.get("familyPlans/stats_voluntario");
        document.getElementById("totalPlanes").textContent = data.total_planes;
        document.getElementById("numVuln").textContent = data.familias_registradas["Familias Vulnerables"];
        document.getElementById("numNoVuln").textContent = data.familias_registradas["Familias no Vulnerables"];
    } catch (error) {
        console.error("Error al cargar estadísticas del voluntario:", error);
    }

    const userId = localStorage.getItem("id");
    if (userId) {
        try {
            const notificaciones = await api.get("notifications/user/" + userId);
            if (notificaciones && notificaciones.length > 0) {
                const contenedor = document.querySelector(".v-notifications-list");
                if (contenedor) {
                    contenedor.innerHTML = "";
                    notificaciones.slice(0, 3).forEach(n => contenedor.append(crearCardNotificacion(n)));
                }
            }
        } catch (error) {
            console.error("Error al cargar notificaciones:", error);
        }
    }

    const RUTAS = {
        nuevoPlan: '#/voluntario/plan_familiar/crear',
        verPlan: '#/voluntario/plan_familiar',
        verTodasNotificaciones: '#/voluntario/notificaciones',
    };

    window.addEventListener('click', (e) => {
        const btn = e.target.closest(Object.keys(RUTAS).map(k => '#' + k).join(','));
        if (btn) window.location.href = RUTAS[btn.id];
    });
};
