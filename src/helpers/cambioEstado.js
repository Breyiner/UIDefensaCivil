//objeto que cambia la clase segun el estado del plan
export const estado_planes = {
    1: 'badge badge--creado',         //creado
    2: 'badge badge--creado',          //No aplica
    3: 'badge badge--pendiente',       //En proceso
    4: 'badge badge--pendiente',        //En Revision
    5: 'badge badge--rechazado',      //Devuelto con observaciones
    6: 'badge badge--rechazado',      //rechazado
    7: 'badde badge--completado'      //completado
};
//objeto que cambia la clase segun el estado del usuario
export const estado_usuarios = {
    1: 'badge badge--completado',   //activo
    2: 'badge badde--rechazado',    //inactivo
    3: 'badge badge--pendiente'     //pendiente
};

//funcion que toma el id y si este no lo reconoce, da un string nulo
export function getBadgeClase(statusId, mapa) {
    if (mapa[statusId] !== null && mapa[statusId] !== undefined) {
        return mapa[statusId];
    } else {
        return '';
    }
}