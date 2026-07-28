import { get } from "@/helpers/api.js";

const STATUS_MAP = {
    1: 'creado',
    2: 'creado',
    3: 'pendiente',
    4: 'pendiente',
    5: 'devuelto',
    6: 'rechazado',
    7: 'completado'
};

function crearCardPlan(plan) {
    const pillClass = STATUS_MAP[plan.status_id] || 'pendiente';
    const mostrarMotivo = plan.status_id === 5 || plan.status_id === 6;

    // card principal
    const card = document.createElement('div');
    card.className = 'row-plan-card';

    // main
    const main = document.createElement('div');
    main.className = 'row-plan-main';

    // grupo izquierdo: icono + detalles
    const leftGroup = document.createElement('div');
    leftGroup.className = 'left-info-group';

    const avatar = document.createElement('div');
    avatar.className = 'avatar-circle-icon';
    const avatarIcon = document.createElement('span');
    avatarIcon.className = 'ri-team-line';
    avatar.appendChild(avatarIcon);

    const details = document.createElement('div');
    details.className = 'details-list';

    const nombre = document.createElement('h4');
    nombre.textContent = 'Familia ' + (plan.last_names || "sin nombre");

    const ubicacion = document.createElement('p');
    const ubicacionIcon = document.createElement('span');
    ubicacionIcon.className = 'ri-map-pin-line';
    ubicacion.appendChild(ubicacionIcon);
    ubicacion.append(' ' + (plan.department || "Sin ubicación"));

    const recibido = document.createElement('p');
    const recibidoIcon = document.createElement('span');
    recibidoIcon.className = 'ri-calendar-line';
    recibido.appendChild(recibidoIcon);
    recibido.append(' Recibido: ' + (plan.date_create || "—"));

    const voluntario = document.createElement('p');
    const voluntarioIcon = document.createElement('span');
    voluntarioIcon.className = 'ri-user-line';
    voluntario.appendChild(voluntarioIcon);
    voluntario.append(' Voluntario: ' + (plan.responsable || "—"));

    details.appendChild(nombre);
    details.appendChild(ubicacion);
    details.appendChild(recibido);
    details.appendChild(voluntario);

    leftGroup.appendChild(avatar);
    leftGroup.appendChild(details);

    // grupo derecho: estado
    const rightGroup = document.createElement('div');
    rightGroup.className = 'right-status-group';

    const timestamp = document.createElement('div');
    timestamp.className = 'timestamp';
    timestamp.textContent = plan.date_create || "—";

    const pill = document.createElement('div');
    pill.className = 'status-pill ' + pillClass;
    pill.textContent = plan.status || "Pendiente";

    rightGroup.appendChild(timestamp);
    rightGroup.appendChild(pill);

    // armar main
    main.appendChild(leftGroup);
    main.appendChild(rightGroup);
    card.appendChild(main);

    // motivo (solo si status 5 o 6)
    if (mostrarMotivo) {
        const reason = document.createElement('div');
        reason.className = 'devuelto-reason-container';

        const reasonIcon = document.createElement('span');
        reasonIcon.className = 'ri-chat-1-line';

        const reasonText = document.createElement('div');
        const strong = document.createElement('strong');
        strong.textContent = 'Motivo';
        reasonText.appendChild(strong);
        reasonText.appendChild(document.createElement('br'));
        reasonText.append(plan.comentary || "Sin especificar");

        reason.appendChild(reasonIcon);
        reason.appendChild(reasonText);
        card.appendChild(reason);
    }

    return card;
}

function actualizarElemento(id, valor) {
    const el = document.getElementById(id);
    if (el) el.textContent = valor || 0;
}

export default async () => {
    try {
        const dashBoard = await get('audits/dashBoardSupervisor');

        const nombre = localStorage.getItem("full_name");
        const genero = parseInt(localStorage.getItem("gender_id"), 10);

        const saludo = document.querySelector(".profile-details h3");
        if (saludo) {
            saludo.textContent = (genero === 2 ? "Bienvenida " : "Bienvenido ") + nombre;
        }

        actualizarElemento("planesRecibidos", dashBoard.pending_plans);
        actualizarElemento("planesEnRevision", dashBoard.in_review_plans);
        actualizarElemento("planesAprobados", dashBoard.approved_plans);
        actualizarElemento("planesRechazados", dashBoard.rejected_plans);
        actualizarElemento("totalRevisados", (dashBoard.approved_plans || 0) + (dashBoard.rejected_plans || 0));

        const sectionalId = localStorage.getItem("sectional_id");
        if (sectionalId) {
            const stats = await get(`sectionals/${sectionalId}/stats_supervisor`);
            if (stats) {
                actualizarElemento("voluntariosActivos", stats.voluntarios_activos);
                actualizarElemento("promedioPlanes", (stats.promedio_planes_por_voluntario || 0) + "%");
            }
        }

        const planesList = document.getElementById("planesList");
        const planesRes = await get('familyPlans?per_page=4');
        if (planesList && planesRes && planesRes.length) {
            planesList.innerHTML = "";
            const page = document.createElement('div');
            page.className = 'planes-page';
            planesRes.slice(0, 4).forEach(plan => page.appendChild(crearCardPlan(plan)));
            planesList.appendChild(page);
        }

        const RUTAS = {
            btnEstadisticas: '#/supervisor/estadisticas',
            btnVerTodos: '#/supervisor/plan_familiar/',
        };

        window.addEventListener('click', (e) => {
            const btn = e.target.closest(Object.keys(RUTAS).map(k => '#' + k).join(','));
            if (btn) window.location.hash = RUTAS[btn.id];
        });
    } catch (error) {
        console.error("Error cargando dashboard supervisor:", error);
    }
};
