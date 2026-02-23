import * as alerta from "../../../../Helpers/alertas";
import * as api from "../../../../Helpers/api";

export default async () => {
  const botonBack = document.getElementById("boton-back");
  const id = location.hash.split("=")[1];
  const form = document.querySelector(".form");
  const boton = document.querySelector(".form__boton");

  const input = document.getElementById("imagenInput");
  const preview = document.getElementById("preview");

  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = true;
  }
  window.procesoPeticion = true;
  
  botonBack.onclick = async() => {
  if(window.procesoPeticion) return;
  const confirmacion = await alerta.alertaQuest("¿Seguro que quieres volver?");
  if (confirmacion.isConfirmed) location.href = `#/voluntario-planFamiliar/identificacion/id=${id}`;};

  const existe = await api.getExiste(`housingInfo/${id}`);
  if (existe) {
    const url = await api.getImagen(`housingInfo/${id}`);
    preview.src = await url;
    preview.style.display = "block";
  }

  window.procesoPeticion = false;
  boton.disabled = false;

  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;

    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";

    const formData = new FormData();
    formData.append("imagen", file);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    window.procesoPeticion = true;
    boton.disabled = true;
    const file = input.files[0];
    if (!file) return alerta.alertaWarning("Selecciona un archivo primero");
    const formData = new FormData();
    formData.append("path", file);
    formData.append("family_plan_id", id);

    try {
      if (existe) await api.delet(`housingInfo/${id}`);

      const data = await api.postImagen(`housingInfo`, formData);
      if (data.success) {
        await alerta.alertaOK(data.message);
        location.replace(`#/voluntario-planFamiliar/identificacion/id=${id}`);
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
