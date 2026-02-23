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
    const botonEnviar = document.getElementById("enviar");
    const id = location.hash.split("=")[1];

    // await AccesoPlan(id);

    botonBack.onclick = () => { location.href = `#/voluntario-verPlanFamiliar`; }

    integrante.addEventListener("click", async () => { location.href = `#/voluntario-planIntegrante/ver/id=${id}`; });

    mascotas.addEventListener("click", async () => { location.href = `#/voluntario-planMascota/ver/id=${id}`; });

    factoresRiesgo.addEventListener("click", async () => { location.href = `#/voluntario-planRiesgo/ver/id=${id}`; });

    recursosDisponibles.addEventListener("click", async () => { location.href = `#/planRecursos/ver/id=${id}`; });

    graficosVivienda.addEventListener("click", async () => { location.href = `#/planVivienda/ver/id=${id}`; });

    planAccion.addEventListener("click", async () => { location.href = `#/planAccion/ver/id=${id}`; });

    graficoEntorno.addEventListener("click", async () => { location.href = `#/voluntario-planEntorno/editar/id=${id}`; });

    botonEnviar.addEventListener("click", async () => {
        try {
            const data = await api.patch(`familyPlans/status/${id}`, { status_plan_id: 4 });
            if (data.success) {
                await alerta.alertaOK(data.message)
                window.location.href = `#/voluntario-verPlanFamiliar`;
            }
            else alerta.alertaWarning(data.message, data.errors)
        } catch (error) {
            alerta.alertaError(error.errors);
        }
    });
}