import * as api from "../../Helpers/api";
import * as alerta from "../../Helpers/alertas";

export default async () => {
    const botonBack = document.getElementById("boton-back");
    const crear = document.getElementById("crear");
    const id = location.hash.split("=")[1];

    botonBack.addEventListener("click", async () => {
        const confirmacion = await alerta.alertaQuest("¿Seguro que quieres volver? perderás tu progreso");
        if (confirmacion.isConfirmed) location.href = `#/verPlanFamiliar/menu/id=${id}`;
    });
    crear.addEventListener("click", async () => {
        location.href = `#/planIntegrante/crear/id=${id}`;
    });
}