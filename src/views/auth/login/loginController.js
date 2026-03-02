import * as alerta from "../../../helpers/alertas";
import * as api from "../../../helpers/api";
import * as local from "../../../helpers/localStorage";
import * as validacion from "../../../helpers/validacionInputs";

export default async () => {
  const form = document.querySelector(".form");
  const correo = document.getElementById("correo");
  const contrasena = document.getElementById("contrasena");
  const boton = document.querySelector(".form__boton");
  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = false;
  }
  window.procesoPeticion = false;
  
  correo.addEventListener("keydown", (e) => {
    validacion.limiteCaracteres(e, 40)
  });

  contrasena.addEventListener("keydown", (e) => {
    validacion.limiteCaracteres(e, 40)
  });
  correo.addEventListener("blur", (e) => {
    validacion.limpiarError(correo);
  });
  contrasena.addEventListener("blur", (e) => {
    validacion.limpiarError(contrasena);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let validarCorreo = validacion.validarCorreo(correo);
    let validarContrasena = validacion.validarMinimo(contrasena,8);
    
    if (validarCorreo && validarContrasena){
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
        localStorage.setItem("gender_id", atributos.gender);
        await alerta.alertaOK(data.message);
        if (atributos.role_id == 1) window.location.href = "#/administrador-home";
        else if (atributos.role_id == 2) window.location.href = "#/supervisor-home";
        else if (atributos.role_id == 3) window.location.href = "#/voluntario-home";
        else window.location.href = "#/login";
      } else {
        await alerta.alertaError(data.message);
      }
      boton.disabled = false;
      window.procesoPeticion = false;
    }
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
