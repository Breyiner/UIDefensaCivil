import * as alerta from "../../../../helpers/alertas";
import * as api from "../../../../helpers/api";

export default async () => {
  const botonBack = document.getElementById("boton-back");
  const id = location.hash.split("=")[1];
  const form = document.querySelector(".form");
  const boton = document.querySelector(".form__boton");

  const input = document.getElementById("imagenInput");
  const preview = document.getElementById("preview");
  const imagenTitulo = document.querySelector(".imagen__titulo");
  const TAMANO_MAX_MB = 2; // Tamaño máximo en MB
  const TAMANO_MAX_BYTES = TAMANO_MAX_MB * 1024 * 1024;
  const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"];

  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = true;
  }
  window.procesoPeticion = true;

  botonBack.onclick = async () => {
    if (window.procesoPeticion) return;
    location.href = `#/voluntario-verPlanFamiliar/menu/id=${id}`;
  };

  const existe = await api.getExiste(`housingInfo/${id}`);
  if (existe) {
    const url = await api.getImagen(`housingInfo/${id}`);
    preview.src = await url;
    preview.style.display = "block";
    imagenTitulo.textContent = "Vista previa de la imagen actual";
  }

  window.procesoPeticion = false;
  boton.disabled = false;

  input.addEventListener("change", async () => {
    const file = input.files[0];
    if (!file) return;

    // Validar tipo
    if (!TIPOS_PERMITIDOS.includes(file.type)) {
      input.value = "";
      preview.style.display = "none";
      return alerta.alertaWarning(
        "Formato no permitido. Solo JPG, PNG o WEBP.",
      );
    }

    // Validar tamaño
    if (file.size > TAMANO_MAX_BYTES) {
      input.value = "";
      preview.style.display = "none";
      return alerta.alertaWarning(
        `La imagen no puede superar los ${TAMANO_MAX_MB}MB`,
      );
    }
    
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
    imagenTitulo.textContent = "Vista previa de la imagen seleccionada";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    window.procesoPeticion = true;
    boton.disabled = true;
    const file = input.files[0];
    if (!file) {
      boton.disabled = false;
      window.procesoPeticion = false;
      return alerta.alertaWarning("Selecciona un archivo primero");
    }
    if (file.size > TAMANO_MAX_BYTES) {
      boton.disabled = false;
      window.procesoPeticion = false;
      return alerta.alertaWarning(
        `La imagen no puede superar los ${TAMANO_MAX_MB}MB`,
      );
    }
    const formData = new FormData();
    formData.append("path", file);
    formData.append("family_plan_id", id);

    try {
      if (existe) await api.delet(`housingInfo/${id}`);

      const data = await api.postImagen(`housingInfo`, formData);
      if (data.success) {
        await alerta.alertaOK(data.message);
        location.href = `#/voluntario-verPlanFamiliar/menu/id=${id}`;
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
