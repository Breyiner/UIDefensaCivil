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
  const tipoDocumento = document.getElementById("tiposDocumento");
  const numDocumento = document.getElementById("numeroDocumento");
  const genero = document.getElementById("generos");
  const nacimiento = document.getElementById("nacimiento");
  const telefono = document.getElementById("telefono");
  const seccional = document.getElementById("seccionales");
  const organizacion = document.getElementById("organizaciones");
  const corrElectronico = document.getElementById("correoElectronico");
  const contrasena = document.getElementById("contrasena");
  const confContrasena = document.getElementById("confirmarContrasena");

  await adjuntarOpc.adjuntarInfo(tipoDocumento,"documentTypesPublic","acronym",);
  await adjuntarOpc.adjuntar(genero, "gendersPublic");
  await adjuntarOpc.adjuntar(seccional, "sectionalsPublic");
  boton.disabled = false;

  validacion.validadorAutomatico.init(form);

  form.addEventListener("submit", async (e) => {
    window.procesoPeticion = true;
    e.preventDefault();
    const confirmacion = await alerta.alertaQuest("¿Seguro que quieres enviar tu peticion?");
    if (!confirmacion.isConfirmed) return;

    const booleanValidacion = validacion.validadorAutomatico.validarTodo(form);
    const validacionContrasena = validacion.validar_igualdad(confContrasena,confContrasena);
    
    if (!booleanValidacion && validacionContrasena)
    {
      window.procesoPeticion = false
      boton.disabled = false;
      return
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
    await adjuntarOpc.adjuntarReseteo(organizacion, `organizationsPublic/sectional/${seccional.value}`);
  });
  window.addEventListener("click", async (e) => {
    if (e.target.matches("#tengoCuenta") && !window.procesoPeticion)
      window.location.href = "#/login";
  });
};
