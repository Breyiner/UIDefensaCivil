import { get } from "@/helpers/api.js";

function crearCardPlan(plan) {
    const esDevuelto = plan.status === "Devuelto";
    const pillClass = esDevuelto ? "devuelto" : "pendiente";
    const badgeTexto = plan.status ?? "Pendiente";

    const card = document.createElement('div');
    card.className = 'row-plan-card';

    const rowMain = document.createElement('div');
    rowMain.className = 'row-plan-main';

    const leftGroup = document.createElement('div');
    leftGroup.className = 'left-info-group';

    const avatar = document.createElement('div');
    avatar.className = 'avatar-circle-icon';
    const avatarIcon = document.createElement('span');
    avatarIcon.className = 'ri-team-line';
    avatar.appendChild(avatarIcon);

    const details = document.createElement('div');
    details.className = 'details-list';

    const h4 = document.createElement('h4');
    h4.textContent = plan.familia ?? "Familia sin nombre";

    const p1 = document.createElement('p');
    const span1 = document.createElement('span');
    span1.className = 'ri-map-pin-line';
    p1.appendChild(span1);
    p1.append(' ' + (plan.ubicacion ?? "Sin ubicación"));

    const p2 = document.createElement('p');
    const span2 = document.createElement('span');
    span2.className = 'ri-calendar-line';
    p2.appendChild(span2);
    p2.append(' Recibido: ' + (plan.fecha ?? "—"));

    const p3 = document.createElement('p');
    const span3 = document.createElement('span');
    span3.className = 'ri-user-line';
    p3.appendChild(span3);
    p3.append(' Voluntario: ' + (plan.voluntario ?? "—"));

    details.append(h4, p1, p2, p3);
    leftGroup.append(avatar, details);

    const rightGroup = document.createElement('div');
    rightGroup.className = 'right-status-group';

    const timestamp = document.createElement('div');
    timestamp.className = 'timestamp';
    timestamp.textContent = plan.tiempo ?? "—";

    const pill = document.createElement('div');
    pill.className = 'status-pill ' + pillClass;
    pill.textContent = badgeTexto;

    rightGroup.append(timestamp, pill);

    rowMain.append(leftGroup, rightGroup);
    card.appendChild(rowMain);

    if (esDevuelto) {
        const motivo = document.createElement('div');
        motivo.className = 'devuelto-reason-container';

        const chatIcon = document.createElement('span');
        chatIcon.className = 'ri-chat-1-line';

        const motivoDiv = document.createElement('div');
        const strong = document.createElement('strong');
        strong.textContent = 'Motivo';
        const br = document.createElement('br');
        motivoDiv.append(strong, br);
        motivoDiv.append(plan.motivo ?? "Sin especificar");

        motivo.append(chatIcon, motivoDiv);
        card.appendChild(motivo);
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
        actualizarElemento("voluntariosActivos", dashBoard.active_volunteers);
        actualizarElemento("promedioPlanes", (dashBoard.avg_plans_per_volunteer ?? 0) + "%");

        const planesList = document.getElementById("planesList");
        if (planesList && dashBoard.recent_plans?.length) {
            const planes = dashBoard.recent_plans;
            planesList.innerHTML = "";
            for (let i = 0; i < planes.length; i += 4) {
                const chunk = planes.slice(i, i + 4);
                const page = document.createElement('div');
                page.className = 'planes-page';
                chunk.forEach(plan => page.appendChild(crearCardPlan(plan)));
                planesList.appendChild(page);
            }
        }

        document.getElementById("btnEstadisticas")?.addEventListener("click", () => {
            window.location.hash = "#/supervisor/estadisticas";
        });
        document.getElementById("btnVerTodos")?.addEventListener("click", () => {
            window.location.hash = "#/supervisor/plan_familiar/";
        });
    } catch (error) {
        console.error("Error cargando dashboard supervisor:", error);
    }
};
