import {eliminarCookies} from "../../Helpers/eliminarCookies";
import * as alerta from "../../Helpers/alertas";

export const homeController = () => {
window.addEventListener("click", async (e) => {
    if (e.target.matches("#cerrarSesion")) 
        {
            const pregunta = await alerta.alertaQuest('¿Seguro que quieres cerrar sesion?');
            if (pregunta.isConfirmed)
            {
              window.location.href = '#/login';
              eliminarCookies();
            }
        }
    if (e.target.matches("#nuevoPlan"))
    {
      window.location.href = '#/planFamiliar/Crear';
    }
});
}