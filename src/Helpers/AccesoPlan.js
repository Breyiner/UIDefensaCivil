import * as api from "./api";
import * as alerta from "./alertas";

export default async (id) => {
    const acceso = await api.get(`familyPlans/checkAccess/${id}`)
    const accesoBolean = acceso.access_check;

    if (!accesoBolean)
    {
        alerta.alertaMensaje("No tienes acceso a este plan familiar.");
        location.href = `#/home`;
    }
}