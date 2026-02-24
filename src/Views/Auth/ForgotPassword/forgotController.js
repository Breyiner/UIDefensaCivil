import * as alerta from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validacionInputs";

export default async () => {
  const form = document.querySelector(".form");
  const corrElectronico = document.getElementById("correoElectronico");
  const boton = document.querySelector(".form__boton");
  let procesoPeticion = false;

  corrElectronico.addEventListener("keydown", (e) => {
    validacion.limiteCaracteres(e, 100);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let validarCorreoElectronico = validacion.validarCorreo(corrElectronico);

    if (validarCorreoElectronico) {
      const datosUsuario = {
        email: corrElectronico.value,
      };
      boton.disabled = true;
      procesoPeticion = true;
      await alerta.alertaWarning(
        "Recuperar Contraseña",
        "Metodo no realizado en el backend",
      );
    }
    boton.disabled = false;
    procesoPeticion = false;
  });

  window.addEventListener("click", async (e) => {
    if (e.target.matches("#volver") && !procesoPeticion)
      window.location.href = "#/login";
  });
};
