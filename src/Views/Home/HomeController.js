import * as alerta from "../../Helpers/alertas";
import * as api from "../../Helpers/api"
import * as cookie from "../../Helpers/Cookies"

export const homeController = () => {
const a = cookie.obtener('access_token')
const urlDecodificada = decodeURIComponent(a);
console.log(urlDecodificada);
console.log("original:"+a);


window.addEventListener("click", async (e) => {
    if (e.target.matches("#cerrarSesion")) 
        {
            const pregunta = await alerta.alertaQuest('¿Seguro que quieres cerrar sesion?');
            if (pregunta.isConfirmed)
            {
              await api.post('logout')
            }
        }
    if (e.target.matches("#nuevoPlan"))
    {
      window.location.href = '#/planFamiliar/crear';
    }
});
}