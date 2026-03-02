import * as adjuntarOpc from "../../../../helpers/adjuntarOpciones";
import * as alerta from "../../../../helpers/alertas";
import * as api from "../../../../helpers/api";
import * as validacion from "../../../../helpers/validacionInputs";
export default async () => {
  const botonBack = document.getElementById("boton-back");
  const form = document.querySelector(".form");

  const apellidos = document.getElementById("apellidos");
  const zona = document.querySelector(".selector--zona");
  const apartamento = document.querySelector(".selector--apartamento");
  const ciudad = document.querySelector(".selector--ciudad");
  const boton = document.querySelector(".form__boton");

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

  await adjuntarOpc.adjuntarNoValida(zona, "zones");
  await adjuntarOpc.adjuntarNoValida(apartamento, "apartments");
  window.procesoPeticion = false;
  boton.disabled = false;
  
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
    boton.disabled = true;

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
    boton.disabled = false;
    window.procesoPeticion = false;
  });

  apartamento.addEventListener("change", async () => {
    await adjuntarOpc.adjuntarReseteoNoValida(
      ciudad,
      `cities/apartment/${apartamento.value}`,
    );
  });
};
