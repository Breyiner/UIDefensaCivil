import * as api from "../../../../Helpers/api";
import * as alerta from "../../../../Helpers/alertas";
import { cargarDatos } from "../../../../Helpers/cargarDatos";
import AccesoPlan from "../../../../Helpers/accesoPlan";

export default async () => {
  const botonBack = document.getElementById("boton-back");
  const nombreFamilia = document.querySelector(".informacion__nombreFamiliar");
  const datosPrincipales = document.getElementById("datosPrincipales");
  const integrante = document.getElementById("integrantes");
  const mascotas = document.getElementById("mascotas");
  const factoresRiesgo = document.getElementById("factoresRiesgo");
  const recursosDisponibles = document.getElementById("recursosDisponibles");
  const graficosVivienda = document.getElementById("graficosVivienda");
  const planAccion = document.getElementById("planAccion");
  const graficoEntorno = document.getElementById("graficoEntorno");
  const comentarios = document.getElementById("comentarios");
  const botonEnviar = document.getElementById("enviar");
  const verPDF = document.getElementById("verPDF");

  const id = location.hash.split("=")[1];
  await AccesoPlan(id);
  const planFamiliar = await api.get(`familyPlans/${id}`);

  nombreFamilia.textContent += ` ${planFamiliar.last_names}`;

  botonBack.onclick = () => {
    location.href = `#/voluntario-verPlanFamiliar`;
  };

  datosPrincipales.addEventListener("click", async () => {
    location.href = `#/voluntario-planDatos/ver/id=${id}`;
  });

  integrante.addEventListener("click", async () => {
    location.href = `#/voluntario-planIntegrante/ver/id=${id}`;
  });

  mascotas.addEventListener("click", async () => {
    location.href = `#/voluntario-planMascota/ver/id=${id}`;
  });

  factoresRiesgo.addEventListener("click", async () => {
    location.href = `#/voluntario-planRiesgo/ver/id=${id}`;
  });

  recursosDisponibles.addEventListener("click", async () => {
    location.href = `#/voluntario-planRecursos/ver/id=${id}`;
  });

  graficoEntorno.addEventListener("click", async () => {
    location.href = `#/voluntario-planEntorno/editar/id=${id}`;
  });

  graficosVivienda.addEventListener("click", async () => {
    location.href = `#/voluntario-planVivienda/ver/id=${id}`;
  });

  planAccion.addEventListener("click", async () => {
    location.href = `#/voluntario-planAccion/antes/id=${id}`;
  });

  botonEnviar.addEventListener("click", async () => {
    const confirmacion = await alerta.alertaQuest(
      "¿Seguro que ya deseas enviar tu plan familiar?",
    );
    if (confirmacion.isConfirmed) {
      try {
        const data = await api.patch(`familyPlans/status/${id}`, {
          status_plan_id: 4,
        });
        if (data.success) {
          await alerta.alertaOK(data.message);
          window.location.href = `#/voluntario-verPlanFamiliar`;
        } else alerta.alertaWarning(data.message, data.errors);
      } catch (error) {
        alerta.alertaError(error.errors);
      }
    }
  });

  verPDF.addEventListener("click", () => {
    // Abre el PDF en otra pestaña
    api.getPdf(`familyPlans/pdf/${id}`, `plan_${id}.pdf`);
  });

  if (planFamiliar.comentary) comentarios.classList.remove("invisible");
  comentarios.addEventListener("click", async () => {
    const htmlModal = `
        <div class="explicacion modal">
          <p class="explicacion__titulo">Rechazado con solicitud de cambios</p>
          <p class="explicacion__subtitulo">Este plan familiar fue rechazado con solicitud de cambios y en el siguiente texto se especifica cuales fueron esos errores</p>
        </div>
        <div class="explicacion_subtitulo">${planFamiliar.comentary}</div>`;
    alerta.Ver(htmlModal, false, false, null, null);
  });
};
