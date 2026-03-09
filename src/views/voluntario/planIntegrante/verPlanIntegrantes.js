import * as api from "../../../helpers/api";
import * as alerta from "../../../helpers/alertas";
import * as modalIntegrante from "../../../helpers/modales/integrante";
import paginacion from "../../../helpers/paginacion";

export default async () => {

    const crear = document.getElementById("crear");
    const botonBack = document.getElementById("boton-back");
    const id = location.hash.split("=")[1];
    const contenedor = document.querySelector(".container__paginas");

    if (window.procesoPeticion === undefined) { window.procesoPeticion = true; }
    window.procesoPeticion = true;

    botonBack.onclick = () => {
        if (window.procesoPeticion) return;
        location.href = `#/voluntario-verPlanFamiliar/menu/id=${id}`;
    };

    crear.addEventListener("click", async () => {
        location.href = `#/voluntario-planIntegrante/crear/id=${id}`;
    });

    let mensajeVacio = "No tienes ningun miembro de la familia...";

    const carta = async (info) => {
        let cartaInfo = document.createElement('div');
        cartaInfo.classList.add("verIntegrante");
        cartaInfo.innerHTML = `
            <div class="verIntegrante__nombre"><p class="tarjeta__titulo">${info.full_name}</p></div>
            <div class="verIntegrante__sangre"><p class="tarjeta__titulo">${info.blood_group}</p></div>
            <div class="verIntegrante__documento"><i class="ri-passport-line"></i><p class="tarjeta__contenido">${info.document_number}</p></div>
            <div class="verIntegrante__telefono"><i class="ri-phone-line"></i><p class="tarjeta__contenido">${info.phone}</p></div>
            <div class="verIntegrante__parentesco"><i class="ri-parent-line"></i><p class="tarjeta__contenido">${info.kinship}</p></div>
            <div class="verIntegrante__edad"><i class="ri-cake-2-line"></i><p class="tarjeta__contenido">${info.birth_date}</p></div>
            <button class="boton boton--azul boton__editar" data-id="${info.id}">Editar</button>
            <button class="boton boton--azul boton__eliminar" data-id="${info.id}">Eliminar</button>
            <button class="boton boton__vermas" data-id="${info.id}">Ver más</button>`;
        return cartaInfo;
    };

    // 🔥 MÉTODO RECARGAR CONTAINER
    const recargarContainer = async () => {
        contenedor.innerHTML = "";
        await paginacion(`members/familyPlan/${id}`, mensajeVacio, carta);
    };

    contenedor.addEventListener("click", async (e) => {

        if (e.target.classList.contains("boton__editar")) {
            window.location.href = `#/voluntario-planIntegrante/editar/id=${id},${e.target.dataset.id}`;
        }

        if (e.target.classList.contains("boton__eliminar")) {
            const memberId = e.target.dataset.id;

            const confirmacion = await alerta.alertaQuest(
                "¿Seguro que deseas eliminar este miembro de la familia?"
            );

            if (!confirmacion.isConfirmed) return;

            const eliminado = await api.delet(`members/${memberId}`);

            if (eliminado.success) {
                await alerta.alertaOK(eliminado.message);
                await recargarContainer();
            }
            else {
                alerta.alertaError(eliminado.message);
            }
        }

        if (e.target.classList.contains("boton__vermas")) {
            const memberId = e.target.dataset.id;
            modalIntegrante.ver(memberId);
        }
    });

    await recargarContainer();
};