import * as api from "../../../helpers/api";
import * as alerta from "../../../helpers/alertas";
import paginacion from "../../../helpers/paginacion";
import * as modalGraficoVivienda from "../../../helpers/modales/graficoVivienda";

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
        location.href = `#/voluntario-planGrafico/crear/id=${id}`;
    });

    const mensajeVacio = "No tienes ningun grafico de vivienda registrado en la familia...";

    const carta = async (info) => {
        const div = document.createElement("div");
        div.classList.add("verGraficos");
        
        div.innerHTML = `
            <div class="verGraficos__imagenTexto">
                <img class="verGraficos__imagen" src="${api.urlStorage+'/'+info.path}">
                <div class="verGraficos__texto">${info.description}</div>
            </div>
            <div class="verGraficos__botones">
                <button class="boton boton--azul verGrafico__boton--editar" data-id="${info.id}">Editar</button>
                <button class="boton boton--azul verGrafico__boton--eliminar" data-id="${info.id}">Eliminar</button>
                <button class="boton verGrafico__boton--verMas" data-id="${info.id}">Ver más</button>
            </div>
            `;

        return div;
    };

    const recargarContainer = async () => {
        contenedor.innerHTML = "";
        await paginacion(`housingGraphics/familyPlan/${id}`, mensajeVacio, carta);
    };

    contenedor.addEventListener("click", async (e) => {

        const boton = e.target.closest("button");
        if (!boton) return;

        const graficoId = boton.dataset.id;

        if (boton.classList.contains("verGrafico__boton--editar")) {
            location.href = `#/voluntario-planGrafico/editar/id=${id},${graficoId}`;
        }

        if (boton.classList.contains("verGrafico__boton--eliminar")) {

            const confirmacion = await alerta.alertaQuest(
                "¿Seguro que deseas eliminar este recurso?"
            );

            if (!confirmacion.isConfirmed) return;

            const eliminado = await api.delet(`housingGraphics/${graficoId}`);

            if (eliminado.success) {
                await alerta.alertaOK(eliminado.message);
                await recargarContainer();
            } else {
                alerta.alertaError(eliminado.message);
            }
        }

        if (boton.classList.contains("verGrafico__boton--verMas")) {
            modalGraficoVivienda.ver(graficoId);
        }
    });

    await recargarContainer();
};