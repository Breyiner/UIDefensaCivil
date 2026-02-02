import * as alerta from "../../../Helpers/alertas";

export default () => {
    const botonBack = document.getElementById("boton-back");
    const integrante = document.getElementById("integrante");
    const id = location.hash.split("=")[1];

    botonBack.addEventListener("click", async () => {
        const confirmacion = await alerta.alertaQuest("¿Seguro que quieres volver? perderás tu progreso");
        if (confirmacion.isConfirmed) location.href = `#/verPlanFamiliar`;
    });
    
    integrante.addEventListener("click", async () => {
        location.href = `#/planIntegrante/ver/id=${id}`;
    });
}