import * as api from "../../../Helpers/api";
import * as alerta from "../../../Helpers/alertas";
import paginacion from "../../../Helpers/paginacion";

export default async () => {;
    const botonBack = document.getElementById("boton-back");

    if (window.procesoPeticion === undefined) {window.procesoPeticion = false;}
    window.procesoPeticion = false;
    const rolId = localStorage.getItem("role_id");
    botonBack.onclick = () => {
        if (window.procesoPeticion) return;
        location.href = rolId == 3 ? `#/voluntario-home` : `#/supervisor-home`;
    };

    let mensajeVacio = "No tienes ningun plan familiar realizado.";
    
    const carta = async(info) => {
        let cartaInfo = document.createElement('div');
        cartaInfo.classList.add('verPlan');
        cartaInfo.classList.add('tarjeta');
        cartaInfo.innerHTML = `
            <div class="verPlan__icono"><i class="ri-parent-fill"></i></div>
            <div class="verPlan__apellidos">${info.last_names}</div>
            <div class="verPlan__estado ${info.status_id == 3 ? "verPlan__estado--azul" : info.status_id == 4 || info.status_id == 7 ? "verPlan__estado--verde" : info.status_id == 5 || info.status_id == 6 ? "verPlan__estado--rojo" : ""}">${info.status_id == 5 ? "Rechz.Cambios": info.status_id == 6 ? "Rechz.Definitivo" : info.status}</div>
            <div class="verPlan__detalles--ubicacion"><i class="ri-map-pin-line"></i>${info.department} - ${info.city}</div>
            <div class="verPlan__detalles--fecha"><i class="ri-calendar-event-fill"></i>Ultima Edicion: ${info.date_create}</div>
            ${info.status_id == 2 || info.status_id == 6 || info.status_id == 7? '' : `<button class="verPlan__boton boton" id=${info.id} data-status="${info.status_id}">Revisar Plan</button>`}`;
        return cartaInfo;
    }

    const funcionBotones = async(e) => {
    if (e.target.classList.contains("verPlan__boton") && !window.procesoPeticion) 
        {
            if (rolId == 3) {
                const status = e.target.dataset.status;
                if (status == 1) {
                    location.href = `#/voluntario-planFamiliar/testVunerabilidad/id=${e.target.id}`;
                }
                else location.href = `#/voluntario-verPlanFamiliar/menu/id=${e.target.id}`;
            }
            else if (rolId == 2) {
                location.href = `#/supervisor-planFamiliar/revision/id=${e.target.id}`;
            }
        }
    }

    await paginacion(`familyPlans/byUser`,mensajeVacio,carta,funcionBotones);
}