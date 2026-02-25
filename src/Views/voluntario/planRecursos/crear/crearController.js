import * as api from "../../../../Helpers/api";
import * as alerta from "../../../../Helpers/alertas";
import * as validacion from "../../../../Helpers/validacionInputs";
import * as adjuntarOpc from "../../../../Helpers/adjuntarOpciones";

export default async () => {
  const botonBack = document.getElementById("boton-back");
  const boton = document.querySelector(".form__boton");
  const form = document.querySelector(".form");
  const id = location.hash.split("=")[1];

  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = true;
  }
  window.procesoPeticion = true;

  botonBack.onclick = async () => {
    if (window.procesoPeticion) return;
    const confirmacion = await alerta.alertaQuest(
      "¿Seguro que quieres volver? perderás tu progreso",
    );
    if (confirmacion.isConfirmed)
      location.href = `#/voluntario-planRecursos/ver/id=${id}`;
  };

  // Inputs de texto
  const telefono = document.getElementById("telefono");
  const descripcion = document.getElementById("descripcion");
  const distancia = document.getElementById("distancia");
  const ubicacion = document.getElementById("ubicacion");
  const recurso = document.querySelector(".selector--recursos");
  const servicio = document.getElementById("servicio");
  await adjuntarOpc.adjuntarDouble(recurso, "resources",servicio,'service');

  telefono.addEventListener("keydown", (e) => {
    validacion.limiteCaracteres(e, 10);
    validacion.soloNumeros(e);
  });
  descripcion.addEventListener("keydown", (e) => {
    validacion.limiteCaracteres(e, 200);
  });
  ubicacion.addEventListener("keydown", (e) => {
    validacion.limiteCaracteres(e, 100);
  });
  distancia.addEventListener("keydown", (e) => {
    validacion.limiteCaracteres(e, 5);
    validacion.soloNumeros(e);
  });
  telefono.addEventListener("blur", () => {
    validacion.limpiarError(telefono);
  });
  descripcion.addEventListener("blur", () => {
    validacion.limpiarError(descripcion);
  });
  ubicacion.addEventListener("blur", () => {
    validacion.limpiarError(ubicacion);
  });
  distancia.addEventListener("blur", () => {
    validacion.limpiarError(distancia);
  });
  recurso.addEventListener("change", () => {
    validacion.limpiarError(recurso);
  });
  servicio.addEventListener("blur", () => {
    validacion.limpiarError(servicio);
  });

  window.procesoPeticion = false;
  boton.disabled = false;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    window.procesoPeticion = true;
    boton.disabled = true;

    let validarDescripcion = validacion.validarMinimo(descripcion, 15);
    let validarUbicacion = validacion.validarMinimo(ubicacion, 5);
    let validarDistancia = validacion.validarMinimo(distancia, 1);
    let validarTelefono = validacion.validarMinimo(telefono, 5);
    let validarRecurso = validacion.validarSelect(recurso);
    let validarServicio = validacion.validarVacio(servicio);
    if (
      validarDescripcion &&
      validarUbicacion &&
      validarDistancia &&
      validarTelefono &&
      validarRecurso &&
      validarServicio
    ) {
      const datosRegistro = {
        resource_id: recurso.value,
        description: descripcion.value,
        location: ubicacion.value,
        distance: distancia.value,
        phone: telefono.value,
        family_plan_id: id,
      };
      try {
        const data = await api.post(`availableResources`, datosRegistro);
        if (data.success) {
          await alerta.alertaOK(data.message);
          window.location.href = `#/voluntario-planRecursos/ver/id=${id}`;
        } else alerta.alertaWarning(data.message, data.errors);
      } catch (error) {
        alerta.alertaError(error.errors);
      }
    }
    boton.disabled = false;
    window.procesoPeticion = false;
  });
};
