import * as alerta from "../../../helpers/alertas";
import * as api from "../../../helpers/api"

export default async () => {
    const botonBack = document.getElementById("boton-back");

    botonBack.onclick = () => {
        history.back();
    };

    window.addEventListener("click", async (e) => {
        if (e.target.matches("#cerrarSesion")) {
            const pregunta = await alerta.alertaQuest('¿Seguro que quieres cerrar sesion?');
            if (pregunta.isConfirmed) {
                await api.post('logout');
                window.location.href = '#/login';
                localStorage.clear();
            }
        }
    });
}
