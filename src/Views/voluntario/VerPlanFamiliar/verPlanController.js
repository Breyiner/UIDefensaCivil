import * as api from "../../../Helpers/api";
import * as alerta from "../../../Helpers/alertas";
import paginacion from "../../../Helpers/paginacion";

export default async () => {;
    const botonBack = document.getElementById("boton-back");

    if (window.procesoPeticion === undefined) {window.procesoPeticion = false;}
    window.procesoPeticion = false;

    botonBack.onclick = () => {
        if (window.procesoPeticion) return;
        location.href = `#/home`;
    };

    let mensajeVacio = "No tienes ningun plan familiar realizado.";
    
    const carta = async(info) => {
        let cartaInfo = document.createElement('div');
        cartaInfo.classList.add('verPlan');
        cartaInfo.classList.add('tarjeta');
        cartaInfo.innerHTML = `
            <div class="verPlan__icono"><i class="ri-parent-fill"></i></div>
            <div class="verPlan__apellidos">${info.last_names}</div>
            <div class="verPlan__estado verPlan__estado--naranja">${info.action_name}</div>
            <div class="verPlan__detalles--ubicacion"><i class="ri-map-pin-line"></i>${info.apartment_name} - ${info.city_name}</div>
            <div class="verPlan__detalles--fecha"><i class="ri-calendar-event-fill"></i>Ultima Edicion: ${info.date}</div>
            <button class="verPlan__boton boton" id=${info.id}>Revisar Plan</button>`;
        return cartaInfo;
    }

    const funcionBotones = async(e) => {
    if (e.target.classList.contains("verPlan__boton") && !window.procesoPeticion) 
        {
            location.href = `#/verPlanFamiliar/menu/id=${e.target.id}`;
        }
    }

    await paginacion(`histories/voluntario`, mensajeVacio,carta,funcionBotones);
}