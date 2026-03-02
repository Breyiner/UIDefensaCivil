import * as alerta from "../../../helpers/alertas";
import * as api from "../../../helpers/api";

export default async () => {
    const dashBoard = await api.get('audits/dashBoardSupervisor');

    const explicaciontitulo = document.querySelector(".explicacion__titulo");
    const nombre = localStorage.getItem("full_name");
    const genero = localStorage.getItem("gender_id");

    if (genero == 2) {
        explicaciontitulo.innerHTML += "a " + nombre;
    } else {
            explicaciontitulo.innerHTML += " " + nombre;
    }

    const planesRecibidos = document.getElementById('planesRecibidos');
    const planesAprobados = document.getElementById('planesAprobados');
    const planesRechazados = document.getElementById('planesRechazados');
    const tiempoAproximado = document.getElementById('tiempoAproximado');

    const botonVoluntarios = document.getElementById("voluntarios");
    const botonPeticiones = document.getElementById("peticiones");
    const botonPlanFamiliar = document.getElementById("planFamiliar");
    const botonEstadistica = document.getElementById("estadisticas");

    planesRecibidos.textContent = dashBoard.pending_plans;
    planesAprobados.textContent = dashBoard.approved_plans;
    planesRechazados.textContent = dashBoard.rejected_plans;
    const tiempo = dashBoard.time_validation;
    let tiempoValidado;
    if (tiempo > 60)
    {
        tiempoValidado = Math.floor(tiempo / 60);
        tiempoValidado += "h"
    }
    else tiempoValidado = tiempo + "m"
    tiempoAproximado.textContent = tiempoValidado

    botonVoluntarios.addEventListener("click", () => {
        window.location.href = `#/supervisor-usuarios/gestion`;
    });
    botonPeticiones.addEventListener("click", () => {
        window.location.href = `#/supervisor-usuarios/peticiones`;
    });
    botonPlanFamiliar.addEventListener("click", () => {
        window.location.href = `#/supervisor-planFamiliar/`;
    });
    botonEstadistica.addEventListener("click", () => {
        window.location.href = `#/supervisor-planFamiliar/estadistica`;
    });
};
