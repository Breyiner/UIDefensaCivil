/**
 * Controlador Catálogo: Seccionales (seccionalesController.js)
 * Gestiona la entidad principal geográfica (Seccional) a la que pertenecen
 * diferentes organizaciones de voluntarios. Renderiza su lista y formulario modal.
 */
import crearLista from "../../../../helpers/crearLista";
import * as alerta from "../../../../helpers/alertas";
import * as seccional from "../../../../helpers/modales/seccional";

export default async () => {
    const botonBack = document.getElementById("botonBack");
    if (window.procesoPeticion === undefined) {
        window.procesoPeticion = false;
    }
    window.procesoPeticion = false;

    botonBack.onclick = async () => {
        if (window.procesoPeticion) return;
        location.href = `#/administrador-datosMaestros/`;
    };

    const botonCrear = document.querySelector('#crearSeccional');

    // Función para recargar la lista
    const recargar = async () => {
        await crearLista({
            contenedorSelector: ".listaDatos",
            endpoint: "sectionals",
            renderContenido: (span, item) => {
                span.innerHTML = `
                    <i class="ri-eye-line"></i>
                    ${item.name} - ${item.is_active == 1 ? "Activo" : "Inactivo"}
                `;
            },
            modal: seccional.ver
        });
    };

    // Cargar lista inicial
    await recargar();

    // BOTÓN CREAR  
    botonCrear.addEventListener("click", () => {
        seccional.crear(recargar);
    });

};
