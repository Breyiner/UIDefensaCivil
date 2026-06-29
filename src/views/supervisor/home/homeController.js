import { api } from "@/helpers/index.js";

function crearCardPlan(plan) {
    const esDevuelto = plan.status === "Devuelto" || plan.status === "Rechazado";
    const pillClass = esDevuelto ? "devuelto" : "pendiente";
    const badgeTexto = plan.status ?? "Pendiente";

    const motivoHtml = esDevuelto
        ? `<div class="devuelto-reason-container">
                <span class="ri-chat-1-line"></span>
                <div>
                    <strong>Motivo</strong><br>
                    ${plan.motivo ?? "Sin especificar"}
                </div>
            </div>`
        : "";

    return `
        <div class="row-plan-card">
            <div class="row-plan-main">
                <div class="left-info-group">
                    <div class="avatar-circle-icon"><span class="ri-team-line"></span></div>
                    <div class="details-list">
                        <h4>${plan.familia ?? "Familia sin nombre"}</h4>
                        <p><span class="ri-map-pin-line"></span> ${plan.ubicacion ?? "Sin ubicación"}</p>
                        <p><span class="ri-calendar-line"></span> Recibido: ${plan.fecha ?? "—"}</p>
                        <p><span class="ri-user-line"></span> Voluntario: ${plan.voluntario ?? "—"}</p>
                    </div>
                </div>
                <div class="right-status-group">
                    <div class="timestamp">${plan.tiempo ?? "—"}</div>
                    <div class="status-pill ${pillClass}">${badgeTexto}</div>
                </div>
            </div>
            ${motivoHtml}
        </div>`;
}

export default async () => {
    const dashBoard = await api.get('audits/dashBoardSupervisor');

    const nombre = localStorage.getItem("full_name");
    const genero = localStorage.getItem("gender_id");

    const saludo = document.querySelector(".profile-details h3");
    if (saludo) {
        saludo.textContent = genero == 2 ? "Bienvenida " + nombre : "Bienvenido " + nombre;
    }

    const ids = ["planesRecibidos", "planesEnRevision", "planesAprobados", "planesRechazados"];
    const [nuevos, pendientes, aprobados, rechazados] = ids.map(id => document.getElementById(id));

    if (nuevos) nuevos.textContent = dashBoard.pending_plans ?? 0;
    if (aprobados) aprobados.textContent = dashBoard.approved_plans ?? 0;
    if (rechazados) rechazados.textContent = dashBoard.rejected_plans ?? 0;
    if (pendientes) pendientes.textContent = dashBoard.in_review_plans ?? 0;

    const totalRev = document.getElementById("totalRevisados");
    if (totalRev) totalRev.textContent = (dashBoard.approved_plans ?? 0) + (dashBoard.rejected_plans ?? 0);

    const volAct = document.getElementById("voluntariosActivos");
    if (volAct) volAct.textContent = dashBoard.active_volunteers ?? 0;

    const prom = document.getElementById("promedioPlanes");
    if (prom) prom.textContent = (dashBoard.avg_plans_per_volunteer ?? 0) + "%";

    const planesList = document.getElementById("planesList");
    if (planesList && dashBoard.recent_plans?.length) {
        const planes = dashBoard.recent_plans;
        const pages = [];
        for (let i = 0; i < planes.length; i += 4) {
            const chunk = planes.slice(i, i + 4);
            pages.push(`<div class="planes-page">${chunk.map(crearCardPlan).join("")}</div>`);
        }
        planesList.innerHTML = pages.join("");
    }

    document.getElementById("btnEstadisticas")?.addEventListener("click", () => {
        window.location.href = "#/supervisor/estadisticas";
    });
    document.getElementById("btnVerTodos")?.addEventListener("click", () => {
        window.location.href = "#/supervisor/plan_familiar/";
    });
};
