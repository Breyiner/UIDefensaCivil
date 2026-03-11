import * as alerta from "../../../helpers/alertas";
import * as api from "../../../helpers/api";
import * as validacion from "../../../helpers/validacionInputs";

export default async () => {
  const form = document.querySelector(".form");
  const correo = document.getElementById("correo");
  const contrasena = document.getElementById("contrasena");
  const botonLogin = document.getElementById("botonLogin");
  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = false;
  }
  window.procesoPeticion = false;

  validacion.validadorAutomatico.init(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const booleanValidacion = validacion.validadorAutomatico.validarTodo(form);
    if (!booleanValidacion) {
      window.procesoPeticion = false;
      botonLogin.disabled = false;
      return;
    }

    const datosUsuario = {
      email: correo.value,
      password: contrasena.value,
    };

    botonLogin.disabled = true;
    window.procesoPeticion = true;
    const data = await api.post("login", datosUsuario);
    if (data.success) {
      const atributos = data.data;
      localStorage.setItem("full_name", atributos.full_name);
      localStorage.setItem("id", atributos.id);
      localStorage.setItem("permissions", atributos.permissions);
      localStorage.setItem("role_id", atributos.role_id);
      localStorage.setItem("sectional_id", atributos.sectional_id);
      localStorage.setItem("gender_id", atributos.gender);
      await alerta.alertaOK(data.message);
      if (atributos.role_id == 1) window.location.href = "#/administrador-home";
      else if (atributos.role_id == 2)
        window.location.href = "#/supervisor-home";
      else if (atributos.role_id == 3)
        window.location.href = "#/voluntario-home";
      else window.location.href = "#/login";
    } else {
      await alerta.alertaError(data.message);
    }
    botonLogin.disabled = false;
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
