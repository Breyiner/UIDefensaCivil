import * as alerta from "@/helpers/alertas";
import * as api from "@/helpers/api";
import * as validacion from "@/helpers/validacionInputs";

const verifyCodeController = () => {

    const form = document.querySelector(".form");
    const inputsCodigo = document.querySelectorAll(".code__input")
    const boton = document.querySelector(".form__boton");
    const btnVolver = document.getElementById("volver");

    let procesoPeticion = false;

    inputsCodigo.forEach((input,index) => {

        input.addEventListener("input", (event) => {
            if (input.value.length >= 1) {

                // Cortar por si pegan más de un carácter
                input.value = input.value.slice(0, 1);

                // Mover foco al siguiente input si existe
                if (inputsCodigo[index + 1]) {
                    inputsCodigo[index + 1].focus();
                }
            }
        });

        // Si borra con Backspace, regresar al cuadro anterior
        input.addEventListener("keydown", (event) => {
            if (event.key === "Backspace" &&
                input.value === "" &&
                inputsCodigo[index - 1]) {

                inputsCodigo[index - 1].focus();
            }
        });
    });

    // inputsCodigo.forEach(input => {
    //     input.addEventListener("input", () => {
    //         // Esto imprimirá el estado de los 6 cuadros al tiempo con cada pulsación
    //         const enTiempoReal = Array.from(inputsCodigo).map(i => i.value).join("");
    //     });
    // });

    const subir = async (event) =>{

        event.preventDefault();

        if (procesoPeticion) return;

        // Recuperamos el correo que guardamos con éxito en forgotController.js
        const emailGuardado = sessionStorage.getItem("reset_email");

        if (!emailGuardado) {
            await alerta.alertaError("Sesión inválida, por favor solicita el código nuevamente.");
            window.location.href = "#/forgot";
            return;
        }

        const codigo = Array.from(inputsCodigo).map(i => i.value).join("");

        if (codigo.length !== 6) {
            await alerta.alertaError("Por favor, ingrese el código completo de 6 dígitos.");
            return;
        }

        const data = {

            code: codigo,
            email: emailGuardado
        }

        boton.disabled = true;
        procesoPeticion = true;

        try {

            const respuesta = await api.post("password/verify", data);

            if (!respuesta || !respuesta.success) {
                await alerta.alertaError("El código ingresado es incorrecto o ya expiró.");
        
                boton.disabled = false;
                procesoPeticion = false;

                return;
            }

            sessionStorage.setItem("reset_code", codigo);

            await alerta.alertaOK("Código verificado exitosamente. Proceda a cambiar su contraseña.");

            window.location.href = "#/cambiar_password";
            
        } catch (error) {
            console.error(error);
            await alerta.alertaError("No se pudo procesar la verificación en este momento.");
            boton.disabled = false;
            procesoPeticion = false; 
        }

    }
    
    form.addEventListener("submit", subir)

    const reenviar = async (event) =>{

        event.preventDefault();

        if (procesoPeticion) return;

        // Recuperamos el correo que guardamos con éxito en forgotController.js
        const emailGuardado = sessionStorage.getItem("reset_email");

        if (!emailGuardado) {
            await alerta.alertaError("Sesión inválida, por favor solicita el código nuevamente.");
            window.location.href = "#/forgot";
            return;
        }

        procesoPeticion = true;
        boton.disabled = true;

        try {

            const respuesta = await api.post("password/resend", { email: emailGuardado });

            if (!respuesta || !respuesta.success) {
                await alerta.alertaError("No se pudo reenviar el código.");
                boton.disabled = false;
                procesoPeticion = false;
                return;
            }

            await alerta.alertaOK("Se ha reenviado un nuevo código de 6 dígitos a su correo electrónico.");

            inputsCodigo.forEach(input => input.value = "");
            inputsCodigo[0].focus();

            boton.disabled = false;
            procesoPeticion = false;
            
        } catch (error) {

            console.error(error);
            await alerta.alertaError("Error de conexión al intentar reenviar el código.");
            boton.disabled = false;
            procesoPeticion = false;
        }
    }

    btnVolver.addEventListener("click", reenviar)

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

export default verifyCodeController;