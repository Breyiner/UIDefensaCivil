/**
 * Controlador Catálogo: Organizaciones (organizacionesController.js)
 * Gestiona la interfaz del catálogo de organizaciones de la Cruz Roja,
 * visualizando a su vez la relación foránea (Seccional a la que pertenece).
 */
import crearLista from "../../../../helpers/crearLista";
import * as alerta from "../../../../helpers/alertas";
import * as organizacion from "../../../../helpers/modales/organizacion";

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

    const botonCrear = document.querySelector('#crearOrganizacion');

    // Función para recargar la lista
    const recargar = async () => {
        await crearLista({
            contenedorSelector: ".listaDatos",
            endpoint: "organizations",
            renderContenido: (span, item) => {
                span.innerHTML = `
                    <i class="ri-eye-line"></i>
                    ${item.name}(${item.sectional.name}) - ${item.is_active == 1 ? "Activo" : "Inactivo"}
                `;
            },
            modal: organizacion.ver
        });
    };

    // Cargar lista inicial
    await recargar();

    // BOTÓN CREAR
    botonCrear.addEventListener("click", () => {
        organizacion.crear(recargar);
    });

};
