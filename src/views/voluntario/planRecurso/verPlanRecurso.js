import * as api from "../../../helpers/api";
import * as alerta from "../../../helpers/alertas";
import * as modalRecursoDisponible from "../../../helpers/modales/recursoDisponible";
import paginacion from "../../../helpers/paginacion";

export default async () => {

    const crear = document.getElementById("crear");
    const botonBack = document.getElementById("boton-back");
    const id = location.hash.split("=")[1];
    const contenedor = document.querySelector(".container__paginas");

    if (window.procesoPeticion === undefined) window.procesoPeticion = true;
    window.procesoPeticion = true;

    botonBack.onclick = () => {
        if (window.procesoPeticion) return;
        location.href = `#/voluntario-verPlanFamiliar/menu/id=${id}`;
    };

    crear.addEventListener("click", () => {
        location.href = `#/voluntario-planRecurso/crear/id=${id}`;
    });

    const mensajeVacio = "No tienes ningun recurso registrado en la familia...";

    const carta = async (info) => {
        const div = document.createElement("div");
        div.classList.add("verRiesgos");

        div.innerHTML = `
            <div class="verRiesgos__tipoRiesgo">
                <i class="ri-error-warning-line"></i>${info.resource_name}
            </div>
            <div class="verRiesgos__ubicacion">
                <i class="ri-map-2-line"></i>${info.location}
            </div>
            <div class="verRiesgos__distancia">
                <i class="ri-map-pin-line"></i>${info.distance} m
            </div>
            <div class="verRiesgos__descripcion">
                <p>Descripción:</p>${info.service} - ${info.description}
            </div>
            <button class="boton boton--azul verRiesgos__boton--editar" data-id="${info.id}">Editar</button>
            <button class="boton boton--azul verRiesgos__boton--eliminar" data-id="${info.id}">Eliminar</button>
            <button class="boton verRiesgos__boton--verMas" data-id="${info.id}">Ver más</button>
        `;

        return div;
    };

    const recargarContainer = async () => {
        contenedor.innerHTML = "";
        await paginacion(`availableResources/familyPlan/${id}`, mensajeVacio, carta);
    };

    contenedor.addEventListener("click", async (e) => {

        const boton = e.target.closest("button");
        if (!boton) return;

        const resourceId = boton.dataset.id;

        if (boton.classList.contains("verRiesgos__boton--editar")) {
            location.href = `#/voluntario-planRecurso/editar/id=${id},${resourceId}`;
        }

        if (boton.classList.contains("verRiesgos__boton--eliminar")) {

            const confirmacion = await alerta.alertaQuest(
                "¿Seguro que deseas eliminar este recurso?"
            );

            if (!confirmacion.isConfirmed) return;

            const eliminado = await api.delet(`availableResources/${resourceId}`);

            if (eliminado.success) {
                await alerta.alertaOK(eliminado.message);
                await recargarContainer();
            } else {
                alerta.alertaError(eliminado.message);
            }
        }

        if (boton.classList.contains("verRiesgos__boton--verMas")) {
            modalRecursoDisponible.ver(resourceId);
        }
    });

    await recargarContainer();
};