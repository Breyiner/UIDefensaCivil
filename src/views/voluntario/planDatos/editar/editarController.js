import * as adjuntarOpc from "../../../../helpers/adjuntarOpciones";
import * as alerta from "../../../../helpers/alertas";
import * as api from "../../../../helpers/api";
import { cargarDatos } from "../../../../helpers/cargarDatos";

// IMPORT COMENTADO DEBIDO A DESUSO 
// import * as localStorage from "../../../../helpers/localStorage";


import * as validacion from "../../../../helpers/validacionInputs";

export default async () => {
  const id = location.hash.split("=")[1];
  const botonBack = document.getElementById("boton-back");

  const form = document.querySelector(".form");
  const boton = document.querySelector(".form__boton");
  const zona = document.querySelector(".selector--zona");
  const apartamento = document.querySelector(".selector--apartamento");
  const ciudad = document.querySelector(".selector--ciudad");
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
    location.href = `#/voluntario-verPlanFamiliar/menu/id=${id}`;
  };

  await adjuntarOpc.adjuntarNoValida(zona, "zones");
  await adjuntarOpc.adjuntarNoValida(apartamento, "departments");
  await adjuntarOpc.adjuntarNoValida(ciudad, "cities");
  await adjuntarOpc.adjuntarNoValida(sector, "sectors");
  await adjuntarOpc.adjuntarNoValida(calidad, "housingQualities");
  await cargarDatos(
    `familyPlans/${id}`,
    [
      familia,
      apellidos,
      zona,
      apartamento,
      ciudad,
      dirrecion,
      sector,
      sectorNombre,
      telefono,
      calidad,
    ],
    [
      "id",
      "last_names",
      "zone_id",
      "department_id",
      "city_id",
      "address",
      "sector_id",
      "sector_name",
      "landline_phone",
      "housing_quality_id",
    ],
  );
  familia.value = `Familia segura N.${familia.value}`;

  boton.disabled = false;
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
  sector.addEventListener("change", async () => {
    validacion.limpiarError(sector);
  });
  sectorNombre.addEventListener("blur", (e) => {
    validacion.limpiarError(sectorNombre);
  });
  telefono.addEventListener("blur", (e) => {
    validacion.limpiarError(telefono);
  });
  calidad.addEventListener("change", async () => {
    validacion.limpiarError(calidad);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    boton.disabled = true;
    window.procesoPeticion = true;

    let validarApellidos = validacion.validarMinimo(apellidos, 3);
    let validarZona = validacion.validarSelect(zona);
    let validarApartamento = validacion.validarSelect(apartamento);
    let validarCiudad = validacion.validarSelect(ciudad);
    let validarDirrecion = validacion.validarMinimo(dirrecion, 10);
    let validarSector = validacion.validarSelect(sector);
    let validarSectorNombre = validacion.validarMinimo(sectorNombre, 3);
    let validarTelefono = validacion.validarSiExiste(telefono, 3);
    let validarCalidad = validacion.validarSelect(calidad);

    if (
      validarApellidos &&
      validarZona &&
      validarApartamento &&
      validarCiudad &&
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
        } else alerta.alertaWarning(data.message, data.errors);
      } catch (error) {
        alerta.alertaError(error.errors);
      }
    }
    boton.disabled = false;
    window.procesoPeticion = false;
  });
  apartamento.addEventListener("change", async () => {
    await adjuntarOpc.adjuntarReseteoNoValida(
      ciudad,
      `cities/department/${apartamento.value}`,
    );
  });
};
