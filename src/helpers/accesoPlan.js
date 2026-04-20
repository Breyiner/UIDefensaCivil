/**
 * Helper de Control de Acceso a Planes Familiares (accesoPlan.js)
 * Verifica contra el backend si el usuario actual tiene el permiso legal para ver o editar 
 * un Plan Familiar específico. Redirige la navegación en caso de denegación.
 */
import * as api from "./api";
import * as alerta from "./alertas";

export default async (id) => {
    // Consulta al backend si el voluntario tiene acceso a este ID específico
    const acceso = await api.get(`familyPlans/check-access/${id}`)
    const accesoBolean = acceso.access_check;

    // Si el backend devuelve falso (403 simulado)
    if (!accesoBolean)
    {
        alerta.alertaMensaje("No tienes acceso a este plan familiar."); // Lanza toast de error
        location.replace(`#/voluntario/plan_familiar`); // Obliga al agente a regresar al listado
        if (window.href=`#/supervisor/`) {
            location.replace(`#/supervisor/plan_familiar`); // Si el usuario es supervisor, lo devuelve a su listado
        }
    }
}