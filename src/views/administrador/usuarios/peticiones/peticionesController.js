import * as alerta from "../../../../helpers/alertas";
import * as api from "../../../../helpers/api";
import paginacion from "../../../../helpers/paginacion";
import * as modalUsuario from "../../../../helpers/modales/usuario";

export default async () => {

    const botonBack = document.getElementById("boton-back");

    if (window.procesoPeticion === undefined) {
        window.procesoPeticion = false;
    }
    window.procesoPeticion = false;

    botonBack.onclick = async () => {
        if (window.procesoPeticion) return;
        location.href = `#/administrador-home`;
    };

    let mensajeVacio = "No hay ninguna peticion de activacion";

    const carta = async (info) => {
        let cartaInfo = document.createElement('div');
        cartaInfo.classList.add("verUsuario");
        cartaInfo.innerHTML = `
            <div class="verUsuario__documento"><i class="ri-id-card-line"></i>${info.document_number}</div>
            <div class="verUsuario__rol"><span>Peticion</span></div>
            <div class="verUsuario__nombre"><i class="ri-jewelry-line"></i>${info.full_name}</div>
            <div class="verUsuario__correo"><i class="ri-mail-line"></i>${info.email}</div>
            <div class="verUsuario__seccional"><i class="ri-team-line"></i>${info.sectional}</div>
            <div class="verUsuario__organizacion"><i class="ri-parent-line"></i>${info.organization}</div>
            <div class="verUsuario__botones">
                <button class="boton boton--azul verUsuario__botonPeticion" data-id="${info.id}">
                    Ver informacion
                </button>
            </div>`;
        return cartaInfo;
    };

    const funcionBotones = async (e) => {
        if (e.target.classList.contains("verUsuario__botonPeticion")) {
            const id = e.target.dataset.id;

            // 👇 FUNCIÓN QUE RECARGA LA LISTA
            const recargarContainer = async () => {
                await paginacion(`users/requestsAdmins`, mensajeVacio, carta, funcionBotones);
            };

            // 👇 PASAMOS LA FUNCIÓN AL MODAL
            modalUsuario.ver(id, recargarContainer, true, true);
        }
    };

    // 👇 PRIMERA CARGA
    await paginacion(`users/requestsAdmins`, mensajeVacio, carta, funcionBotones);
};
