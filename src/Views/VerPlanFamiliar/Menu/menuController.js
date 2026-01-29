import * as alerta from "../../../Helpers/alertas";

export default () => {
    const botonBack = document.getElementById("boton-back");
    botonBack.addEventListener("click", async () => {
        const confirmacion = await alerta.alertaQuest("¿Seguro que quieres volver? perderás tu progreso");
        if (confirmacion.isConfirmed) location.href = "#/verPlanFamiliar";
    });
    const integrante = document.getElementById("integrante");
    integrante.addEventListener("click", async () => {
        location.href = "#/planIntegrante";
    });
}