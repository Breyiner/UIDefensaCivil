import * as alerta from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";

export default async() => {
const form = document.querySelector('.form');
const correo = document.querySelector('.input__correo');
const boton = document.querySelector('.form__boton');
let procesoPeticion = false;

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const datosUsuario = {
        email: correo.value,
    };
    boton.disabled = true;
    procesoPeticion = true;
    await alerta.alertaWarning("Recuperar Contraseña","Metodo no realizado en el backend")
    boton.disabled = false;
    procesoPeticion = false;
});

window.addEventListener("click", async (e) => {
    if (e.target.matches("#volver") && !procesoPeticion) window.location.href = '#/login';
});
}