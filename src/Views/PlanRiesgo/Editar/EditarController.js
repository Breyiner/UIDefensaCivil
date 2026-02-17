import * as api from "../../../Helpers/api";
import * as alerta from "../../../Helpers/alertas";
import * as cargarDatos from "../../../Helpers/cargarDatos";
import * as adjuntarOpc from "../../../Helpers/adjuntarOpciones";

export default async () => {

  const boton = document.querySelector(".form__boton");
  const form = document.querySelector(".form");

  const id = location.hash.split("=")[1];
  const planId = id.split(",")[0];
  const riesgoId = id.split(",")[1];

  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = true;
  }
  window.procesoPeticion = true;

  // Inputs
  const tipoAmenaza = document.querySelector(".input__tipoAmenaza");
  const descripcion = document.querySelector(".input__descripcion");
  const ubicacion = document.querySelector(".input__ubicacion");
  const distancia = document.querySelector(".input__distancia");

  // Select
  await adjuntarOpc.adjuntar(tipoAmenaza, "threatTypes");

  // Cargar datos del riesgo
  await cargarDatos.cargarDatos(
    `riskPlans/${riesgoId}`,
    [tipoAmenaza, descripcion, ubicacion, distancia],
    ["threat_type_id", "description", "location", "distance"]
  );

  window.procesoPeticion = false;
  boton.disabled = false;

  // Submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    window.procesoPeticion = true;
    boton.disabled = true;

    const datosRegistro = {
      threat_type_id: tipoAmenaza.value,
      description: descripcion.value,
      location: ubicacion.value,
      distance: distancia.value,
    };

    try {
      const data = await api.patch(`riskPlans/${riesgoId}`, datosRegistro);

      if (data.success) {
        await alerta.alertaOK(data.message);
        location.href = `#/planRiesgo/ver/id=${planId}`;
      } else {
        alerta.alertaWarning(data.message, data.errors);
      }
    } catch (error) {
      alerta.alertaError(error.errors);
    }

    boton.disabled = false;
    window.procesoPeticion = false;
  });
};
