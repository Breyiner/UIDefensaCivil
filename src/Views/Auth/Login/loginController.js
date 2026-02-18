import * as alerta from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as local from "../../../Helpers/LocalStorage";

export default async() => {
  const form = document.querySelector(".form");
  const correo = document.querySelector(".input__correo");
  const contrasena = document.querySelector(".input_contrasena");
  const boton = document.querySelector(".form__boton");
  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = false;
  }
  // local.eliminarLocalStorage();
  // local.eliminarCookiesVanilla();
  
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
      localStorage.setItem("sectional_id", atributos.sectional_id);
      await alerta.alertaOK(data.message);
      if (atributos.role_id == 1) window.location.href = "#/administrador-home";
      else if (atributos.role_id == 2) window.location.href = "#/home";
      else if (atributos.role_id == 3) window.location.href = "#/home";
      else window.location.href = "#/login";
    } else {
      await alerta.alertaError(data.message);
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
