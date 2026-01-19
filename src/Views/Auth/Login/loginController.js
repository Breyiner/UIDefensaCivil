import * as alerta from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";

export const loginController = () => {
const form = document.querySelector('.form');
const correo = document.querySelector('.input__correo');
const contrasena = document.querySelector('.input_contrasena');
const boton = document.querySelector('.form__boton');
if (window.procesoPeticion === undefined) {
    window.procesoPeticion = false;
}
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const datosUsuario = {
        email: correo.value,
        password: contrasena.value
    };
    boton.disabled = true;
    window.procesoPeticion = true;
    const data = await api.post('login',datosUsuario);
    if (data.success)
        {
                console.log(data.data);
                await alerta.alertaOK(data.message)
                window.location.href = '#/home';
        }
    boton.disabled = false;
    window.procesoPeticion = false;
});

window.addEventListener("click", async (e) => {
    if (e.target.matches("#crearCuenta") && !window.procesoPeticion) window.location.href = '#/register';
});
window.addEventListener("click", async (e) => {
    if (e.target.matches("#recuperarContrasena") && !window.procesoPeticion) window.location.href = '#/forgotPassword';
});
}
