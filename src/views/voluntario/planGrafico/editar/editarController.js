import * as alerta from "../../../../helpers/alertas";
import * as api from "../../../../helpers/api";

export default async () => {
  const botonBack = document.getElementById("boton-back");
  const form = document.querySelector(".form");
  const boton = document.querySelector(".form__boton");
  const preview = document.getElementById("preview");
  const id = location.hash.split("=")[1];
  const planId = id.split(",")[0];
  const graficoId = id.split(",")[1];
  const descripcion = document.getElementById("descripcion");

  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = true;
  }
  window.procesoPeticion = true;

  botonBack.onclick = async () => {
    if (window.procesoPeticion) return;
    location.href = `#/voluntario-planGrafico/ver/id=${planId}`;
  };

  window.procesoPeticion = false;
  boton.disabled = false;

  const datosGrafico = await api.get(`housingGraphics/${graficoId}`);
  preview.src = api.urlStorage + "/" + datosGrafico.path;
  descripcion.value = datosGrafico.description;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    window.procesoPeticion = true;
    boton.disabled = true;

    const datosRegistro = {
      description: descripcion.value,
    };

    try {
      const data = await api.patch(`housingGraphics/description/${graficoId}`, datosRegistro);
      if (data.success) {
        await alerta.alertaOK(data.message);
        location.href = `#/voluntario-planGrafico/ver/id=${planId}`;
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
