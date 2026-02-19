import crearLista from "../../../../Helpers/crearLista";
import * as alerta from "../../../../Helpers/alertas";
import * as calidadVivienda from "../../../../Helpers/Modales/calidadVivienda";

export default async () => {

    const botonBack = document.getElementById("boton-back");

    if (window.procesoPeticion === undefined) {
        window.procesoPeticion = false;
    }
    window.procesoPeticion = false;

    botonBack.onclick = async () => {
        if (window.procesoPeticion) return;
        location.href = `#/administrador-datosMaestros/`;
    };

    const botonCrear = document.querySelector('#crearCalidadVivienda');

    // Función para recargar la lista
    const recargar = async () => {
        await crearLista({
            contenedorSelector: ".listaDatos",
            endpoint: "housingQualities",
            renderContenido: (span, item) => {
                span.innerHTML = `
                    <i class="ri-eye-line"></i>
                    ${item.name} - ${item.is_active == 1 ? "Activo" : "Inactivo"}
                `;
            },
            modal: calidadVivienda.ver
        });
    };

    // Cargar lista inicial
    await recargar();

    // BOTÓN CREAR
    botonCrear.addEventListener("click", () => {
        calidadVivienda.crear(recargar);
    });

};
