import * as adjuntarOpc from "../../../../helpers/adjuntarOpciones";
import * as alerta from "../../../../helpers/alertas";
import * as api from "../../../../helpers/api";
import * as validacion from "../../../../helpers/validacionInputs";
export default async () => {
  const botonBack = document.getElementById("botonBack");
  const form = document.querySelector(".form");

  const apellidos = document.getElementById("apellidos");
  const zona = document.getElementById("zonas");
  const apartamento = document.getElementById("departamentos");
  const ciudad = document.getElementById("ciudades");
  const botonSiguiente = document.getElementById("boton_siguiente");

  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = true;
  }
  window.procesoPeticion = true;

  botonBack.onclick = async () => {
    if (window.procesoPeticion) return;
    const confirmacion = await alerta.alertaQuest("¿Seguro que quieres volver? perderás tu progreso",);
    if (confirmacion.isConfirmed) location.href = "#/voluntario-home";
  };

  await adjuntarOpc.adjuntarNoValida(zona, "zones");
  await adjuntarOpc.adjuntarNoValida(apartamento, "departments");
  window.procesoPeticion = false;
  botonSiguiente.disabled = false;
  
  apellidos.addEventListener("keydown", (e) => {
    validacion.limiteCaracteres(e, 75);
    validacion.textoConEspacios(e);
  });
  apellidos.addEventListener("blur", (e) => {
    validacion.limpiarError(apellidos);
  });
  zona.addEventListener("change", async () =>{ 
    validacion.limpiarError(zona)
  });
  apartamento.addEventListener("change", async () => {
    validacion.limpiarError(apartamento)
  });
  ciudad.addEventListener("change", async () => {
    validacion.limpiarError(ciudad)
  });
  
  form.addEventListener("submit", async (e) => {
    window.procesoPeticion = true;
    e.preventDefault();
    botonSiguiente.disabled = true;

    let validarApellidos = validacion.validarMinimo(apellidos, 3);
    let validarZona = validacion.validarSelect(zona);
    let validarApartamento = validacion.validarSelect(apartamento);
    let validarCiudad = validacion.validarSelect(ciudad);

    if (
      validarApellidos &&
      validarZona &&
      validarApartamento &&
      validarCiudad
    ) {
      const datosRegistro = {
        last_names: apellidos.value,
        zone_id: zona.value,
        city_id: ciudad.value,
        sectional_id: localStorage.getItem("sectional_id"),
        user_id: localStorage.getItem("id"),
      };

      const autorizacion = await alerta.AutorizacionDatos();
      if (autorizacion.isConfirmed) {
        try {
          const data = await api.post("familyPlans", datosRegistro);
          if (data.success) {
            await alerta.alertaOK(data.message);
            window.location.href = `#/voluntario-planFamiliar/testVunerabilidad/id=${data.data.id}`;
          } else alerta.alertaWarning(data.message, data.errors);
        } catch (error) {
          alerta.alertaError(error.errors);
        }
      }
    }
    botonSiguiente.disabled = false;
    window.procesoPeticion = false;
  });

  apartamento.addEventListener("change", async () => {
    await adjuntarOpc.adjuntarReseteoNoValida(ciudad,`cities/department/${apartamento.value}`,);
  });
};
