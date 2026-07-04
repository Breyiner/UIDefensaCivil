import { get } from "@/helpers/api.js";

function h(tag, cls, ...children) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    children.forEach(c => el.append(typeof c === 'string' ? document.createTextNode(c) : c));
    return el;
}

function crearCardPlan(plan) {
    const esDevuelto = plan.status === "Devuelto";
    const pillClass = esDevuelto ? "devuelto" : "pendiente";

    const card = h('div', 'row-plan-card',
        h('div', 'row-plan-main',
            h('div', 'left-info-group',
                h('div', 'avatar-circle-icon', h('span', 'ri-team-line')),
                h('div', 'details-list',
                    h('h4', null, plan.familia ?? "Familia sin nombre"),
                    h('p', null, h('span', 'ri-map-pin-line'), ' ' + (plan.ubicacion ?? "Sin ubicación")),
                    h('p', null, h('span', 'ri-calendar-line'), ' Recibido: ' + (plan.fecha ?? "—")),
                    h('p', null, h('span', 'ri-user-line'), ' Voluntario: ' + (plan.voluntario ?? "—"))
                )
            ),
            h('div', 'right-status-group',
                h('div', 'timestamp', plan.tiempo ?? "—"),
                h('div', 'status-pill ' + pillClass, plan.status ?? "Pendiente")
            )
        )
    );

    if (esDevuelto) {
        card.appendChild(
            h('div', 'devuelto-reason-container',
                h('span', 'ri-chat-1-line'),
                h('div', null, h('strong', null, 'Motivo'), h('br'), plan.motivo ?? "Sin especificar")
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
        if (planesList && dashBoard.recent_plans?.length) {
            const planes = dashBoard.recent_plans;
            planesList.innerHTML = "";
            for (let i = 0; i < planes.length; i += 4) {
                const page = h('div', 'planes-page');
                planes.slice(i, i + 4).forEach(plan => page.appendChild(crearCardPlan(plan)));
                planesList.appendChild(page);
            }
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
