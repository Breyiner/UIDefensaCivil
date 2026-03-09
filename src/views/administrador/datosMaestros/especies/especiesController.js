import crearLista from "../../../../helpers/crearLista";
import * as alerta from "../../../../helpers/alertas";
import * as especie from "../../../../helpers/modales/especie";

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

    const botonCrear = document.querySelector('#crearEspecie');

    // Función para recargar la lista
    const recargar = async () => {
        await crearLista({
            contenedorSelector: ".listaDatos",
            endpoint: "species",
            renderContenido: (span, item) => {
                span.innerHTML = `
                    <i class="ri-bear-smile-line"></i>
                    ${item.name} - ${item.is_active == 1 ? "Activo" : "Inactivo"}
                `;
            },
            modal: especie.ver
        });
    };

    // Cargar lista inicial
    await recargar();

    // BOTÓN CREAR  
    botonCrear.addEventListener("click", () => {
        especie.crear(recargar);
    });

};
