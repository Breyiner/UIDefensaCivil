import * as api from "../../../helpers/api";
import * as alerta from "../../../helpers/alertas";
import * as modalRecursoDisponible from "../../../helpers/modales/recursoDisponible";
import paginacion from "../../../helpers/paginacion";

export default async () => {;
    const crear = document.getElementById("crear");
    const botonBack = document.getElementById("boton-back");
    const id = location.hash.split("=")[1];
    
    if (window.procesoPeticion === undefined) {window.procesoPeticion = true;}
    window.procesoPeticion = true;

    botonBack.onclick = () => {
        if (window.procesoPeticion) return;
        location.href = `#/voluntario-verPlanFamiliar/menu/id=${id}`;
    };

    crear.addEventListener("click", async () => {location.href = `#/voluntario-planRecursos/crear/id=${id}`;});

    let mensajeVacio = "No tienes ningun recurso registrado en la familia...";

    const carta = async(info) => {
        let cartaInfo = document.createElement('div');
        cartaInfo.classList.add("verRiesgos");
        cartaInfo.innerHTML = `
            <div class="verRiesgos__tipoRiesgo">
                <i class="ri-error-warning-line"></i>${info.resource_name}</div>
            <div class="verRiesgos__ubicacion">
                <i class="ri-map-2-line"></i>${info.location}</div>
            <div class="verRiesgos__distancia">
                <i class="ri-map-pin-line"></i>${info.distance} m</div>
            <div class="verRiesgos__descripcion">
                <p>Descripción:</p>${info.service} - ${info.description}
            </div>
            <button class="boton boton--azul verRiesgos__boton--editar" data-id="${info.id}">Editar</button>
            <button class="boton boton--azul verRiesgos__boton--eliminar" data-id="${info.id}">Eliminar</button>
            <button class="boton verRiesgos__boton--verMas" data-id="${info.id}">Ver más</button>
        `;
        return cartaInfo;
    }

    const funcionBotones = async(e) => {
    if (e.target.classList.contains("verRiesgos__boton--editar")) {
        window.location.href = `#/voluntario-planRecursos/editar/id=${id},${e.target.dataset.id}`;}
    
    if (e.target.classList.contains("verRiesgos__boton--eliminar")) {
        const id = e.target.dataset.id;
        const confirmacion = await alerta.alertaQuest("¿Seguro que deseas eliminar este recurso?",);
        if (!confirmacion.isConfirmed) return;
        const eliminado = await api.delet(`availableResources/${id}`);
        if (eliminado.success) {
            await alerta.alertaOK(eliminado.message);
            location.reload();
        }
        else alerta.alertaError(eliminado.message);}
    
    if (e.target.classList.contains("verRiesgos__boton--verMas"))
    {
        const id = e.target.dataset.id;
        modalRecursoDisponible.ver(id);}
    }

    await paginacion(`availableResources/familyPlan/${id}`, mensajeVacio,carta,funcionBotones);
}