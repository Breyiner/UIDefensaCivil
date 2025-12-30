import * as alerta from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";

export const loginController = () => {
const app = document.querySelector("#app");
const form = document.querySelector('.form');
const correo = document.querySelector('.input__correo');
const contrasena = document.querySelector('.input_contrasena');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const datosUsuario = {
        email: correo.value,
        password: contrasena.value
    };

    console.log(datosUsuario);
    try {
        const data = await api.postPublic('login',datosUsuario);
        if (data.success)
            {
                await alerta.alertaOK(data.message)
                window.location.href = '#/Logim';
            }
        else alerta.alertaWarning(data.message)

    } catch (error) {
        alerta.alertaError(error);
    }
});

window.addEventListener("click", async (e) => {
    if (e.target.matches("#crearCuenta")) window.location.href = '#/Register';
});
}
