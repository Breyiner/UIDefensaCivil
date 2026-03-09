import * as adjuntarOpc from "../../../../helpers/adjuntarOpciones";
import * as alerta from "../../../../helpers/alertas";
import * as api from "../../../../helpers/api";
import { cargarDatos } from "../../../../helpers/cargarDatos";

import * as validacion from "../../../../helpers/validacionInputs";

export default async () => {
  const id = location.hash.split("=")[1];
  const botonBack = document.getElementById("botonBack");

  const form = document.querySelector(".form");
  const botonGuardar = document.getElementById("boton_guardar");
  const zonas = document.getElementById("zonas");
  const departamentos = document.getElementById("departamentos");
  const ciudades = document.getElementById("ciudades");
  const familia = document.getElementById("familiaId");
  const apellidos = document.getElementById("apellidos");
  const dirrecion = document.getElementById("dirrecion");
  const sectores = document.getElementById("sectores");
  const sectorNombre = document.getElementById("sectorNombre");
  const telefono = document.getElementById("telefonoFijo");
  const calidadesVivienda = document.getElementById("calidadesVivienda");

  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = true;
  }
  window.procesoPeticion = true;

  botonBack.onclick = async () => {
    if (window.procesoPeticion) return;
    location.href = `#/voluntario-verPlanFamiliar/menu/id=${id}`;
  };

  await adjuntarOpc.adjuntarNoValida(zonas, "zones");
  await adjuntarOpc.adjuntarNoValida(departamentos, "departments");
  await adjuntarOpc.adjuntarNoValida(ciudades, "cities");
  await adjuntarOpc.adjuntarNoValida(sectores, "sectors");
  await adjuntarOpc.adjuntarNoValida(calidadesVivienda, "housingQualities");
  await cargarDatos(`familyPlans/${id}`,
  [familia,apellidos,zonas,departamentos,ciudades,dirrecion,sectores,sectorNombre,telefono,calidadesVivienda,],
  ["id","last_names","zone_id","department_id","city_id","address","sector_id","sector_name","landline_phone","housing_quality_id",],);
  familia.value = `Familia segura N.${familia.value}`;

  botonGuardar.disabled = false;
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
    validacion.limpiarError(e.target);
  });
  dirrecion.addEventListener("blur", (e) => {
    validacion.limpiarError(e.target);
  });
  sectores.addEventListener("change", async (e) => {
    validacion.limpiarError(e.target);
  });
  sectorNombre.addEventListener("blur", (e) => {
    validacion.limpiarError(e.target);
  });
  telefono.addEventListener("blur", (e) => {
    validacion.limpiarError(e.target);
  });
  calidadesVivienda.addEventListener("change", async (e) => {
    validacion.limpiarError(e.target);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    botonGuardar.disabled = true;
    window.procesoPeticion = true;

    let validarApellidos = validacion.validarMinimo(apellidos, 3);
    let validarZona = validacion.validarSelect(zonas);
    let validarApartamento = validacion.validarSelect(departamentos);
    let validarCiudad = validacion.validarSelect(ciudades);
    let validarDirrecion = validacion.validarMinimo(dirrecion, 10);
    let validarSector = validacion.validarSelect(sectores);
    let validarSectorNombre = validacion.validarMinimo(sectorNombre, 3);
    let validarTelefono = validacion.validarSiExiste(telefono, 3);
    let validarCalidad = validacion.validarSelect(calidadesVivienda);

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
        sector_id: sectores.value,
        sector_name: sectorNombre.value,
        landline_phone: telefono.value,
        housing_quality_id: calidadesVivienda.value,
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
    botonGuardar.disabled = false;
    window.procesoPeticion = false;
  });
  departamentos.addEventListener("change", async () => {
    await adjuntarOpc.adjuntarReseteoNoValida(ciudades,`cities/department/${departamentos.value}`);
  });
};
