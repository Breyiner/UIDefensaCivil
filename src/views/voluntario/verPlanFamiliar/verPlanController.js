import * as api from "../../../helpers/api";
import * as alerta from "../../../helpers/alertas";
import paginacion from "../../../helpers/paginacion";

export default async () => {

    const botonBack = document.getElementById("botonBack");
    const contenedor = document.querySelector(".container__paginas");

    if (window.procesoPeticion === undefined) window.procesoPeticion = false;
    window.procesoPeticion = false;

    const rolId = localStorage.getItem("role_id");

    botonBack.onclick = () => {
        if (window.procesoPeticion) return;
        location.href = rolId == 3 
            ? `#/voluntario-home` 
            : `#/supervisor-home`;
    };

    const mensajeVacio = "No tienes ningun plan familiar realizado.";

    const carta = async (info) => {

        const div = document.createElement("div");
        div.classList.add("verPlan", "tarjeta");

        const estadoClase =
            info.status_id == 3 ? "verPlan__estado--azul" :
            info.status_id == 4 || info.status_id == 7 ? "verPlan__estado--verde" :
            info.status_id == 5 || info.status_id == 6 ? "verPlan__estado--rojo" :
            "";

        const estadoTexto =
            info.status_id == 5 ? "Rechz.Cambios" :
            info.status_id == 6 ? "Rechz.Definitivo" :
            info.status;

        div.innerHTML = `
            <div class="verPlan__icono">
                <i class="ri-parent-fill"></i>
            </div>
            <div class="verPlan__apellidos">${info.last_names}</div>
            <div class="verPlan__estado ${estadoClase}">
                ${estadoTexto}
            </div>
            <div class="verPlan__detalles--ubicacion">
                <i class="ri-map-pin-line"></i>
                ${info.department} - ${info.city}
            </div>
            <div class="verPlan__detalles--fecha">
                <i class="ri-calendar-event-fill"></i>
                Ultima Edicion: ${info.date_create}
            </div>
            ${
                info.status_id == 2 || 
                info.status_id == 6 || 
                info.status_id == 7
                    ? ""
                    : `<button class="verPlan__boton boton" 
                              data-id="${info.id}" 
                              data-status="${info.status_id}">
                          Revisar Plan
                       </button>`
            }
        `;

        return div;
    };

    const recargarContainer = async () => {
        contenedor.innerHTML = "";
        await paginacion("familyPlans/byUser", mensajeVacio, carta);
    };

    contenedor.addEventListener("click", async (e) => {

        const boton = e.target.closest("button");
        if (!boton) return;

        if (!boton.classList.contains("verPlan__boton")) return;
        if (window.procesoPeticion) return;

        const planId = boton.dataset.id;
        const status = boton.dataset.status;

        if (rolId == 3) {

            if (status == 1) {
                location.href = `#/voluntario-planFamiliar/testVunerabilidad/id=${planId}`;
            } else {
                location.href = `#/voluntario-verPlanFamiliar/menu/id=${planId}`;
            }

        } else if (rolId == 2) {

            location.href = `#/supervisor-planFamiliar/revision/id=${planId}`;
        }
    });

    await recargarContainer();
};