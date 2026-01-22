import * as alerta from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as adjuntarOpc from "../../../Helpers/adjuntarOpciones";
export const registerController = async () => {
  const form = document.querySelector(".form");
  const boton = document.querySelector(".form__boton");
  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = false;
  }

  const nombres = document.querySelector(".input__nombres");
  const apellidos = document.querySelector(".input__apellidos");
  const tipoDocumento = document.querySelector(".input__tipoDocumento");
  const numDocumento = document.querySelector(".input__numDocumento");
  const genero = document.querySelector(".input__genero");
  const nacimiento = document.querySelector(".input__nacimiento");
  const telefono = document.querySelector(".input__telefono");
  const seccional = document.querySelector(".input__seccional");
  const organizacion = document.querySelector(".input__organizacion");
  const corrElectronico = document.querySelector(".input__corrElectronico");
  const contrasena = document.querySelector(".input__contrasena");
  const confContrasena = document.querySelector(".input__confContrasena");

  adjuntarOpc.adjuntarInfo(tipoDocumento, "documentTypesPublic", "acronym");
  adjuntarOpc.adjuntar(genero, "gendersPublic");
  adjuntarOpc.adjuntar(seccional, "sectionalsPublic");
  boton.disabled = false;

  form.addEventListener("submit", async (e) => {
    window.procesoPeticion = true;
    e.preventDefault();
    boton.disabled = true;
    if (contrasena.value != confContrasena.value) {
      window.procesoPeticion = false;
      boton.disabled = false;
      return alerta.alertaWarning("Las contraseñas no coinciden");
    }
    const datosRegistro = {
      names: nombres.value,
      last_names: apellidos.value,
      birth_date: nacimiento.value,
      document_type_id: tipoDocumento.value,
      document_number: numDocumento.value,
      phone: telefono.value,
      gender_id: genero.value,
      organization_id: organizacion.value,
      email: corrElectronico.value,
      password: contrasena.value,
    };
    try {
      const data = await api.post("register", datosRegistro);
      if (data.success) {
        await alerta.alertaOK(data.message);
        window.location.href = "#/login";
      } else alerta.alertaWarning(data.message, data.errors);
    } catch (error) {
      alerta.alertaError(error);
    }
    boton.disabled = false;
    window.procesoPeticion = false;
  });
  seccional.addEventListener("change", async () => {
    adjuntarOpc.adjuntarReseteo(
      organizacion,
      `organizationsPublic/sectional/${seccional.value}`,
    );
  });
  window.addEventListener("click", async (e) => {
    if (e.target.matches("#tengoCuenta") && !window.procesoPeticion)
      window.location.href = "#/login";
  });
};
