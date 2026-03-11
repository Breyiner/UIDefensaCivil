import * as alerta from "../../../helpers/alertas";
import * as api from "../../../helpers/api";
import * as validacion from "../../../helpers/validacionInputs";

export default async () => {
  const form = document.querySelector(".form");
  const corrElectronico = document.getElementById("correoElectronico");
  const boton = document.querySelector(".form__boton");
  let procesoPeticion = false;

  validacion.validadorAutomatico.init(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const booleanValidacion = validacion.validadorAutomatico.validarTodo(form);
    
    if (!booleanValidacion)
    {
      window.procesoPeticion = false
      boton.disabled = false;
      return
    }

    const datosUsuario = {
      email: corrElectronico.value,
    };
    console.log(datosUsuario);
    boton.disabled = true;
    procesoPeticion = true;
    await alerta.alertaWarning(
      "Recuperar Contraseña",
      "Metodo no realizado en el backend",
    );

    boton.disabled = false;
    procesoPeticion = false;
  });

  window.addEventListener("click", async (e) => {
    if (e.target.matches("#volver") && !procesoPeticion)
      window.location.href = "#/login";
  });
};
