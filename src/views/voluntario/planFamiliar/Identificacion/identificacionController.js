import * as adjuntarOpc from "../../../../helpers/adjuntarOpciones";
import * as alerta from "../../../../helpers/alertas";
import * as api from "../../../../helpers/api";
import { cargarDatos } from "../../../../helpers/cargarDatos";
import * as localStorage from "../../../../helpers/localStorage";

export default async () => {
  const id = location.hash.split("=")[1];
  const botonBack = document.getElementById("boton-back");

  const form = document.querySelector(".form");
  const boton = document.querySelector(".form__boton");
  const botonGeo = document.querySelector(".form__botonGeo");

  const familia = document.getElementById("familiaId");
  const apellidos = document.getElementById("apellidos");
  const dirrecion = document.getElementById("dirrecion");
  const sector = document.querySelector(".selector--sector");
  const sectorNombre = document.getElementById("sectorNombre");
  const telefono = document.getElementById("telefonoFijo");
  const calidad = document.querySelector(".selector--calidadVivienda");

  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = true;
  }
  window.procesoPeticion = true;

  botonBack.onclick = async () => {
    if (window.procesoPeticion) return;
    const confirmacion = await alerta.alertaQuest(
      "¿Seguro que quieres volver? perderás tu progreso",
    );
    if (confirmacion.isConfirmed) location.href = "#/voluntario-home";
  };

  cargarDatos(`familyPlans/${id}`, [familia, apellidos], ["id", "last_names"]);
  await adjuntarOpc.adjuntarNoValida(sector, "sectors");
  await adjuntarOpc.adjuntarNoValida(calidad, "housingQualities");
  familia.value = `Familia segura N.${familia.value}`;
  localStorage.importacionLocalStorage("identificacion");

  boton.disabled = false;
  botonGeo.disabled = false;
  window.procesoPeticion = false;

  apellidos.addEventListener("keydown", (e) => {
    validacion.limiteCaracteres(e, 75);
    validacion.textoConEspacios(e);
  });
  dirrecion.addEventListener("keydown", (e) => {
    validacion.limiteCaracteres(e, 100);
  });
  sectorNombre.addEventListener("keydown", (e) => {
    validacion.limiteCaracteres(e, 50);
  });
  telefono.addEventListener("keydown", (e) => {
    validacion.limiteCaracteres(e, 15);
    validacion.soloNumeros(e);
  });

  apellidos.addEventListener("blur", (e) => {
    validacion.limpiarError(apellidos);
  });
  dirrecion.addEventListener("blur", (e) => {
    validacion.limpiarError(dirrecion);
  });
  sector.addEventListener("change", async () =>{ 
    validacion.limpiarError(sector)
  });
  sectorNombre.addEventListener("blur", (e) => {
    validacion.limpiarError(sectorNombre);
  });
  telefono.addEventListener("blur", (e) => {
    validacion.limpiarError(telefono);
  });
  calidad.addEventListener("change", async () => {
    validacion.limpiarError(calidad)
  });
  
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    boton.disabled = true;
    botonGeo.disabled = true;
    window.procesoPeticion = true;

    let validarApellidos = validacion.validarMinimo(apellidos, 3);
    let validarDirrecion = validacion.validarMinimo(dirrecion, 10);
    let validarSector = validacion.validarSelect(sector);
    let validarSectorNombre = validacion.validarMinimo(sectorNombre, 3);
    let validarTelefono = validacion.validarSiExiste(telefono,3);
    let validarCalidad = validacion.validarSelect(calidad);

    if (
      validarApellidos &&
      validarDirrecion &&
      validarSector &&
      validarSectorNombre &&
      validarTelefono &&
      validarCalidad
    ) {
      const datosRegistro = {
        last_names: apellidos.value,
        address: dirrecion.value,
        sector_id: sector.value,
        sector_name: sectorNombre.value,
        landline_phone: telefono.value,
        housing_quality_id: calidad.value,
      };

      try {
        const data = await api.patch(
          `familyPlans/identify/${id}`,
          datosRegistro,
        );
        if (data.success) {
          await alerta.alertaOK(data.message);
          const geo = await api.getExiste(`housingInfo/${id}`);
          !geo
            ? await alerta.alertaWarning(
                "Se puede agregar la Georeferenciacion despues...",
              )
            : "";
          location.href= `#/voluntario-verPlanFamiliar/menu/id=${id}`;
        } else alerta.alertaWarning(data.message, data.errors);
      } catch (error) {
        alerta.alertaError(error.errors);
      }
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
    location.href = `#/voluntario-planFamiliar/georeferenciacion/id=${id}`;
  });
};
