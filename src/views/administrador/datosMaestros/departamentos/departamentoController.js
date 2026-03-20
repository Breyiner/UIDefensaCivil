import crearLista from "../../../../helpers/crearLista";
import * as alerta from "../../../../helpers/alertas";
import * as departamento from "../../../../helpers/modales/departamento";

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

    const botonCrear = document.querySelector('#crearDepartamento');

    const recargar = async () => {
        await crearLista({
            contenedorSelector: ".listaDatos",
            endpoint: "departments",
            renderContenido: (span, item) => {
                span.innerHTML = `
                    <i class="ri-map-2-line"></i>
                    ${item.name}`;
            },
            modal: departamento.ver
        });
    };

    // Cargar lista inicial
    await recargar();

    // BOTÓN CREAR  
    botonCrear.addEventListener("click", () => {
        departamento.crear(recargar);
    });

};
