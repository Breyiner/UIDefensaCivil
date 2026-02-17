import * as api from "../../../../Helpers/api";
import * as alerta from "../../../../Helpers/alertas";
import AccesoPlan from "../../../../Helpers/AccesoPlan";

export default async () => {
    const botonBack = document.getElementById("boton-back");
    const integrante = document.getElementById("integrantes");
    const mascotas = document.getElementById("mascotas");
    const id = location.hash.split("=")[1];
    
    await AccesoPlan(id);

    botonBack.onclick = () => {location.href = `#/verPlanFamiliar`;}

    integrante.addEventListener("click", async () => {location.href = `#/planIntegrante/ver/id=${id}`;});

    mascotas.addEventListener("click", async () => {location.href = `#/planMascota/ver/id=${id}`;});
}