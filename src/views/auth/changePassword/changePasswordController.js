// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { alertas as alerta } from "@/helpers/index.js";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { api } from "@/helpers/index.js";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { validacionInputs as validacion } from "@/helpers/index.js";

const changePasswordController = () => {
  const form = document.querySelector(".form");
  const passwordInput = document.querySelector(".input_password");
  const confirmInput = document.querySelector(".input_confirm");
  const boton = document.querySelector(".boton");

  const checkPass = document.getElementById("checkPass");
  const labelPass = document.querySelector('label[for="checkPass"]');
  const iconClosePass = labelPass.querySelector(".ri-eye-close-line");
  const iconOpenPass = labelPass.querySelector(".ri-eye-fill");

  labelPass.addEventListener("click", () => {
    if (!checkPass.checked) {
      passwordInput.type = "text";
      iconClosePass.classList.add("oculto");
      iconOpenPass.classList.remove("oculto");
    } else {
      passwordInput.type = "password";
      iconClosePass.classList.remove("oculto");
      iconOpenPass.classList.add("oculto");
    }
  });

  const checkConfirm = document.getElementById("checkConfirm");
  const labelConfirm = document.querySelector('label[for="checkConfirm"]');
  const iconCloseConfirm = labelConfirm.querySelector(".ri-eye-close-line");
  const iconOpenConfirm = labelConfirm.querySelector(".ri-eye-fill");

  labelConfirm.addEventListener("click", () => {
    if (!checkConfirm.checked) {
      confirmInput.type = "text";
      iconCloseConfirm.classList.add("oculto");
      iconOpenConfirm.classList.remove("oculto");
    } else {
      confirmInput.type = "password";
      iconCloseConfirm.classList.remove("oculto");
      iconOpenConfirm.classList.add("oculto");
    }
  });

  let procesoPeticion = false;

  validacion.validadorAutomatico.init(form);

  const subir = async (event) => {
    event.preventDefault();

    if (procesoPeticion) return;

    const emailGuardado = sessionStorage.getItem("reset_email");

    const codigoGuardado = sessionStorage.getItem("reset_code");

    if (!emailGuardado || !codigoGuardado) {
      await alerta.alertaError(
        "Sesión inválida, por favor solicita el código nuevamente.",
      );
      window.location.href = "#/forgot";
      return;
    }

    if (!passwordInput.value) {
      await alerta.alertaError("Ingrese una nueva contraseña.");
      return;
    }

    if (!confirmInput.value) {
      await alerta.alertaError("confirma la contraseña.");
      return;
    }

    if (confirmInput.value !== passwordInput.value) {
      await alerta.alertaError("Las contraseñas no coinciden.");
      return;
    }

    const data = {
      email: emailGuardado,
      code: codigoGuardado,
      password: passwordInput.value,
      password_confirmation: confirmInput.value,
    };

    if (boton) boton.disabled = true;
    procesoPeticion = true;

    try {
      const respuesta = await api.post("password/reset", data);

      if (!respuesta || !respuesta.success) {
        await alerta.alertaError(
          "No se pudo procesar el cambio de contraseña.",
        );

        // sessionStorage.removeItem("reset_code");

        // window.location.href = "#/verificar_codigo";

        if (boton) boton.disabled = false;
        procesoPeticion = false;
        return;
      }

      await alerta.alertaOK(
        "Su contraseña ha sido restablecida con éxito. Ya puede iniciar sesión.",
      );

      sessionStorage.removeItem("reset_email");
      sessionStorage.removeItem("reset_code");

      window.location.href = "#/";
    } catch (error) {
      console.error(error);
      await alerta.alertaError(
        "No se pudo procesar el cambio de la contraseña.",
      );
      boton.disabled = false;
      procesoPeticion = false;
    }
  };

  form.addEventListener("submit", subir);

  const rutasPermitidas = ["#/verificar_codigo", "#/cambiar_password"];

  const limpiarSiSaleDelFlujo = () => {
    if (location.hash !== "#/cambiar_password") {
      sessionStorage.removeItem("reset_code");
      window.removeEventListener("hashchange", limpiarSiSaleDelFlujo);
      return;
    }

    if (!rutasPermitidas.includes(location.hash)) {
      sessionStorage.removeItem("reset_email");
      sessionStorage.removeItem("reset_code");
      window.removeEventListener("hashchange", limpiarSiSaleDelFlujo);
    }
  };

  window.addEventListener("hashchange", limpiarSiSaleDelFlujo);
};

export default changePasswordController;
