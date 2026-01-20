import * as alerta from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as local from "../../../Helpers/LocalStorage";

export const loginController = () => {
  const form = document.querySelector(".form");
  const correo = document.querySelector(".input__correo");
  const contrasena = document.querySelector(".input_contrasena");
  const boton = document.querySelector(".form__boton");
  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = false;
  }
  local.eliminarLocalStorage();
  local.eliminarCookiesVanilla();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const datosUsuario = {
      email: correo.value,
      password: contrasena.value,
    };
    boton.disabled = true;
    window.procesoPeticion = true;
    const data = await api.post("login", datosUsuario);
    if (data.success) {
      const atributos = data.data;
      localStorage.setItem("full_name", atributos.full_name);
      localStorage.setItem("id", atributos.id);
      localStorage.setItem("permissions", atributos.permissions);
      localStorage.setItem("role_id", atributos.role_id);
      await alerta.alertaOK(data.message);
      window.location.href = "#/home";
    } else {
      await alerta.alertaError("Credenciales Invalidas");
    }
    boton.disabled = false;
    window.procesoPeticion = false;
  });

  window.addEventListener("click", async (e) => {
    if (e.target.matches("#crearCuenta") && !window.procesoPeticion)
      window.location.href = "#/register";
  });
  window.addEventListener("click", async (e) => {
    if (e.target.matches("#recuperarContrasena") && !window.procesoPeticion)
      window.location.href = "#/forgotPassword";
  });
};
