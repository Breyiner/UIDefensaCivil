import * as adjuntarOpc from "../../../Helpers/adjuntarOpciones";
import * as alerta from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import { cargarDatos } from "../../../Helpers/cargarDatos";
import * as localStorage from "../../../Helpers/LocalStorage";

export default async () => {
  const id = location.hash.split("=")[1];
  const form = document.querySelector(".form");
  const boton = document.querySelector(".form__boton");
  const familia = document.querySelector(".input__familia");
  const apellidos = document.querySelector(".input__apellidos");
  const dirrecion = document.querySelector(".input__dirrecion");
  const sector = document.querySelector(".input__sector");
  const sectorNombre = document.querySelector(".input__sectorNombre");
  const telefono = document.querySelector(".input__telefono");
  const calidad = document.querySelector(".input__calidad");
  const botonGeo = document.querySelector(".form__botonGeo");

  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = false;
  }

  cargarDatos(`familyPlans/${id}`, [familia, apellidos], ["id", "last_names"]);
  await adjuntarOpc.adjuntarNoValida(sector, "sectors");
  await adjuntarOpc.adjuntarNoValida(calidad, "housingQualities");
  localStorage.importacionLocalStorage("identificacion");
  botonGeo.disabled = false;

  form.addEventListener("submit", async (e) => {
    window.procesoPeticion = true;
    e.preventDefault();
    boton.disabled = true;
    const datosRegistro = {
      last_names: apellidos.value,
      address: dirrecion.value,
      sector_id: sector.value,
      sector_name: sectorNombre.value,
      landline_phone: telefono.value,
      housing_quality_id: calidad.value,
    };
    console.log(datosRegistro);
    try {
      const data = await api.patch(`familyPlans/identify/${id}`, datosRegistro);
      if (data.success) {
        console.log(data);
        await alerta.alertaOK(data.message);
        const geo = await api.getExiste(`housingInfo/${id}`);
        !geo
          ? await alerta.alertaWarning(
              "Se puede agregar la Georeferenciacion despues...",
            )
          : "";
        window.location.href = `#/home`;
      } else alerta.alertaWarning(data.message, data.errors);
    } catch (error) {
      console.log(error);
      alerta.alertaError(error.errors);
    }
    boton.disabled = false;
    window.procesoPeticion = false;
  });

  window.addEventListener("click", async (e) => {
    if (e.target.matches(".header__botonBack") && !window.procesoPeticion) {
      const pregunta = await alerta.alertaQuest(
        "¿Seguro que quieres volver, perderas el progreso?",    
      );
      if (pregunta.isConfirmed) {
        window.location.href = "#/home";
      }
    }
  });
  botonGeo.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.envioLocalStorage([
      dirrecion,
      sector,
      sectorNombre,
      telefono,
      calidad,
    ]);
    window.location.href = `#/planFamiliar/georeferenciacion/id=${id}`;
  });
};
