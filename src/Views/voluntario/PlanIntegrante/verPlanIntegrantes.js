import * as api from "../../Helpers/api";
import * as alerta from "../../Helpers/alertas";
import * as modalIntegrante from "../../Helpers/modales/integrante";
import paginacion from "../../Helpers/paginacion";

export default async () => {;
    const crear = document.getElementById("crear");
    const botonBack = document.getElementById("boton-back");
    const id = location.hash.split("=")[1];
    
    if (window.procesoPeticion === undefined) {window.procesoPeticion = true;}
    window.procesoPeticion = true;

    botonBack.onclick = () => {
        if (window.procesoPeticion) return;
        location.href = `#/verPlanFamiliar/menu/id=${id}`;
    };

    crear.addEventListener("click", async () => {location.href = `#/planIntegrante/crear/id=${id}`;});

    let mensajeVacio = "No tienes ningun miembro de la familia...";
    
    const carta = async(info) => {
        let cartaInfo = document.createElement('div');
        cartaInfo.classList.add("verIntegrante");
        cartaInfo.innerHTML = `
            <div class="verIntegrante__nombre">${info.full_name}</div>
            <div class="verIntegrante__sangre">${info.blood_group}</div>
            <div class="verIntegrante__documento"><i class="ri-passport-line"></i>${info.document_number}</div>
            <div class="verIntegrante__telefono"><i class="ri-phone-line"></i>${info.phone}</div>
            <div class="verIntegrante__parentesco"><i class="ri-parent-line"></i>${info.kinship}</div>
            <div class="verIntegrante__edad"><i class="ri-cake-2-line"></i>${info.birth_date}</div>
            <button class="boton boton--azul boton__editar" data-id="${info.id}">Editar</button>
            <button class="boton boton--azul boton__eliminar" data-id="${info.id}">Eliminar</button>
            <button class="boton boton__vermas" data-id="${info.id}">Ver más</button>`;
        return cartaInfo;
    }

    const funcionBotones = async(e) => {
    if (e.target.classList.contains("boton__editar")) {
          window.location.href = `#/planIntegrante/editar/id=${id},${e.target.dataset.id}`;}
    
    if (e.target.classList.contains("boton__eliminar")) {
        const id = e.target.dataset.id;
        const confirmacion = await alerta.alertaQuest("¿Seguro que deseas eliminar este miembro de la familia?",);
        if (!confirmacion.isConfirmed) return;
        const eliminado = await api.delet(`members/${id}`);
        if (eliminado.success) {
            await alerta.alertaOK(eliminado.message);
            location.reload();}
        else alerta.alertaError(eliminado.message);}
    
    if (e.target.classList.contains("boton__vermas"))
    {
        const id = e.target.dataset.id;
        modalIntegrante.ver(id);}
    }

    await paginacion(`members/familyPlan/${id}`, mensajeVacio,carta,funcionBotones);
}