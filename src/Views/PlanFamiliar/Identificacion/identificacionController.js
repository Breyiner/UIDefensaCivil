import * as adjuntarOpc from "../../../Helpers/adjuntarOpciones";
import * as alerta from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import { cargarDatos } from "../../../Helpers/cargarDatos";
import * as localStorage from "../../../Helpers/LocalStorage";

export default async () => {
  const id = location.hash.split("=")[1];
  const botonBack = document.getElementById("boton-back");

  const form = document.querySelector(".form");
  const boton = document.querySelector(".form__boton");
  const botonGeo = document.querySelector(".form__botonGeo");

  const familia = document.querySelector(".input__familia");
  const apellidos = document.querySelector(".input__apellidos");
  const dirrecion = document.querySelector(".input__dirrecion");
  const sector = document.querySelector(".input__sector");
  const sectorNombre = document.querySelector(".input__sectorNombre");
  const telefono = document.querySelector(".input__telefono");
  const calidad = document.querySelector(".input__calidad");

  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = true;
  }
  window.procesoPeticion = true;

  botonBack.onclick = async () => {
  if (window.procesoPeticion) return;
  const confirmacion = await alerta.alertaQuest("¿Seguro que quieres volver? perderás tu progreso",);
  if (confirmacion.isConfirmed) location.href = "#/home";};

  cargarDatos(`familyPlans/${id}`, [familia, apellidos], ["id", "last_names"]);
  await adjuntarOpc.adjuntarNoValida(sector, "sectors");
  await adjuntarOpc.adjuntarNoValida(calidad, "housingQualities");
  familia.value = `Familia segura N.${familia.value}`;
  localStorage.importacionLocalStorage("identificacion");

  boton.disabled = false;
  botonGeo.disabled = false;
  window.procesoPeticion = false;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    boton.disabled = true;
    botonGeo.disabled = true;
    window.procesoPeticion = true;

    const datosRegistro = {
      last_names: apellidos.value,
      address: dirrecion.value,
      sector_id: sector.value,
      sector_name: sectorNombre.value,
      landline_phone: telefono.value,
      housing_quality_id: calidad.value,
    };

    try {
      const data = await api.patch(`familyPlans/identify/${id}`, datosRegistro);
      if (data.success) {
        await alerta.alertaOK(data.message);
        const geo = await api.getExiste(`housingInfo/${id}`);
        !geo
          ? await alerta.alertaWarning(
              "Se puede agregar la Georeferenciacion despues...",
            )
          : "";
        location.replace(`#/home`);
      } else alerta.alertaWarning(data.message, data.errors);
    } catch (error) {
      alerta.alertaError(error.errors);
    }

    boton.disabled = false;
    botonGeo.disabled = false;
    window.procesoPeticion = false;
  });

  botonGeo.addEventListener("click", (e) => {
    if (window.procesoPeticion) return;
    e.preventDefault();
    localStorage.envioLocalStorage([
      dirrecion,
      sector,
      sectorNombre,
      telefono,
      calidad,
    ]);
    location.replace(`#/planFamiliar/georeferenciacion/id=${id}`);
  });
};
