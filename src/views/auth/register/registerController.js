import * as alerta from "../../../helpers/alertas";
import * as api from "../../../helpers/api";
import * as adjuntarOpc from "../../../helpers/adjuntarOpciones";
import * as validacion from "../../../helpers/validacionInputs";

export default async () => {
  const form = document.querySelector(".form");
  const boton = document.querySelector(".form__boton");
  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = false;
  }
  window.procesoPeticion = false;

  const nombres = document.getElementById("nombres");
  const apellidos = document.getElementById("apellidos");
  const tipoDocumento = document.querySelector(".selector--tipoDocumento");
  const numDocumento = document.getElementById("numeroDocumento");
  const genero = document.querySelector(".selector--genero");
  const nacimiento = document.getElementById("nacimiento");
  const telefono = document.getElementById("telefono");
  const seccional = document.querySelector(".selector--seccional");
  const organizacion = document.querySelector(".selector--organizacion");
  const corrElectronico = document.getElementById("correoElectronico");
  const contrasena = document.getElementById("contrasena");
  const confContrasena = document.getElementById("confirmarContrasena");

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
    validacion.soloNumeros(e);
  });
  telefono.addEventListener("keydown", (e) => {
    validacion.limiteCaracteres(e, 10);
    validacion.soloNumeros(e);
  });
  corrElectronico.addEventListener("keydown", (e) => {
    validacion.limiteCaracteres(e, 100);
  });
  contrasena.addEventListener("keydown", (e) => {
    validacion.limiteCaracteres(e, 20);
  });
  confContrasena.addEventListener("keydown", (e) => {
    validacion.limiteCaracteres(e, 20);
  });

  nombres.addEventListener("blur", (e) => {
    validacion.limpiarError(nombres);
  });
  apellidos.addEventListener("blur", (e) => {
    validacion.limpiarError(apellidos);
  });
  tipoDocumento.addEventListener("change", (e) => {
    validacion.limpiarError(tipoDocumento);
  });
  numDocumento.addEventListener("blur", (e) => {
    validacion.limpiarError(numDocumento);
  });
  genero.addEventListener("change", (e) => {
    validacion.limpiarError(genero);
  });
  nacimiento.addEventListener("blur", (e) => {
    validacion.limpiarError(nacimiento);
  });
  telefono.addEventListener("blur", (e) => {
    validacion.limpiarError(telefono);
  });
  seccional.addEventListener("change", (e) => {
    validacion.limpiarError(seccional);
  });
  organizacion.addEventListener("change", (e) => {
    validacion.limpiarError(organizacion);
  });
  corrElectronico.addEventListener("blur", (e) => {
    validacion.limpiarError(corrElectronico);
  });
  contrasena.addEventListener("blur", (e) => {
    validacion.limpiarError(contrasena);
  });
  confContrasena.addEventListener("blur", (e) => {
    validacion.limpiarError(confContrasena);
  });

  form.addEventListener("submit", async (e) => {
    window.procesoPeticion = true;
    e.preventDefault();

    let validarNombres = validacion.validarMinimo(nombres, 3);
    let validarApellidos = validacion.validarMinimo(apellidos, 3);
    let validarTipoDocumento = validacion.validarSelect(tipoDocumento);
    let validarNumeroDocumento = validacion.validarMinimo(numDocumento,5);
    let validarGenero = validacion.validarSelect(genero);
    let validarNacimiento = validacion.validarMayorDeEdad(nacimiento);
    let validarTelefono = validacion.validarMinimo(telefono, 7);
    let validarSeccional = validacion.validarSelect(seccional);
    let validarOrganizacion = validacion.validarSelect(organizacion);
    let validarCorreoElectronico = validacion.validarCorreo(corrElectronico);
    let validarContrasena = validacion.validarPassword(contrasena);
    let validarConfContrasena = validacion.validarIgualdad(confContrasena,contrasena,);
    
    if (validarNombres && 
      validarApellidos && 
      validarTipoDocumento && 
      validarNumeroDocumento && 
      validarGenero && 
      validarNacimiento &&
      validarTelefono &&
      validarSeccional &&
      validarOrganizacion &&
      validarCorreoElectronico &&
      validarContrasena &&
      validarConfContrasena) {
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
    await adjuntarOpc.adjuntarReseteo(organizacion, `organizationsPublic/sectional/${seccional.value}`);
  });
  window.addEventListener("click", async (e) => {
    if (e.target.matches("#tengoCuenta") && !window.procesoPeticion)
      window.location.href = "#/login";
  });
};
