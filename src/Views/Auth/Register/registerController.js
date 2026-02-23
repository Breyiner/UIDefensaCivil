import * as alerta from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as adjuntarOpc from "../../../Helpers/adjuntarOpciones";
import * as validacion from "../../../Helpers/validacionInputs";

export default async () => {
  const form = document.querySelector(".form");
  const boton = document.querySelector(".form__boton");
  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = false;
  }

  const nombres = document.getElementById("nombres");
  const apellidos = document.getElementById("apellidos");
  const tipoDocumento = document.querySelector(".selector--tipoDocumento");
  const numDocumento = document.getElementById("numeroDocumento");
  const genero = document.querySelector(".selector--genero");
  const nacimiento = document.querySelector(".input__nacimiento");
  const telefono = document.querySelector(".input__telefono");
  const seccional = document.querySelector(".input__seccional");
  const organizacion = document.querySelector(".input__organizacion");
  const corrElectronico = document.querySelector(".input__corrElectronico");
  const contrasena = document.querySelector(".input__contrasena");
  const confContrasena = document.querySelector(".input__confContrasena");

  await adjuntarOpc.adjuntarInfo(tipoDocumento,"documentTypesPublic","acronym",);
  await adjuntarOpc.adjuntar(genero, "gendersPublic");
  await adjuntarOpc.adjuntar(seccional, "sectionalsPublic");
  boton.disabled = false;

  nombres.addEventListener("keydown", (e) => {
    validacion.limiteCaracteres(e, 50);
    validacion.textoConEspacios(e);
  });
  apellidos.addEventListener("keydown", (e) => {
    validacion.limiteCaracteres(e, 50);
    validacion.textoConEspacios(e);
  });
  numDocumento.addEventListener("keydown", (e) => {
    validacion.limiteCaracteres(e, 20);
    validacion.soloNumeros(e, 50);
  });

  form.addEventListener("submit", async (e) => {
    window.procesoPeticion = true;
    e.preventDefault();

    let validarNombres = validacion.validarMinimo(nombres, 3);
    let validarApellidos = validacion.validarMinimo(apellidos, 3);
    let validarTipoDocumento = validacion.validarSelect(tipoDocumento);
    let validarNumeroDocumento = validacion.validarMinimo(numDocumento,5);
    let validarGenero = validacion.validarSelect(genero);
    
    if (validarNombres && validarApellidos && validarTipoDocumento && validarNumeroDocumento) {
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
    }
    boton.disabled = false;
    window.procesoPeticion = false;
  });

  seccional.addEventListener("change", async () => {
    await adjuntarOpc.adjuntarReseteo(
      organizacion,
      `organizationsPublic/sectional/${seccional.value}`,
    );
  });
  window.addEventListener("click", async (e) => {
    if (e.target.matches("#tengoCuenta") && !window.procesoPeticion)
      window.location.href = "#/login";
  });
};
