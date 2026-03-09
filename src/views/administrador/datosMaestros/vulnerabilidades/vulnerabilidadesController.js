import crearLista from "../../../../helpers/crearLista";
import * as alerta from "../../../../helpers/alertas";
import * as vulnerabilidad from "../../../../helpers/modales/vulnerabilidad";

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

    const botonCrear = document.querySelector('#crearVulnerabilidad');

    // Función para recargar la lista
    const recargar = async () => {
        await crearLista({
            contenedorSelector: ".listaDatos",
            endpoint: "vulnerabilities",
            renderContenido: (span, item) => {
                span.innerHTML = `
                    <i class="ri-eye-line"></i>
                    ${item.name} - ${item.is_active == 1 ? "Activo" : "Inactivo"}
                `;
            },
            modal: vulnerabilidad.ver
        });
    };

    // Cargar lista inicial
    await recargar();

    // BOTÓN CREAR  
    botonCrear.addEventListener("click", () => {
        vulnerabilidad.crear(recargar);
    });

};
