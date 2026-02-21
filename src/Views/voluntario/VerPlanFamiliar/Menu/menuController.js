import * as api from "../../../../Helpers/api";
import * as alerta from "../../../../Helpers/alertas";
import AccesoPlan from "../../../../Helpers/accesoPlan";

export default async () => {
    const botonBack = document.getElementById("boton-back");
    const integrante = document.getElementById("integrantes");
    const mascotas = document.getElementById("mascotas");
    const factoresRiesgo = document.getElementById("factoresRiesgo");
    const recursosDisponibles = document.getElementById("recursosDisponibles");
    const graficosVivienda = document.getElementById("graficosVivienda");
    const planAccion = document.getElementById("planAccion");
    const graficoEntorno = document.getElementById("graficoEntorno");
    const id = location.hash.split("=")[1];
    
    // await AccesoPlan(id);

    botonBack.onclick = () => {location.href = `#/voluntario-verPlanFamiliar`;}

    integrante.addEventListener("click", async () => {location.href = `#/voluntario-planIntegrante/ver/id=${id}`;});

    mascotas.addEventListener("click", async () => {location.href = `#/voluntario-planMascota/ver/id=${id}`;});

    factoresRiesgo.addEventListener("click", async () => {location.href = `#/voluntario-planRiesgo/ver/id=${id}`;});

    recursosDisponibles.addEventListener("click", async () => {location.href = `#/planRecursos/ver/id=${id}`;});

    graficosVivienda.addEventListener("click", async () => {location.href = `#/planVivienda/ver/id=${id}`;});

    planAccion.addEventListener("click", async () => {location.href = `#/planAccion/ver/id=${id}`;});

<<<<<<< HEAD
    graficoEntorno.addEventListener("click", async () => {location.href = `#/planEntorno/editar/id=${id}`;});
=======
    graficoEntorno.addEventListener("click", async () => {location.href = `#/voluntario-planEntorno/editar/id=${id}`;});
>>>>>>> valentina
}