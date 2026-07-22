import { get } from "@/helpers/api.js";

function h(tag, cls, ...children) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    children.forEach(c => el.append(typeof c === 'string' ? document.createTextNode(c) : c));
    return el;
}

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
    const pillClass = STATUS_MAP[plan.status_id] ?? 'pendiente';
    const mostrarMotivo = plan.status_id === 5 || plan.status_id === 6;

    const card = h('div', 'row-plan-card',
        h('div', 'row-plan-main',
            h('div', 'left-info-group',
                h('div', 'avatar-circle-icon', h('span', 'ri-team-line')),
                h('div', 'details-list',
                    h('h4', null, 'Familia ' + (plan.last_names ?? "sin nombre")),
                    h('p', null, h('span', 'ri-map-pin-line'), ' ' + (plan.department ?? "Sin ubicación")),
                    h('p', null, h('span', 'ri-calendar-line'), ' Recibido: ' + (plan.date_create ?? "—")),
                    h('p', null, h('span', 'ri-user-line'), ' Voluntario: ' + (plan.responsable ?? "—"))
                )
            ),
            h('div', 'right-status-group',
                h('div', 'timestamp', plan.date_create ?? "—"),
                h('div', 'status-pill ' + pillClass, plan.status ?? "Pendiente")
            )
        )
    );

    if (mostrarMotivo) {
        card.appendChild(
            h('div', 'devuelto-reason-container',
                h('span', 'ri-chat-1-line'),
                h('div', null, h('strong', null, 'Motivo'), h('br'), plan.comentary ?? "Sin especificar")
            )
        );
    }

    return card;
}

function actualizarElemento(id, valor) {
    const el = document.getElementById(id);
    if (el) el.textContent = valor ?? 0;
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
        actualizarElemento("totalRevisados", (dashBoard.approved_plans ?? 0) + (dashBoard.rejected_plans ?? 0));

        const sectionalId = localStorage.getItem("sectional_id");
        if (sectionalId) {
            const stats = await get(`sectionals/${sectionalId}/stats_supervisor`);
            if (stats) {
                actualizarElemento("voluntariosActivos", stats.voluntarios_activos);
                actualizarElemento("promedioPlanes", (stats.promedio_planes_por_voluntario ?? 0) + "%");
            }
        }
        const planesList = document.getElementById("planesList");
        const planesRes = await get('familyPlans?per_page=4');
        if (planesList && planesRes?.length) {
            planesList.innerHTML = "";
            const page = h('div', 'planes-page');
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
