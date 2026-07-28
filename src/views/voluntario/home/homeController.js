import { api } from "@/helpers/index.js";
import tiempoRelativo from "@/componentes/tiempos/tiempoRelativo";

const NOTIF_STATUS = { 4: 'pending', 5: 'returned', 6: 'pending', 7: 'pending' };

function crearCardNotificacion(n) {
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

    // evento click para marcar como leido e ir al plan
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
    const contenedor = document.querySelector(".v-notifications-list");
    if (userId && contenedor) {
        try {
            const notificaciones = await api.get("notifications/user/" + userId);
            contenedor.innerHTML = "";
            if (notificaciones && notificaciones.length > 0) {
                notificaciones.slice(0, 3).forEach(n => contenedor.append(crearCardNotificacion(n)));
            } else {
                const msg = document.createElement("p");
                msg.className = "v-no-notifications";
                msg.textContent = "No hay notificaciones recientes";
                contenedor.appendChild(msg);
            }
        } catch (error) {
            console.error("Error al cargar notificaciones:", error);
            contenedor.innerHTML = "";
            const msg = document.createElement("p");
            msg.className = "v-no-notifications";
            msg.textContent = "No hay notificaciones recientes";
            contenedor.appendChild(msg);
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
