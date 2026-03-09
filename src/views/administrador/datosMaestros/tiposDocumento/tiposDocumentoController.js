import crearLista from "../../../../helpers/crearLista";
import * as alerta from "../../../../helpers/alertas";
import * as tipoDocumento from "../../../../helpers/modales/tipoDocumento";

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

    const botonCrear = document.querySelector('#crearTipoDocumento');

    // Función para recargar la lista
    const recargar = async () => {
        await crearLista({
            contenedorSelector: ".listaDatos",
            endpoint: "documentTypes",
            renderContenido: (span, item) => {
                span.innerHTML = `
                    <i class="ri-eye-line"></i>
                    ${item.name} - ${item.acronym} - ${item.is_active == 1 ? "Activo" : "Inactivo"}
                `;
            },
            modal: tipoDocumento.ver
        });
    };

    // Cargar lista inicial
    await recargar();

    // BOTÓN CREAR
    botonCrear.addEventListener("click", () => {
        tipoDocumento.crear(recargar);
    });

};
