/**
 * Controlador Catálogo: Nacionalidades (nacionalidadesController.js)
 * Administra la vista de lista de nacionalidades, permitiendo crear, 
 * editar o alterar el estado (activo/inactivo) usando componentes reutilizables.
 */
import crearLista from "../../../../helpers/crearLista";
import * as alerta from "../../../../helpers/alertas";
import * as nacionalidad from "../../../../helpers/modales/nacionalidad";

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

    const botonCrear = document.querySelector('#crearNacionalidad');

    // Función para recargar la lista
    const recargar = async () => {
        await crearLista({
            contenedorSelector: ".listaDatos",
            endpoint: "nationalities",
            renderContenido: (span, item) => {
                span.innerHTML = `
                    <i class="ri-eye-line"></i>
                    ${item.name} - ${item.is_active == 1 ? "Activo" : "Inactivo"}
                `;
            },
            modal: nacionalidad.ver
        });
    };

    // Cargar lista inicial
    await recargar();

    // BOTÓN CREAR
    botonCrear.addEventListener("click", () => {
        nacionalidad.crear(recargar);
    });

};
