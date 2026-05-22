import * as alerta from "../../../helpers/alertas";
import * as api from "../../../helpers/api";
import * as validacion from "../../../helpers/validacionInputs";

const changePasswordController = () => {

    const form = document.querySelector(".form");
    const passwordInput = document.querySelector(".input_password");
    const confirmInput = document.querySelector(".input_confirm");
    const boton = document.querySelector(".boton");

    let procesoPeticion = false;

    validacion.validadorAutomatico.init(form);

    const subir = async (event) => {

        event.preventDefault();

        if (procesoPeticion) return;

        const emailGuardado = sessionStorage.getItem("reset_email");

        const codigoGuardado = sessionStorage.getItem("reset_code");

        if (!emailGuardado || !codigoGuardado) {
            await alerta.alertaError("Sesión inválida, por favor solicita el código nuevamente.");
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

        // console.log("password:", passwordInput.value);
        // console.log("confirm:", confirmInput.value);
        // console.log("passwordInput element:", passwordInput);

        const data = {
            email: emailGuardado,
            code: codigoGuardado,
            password: passwordInput.value,
            password_confirmation: confirmInput.value
        }

        // console.log("data a enviar:", data);

        if (boton) boton.disabled = true;
        procesoPeticion = true;


        try {

            const respuesta = await api.post("password/reset", data);

            if (!respuesta || !respuesta.success) {
                await alerta.alertaError("No se pudo procesar el cambio de contraseña.");
        
                if (boton) boton.disabled = false;
                procesoPeticion = false;
                return;
            }

            await alerta.alertaOK("Su contraseña ha sido restablecida con éxito. Ya puede iniciar sesión.");

            sessionStorage.removeItem("reset_email");
            sessionStorage.removeItem("reset_code");

            window.location.href = "#/login";
            
        } catch (error) {
            console.error(error);
            await alerta.alertaError("No se pudo procesar el cambio de la contraseña.");
            boton.disabled = false;
            procesoPeticion = false; 
        }


    }

    form.addEventListener("submit", subir)

    const rutasPermitidas = ['#/verificar_codigo', '#/cambiar_password'];

    const limpiarSiSaleDelFlujo = () => {
        if (!rutasPermitidas.includes(location.hash)) {
            sessionStorage.removeItem('reset_email');
            sessionStorage.removeItem('reset_code');
            window.removeEventListener('hashchange', limpiarSiSaleDelFlujo);
        }
    };

    window.addEventListener('hashchange', limpiarSiSaleDelFlujo);
}

export default changePasswordController;