/**
 * Controlador: Peticiones de Usuario (peticionesController.js)
 * Renderiza y pagina la bandeja de entrada de nuevos voluntarios que esperan aprobación.
 * Al interactuar, levanta el modal especializado que permite Aprobar o Rechazar el ingreso.
 */
import * as alerta from "../../../../helpers/alertas";
import * as api from "../../../../helpers/api";
import paginacion from "../../../../helpers/paginacion";
import * as modalUsuario from "../../../../helpers/modales/usuario";
import { tarjetaPeticion } from "../../../../componentes/tarjetas/tarjeta_checkbox";

export default async () => {

    // Instancia el botón de retroceso superior
    const botonBack = document.querySelector("#botonBack");

    // Contenedor principal que alojará las tarjetas renderizadas por paginación
    const contenedor = document.querySelector(".container__paginas");

    // Lógica bloqueante anti-múltiples clics por retardos asincronos
    if (window.procesoPeticion === undefined) window.procesoPeticion = false;
    window.procesoPeticion = false;

    // Enganche para volverse al dashboard menú general
    botonBack.onclick = () => {
        if (window.procesoPeticion) return;
        location.href = `#/supervisor/`;
    };

    // Leyenda mostrada cuando la cuenta se vacía de tareas por resolver
    const mensajeVacio = "No hay ninguna peticion de activacion";

    // Orquestador encapsulado para Refresh / Update Table sin refresco general de la pag SPA web
    const recargarContainer = async () => {
        contenedor.innerHTML = ""; // Hard reset
        const datosFalsos = {
            id: 1,
            document_number: 1095787508,
            full_name: "Valentina Serrano ",
            email: "valentinaserrano120@gmail.com",
            sectional: "Santander",
            organization: "Giron",
            rol: "Voluntario"
        }
        const mostrar = await tarjetaPeticion(datosFalsos);
        contenedor.appendChild(mostrar);
        return;
        // El script helpers Paginador consume un endpoint exclusivo 'requestsSupervisors' 
        // Pasando su propia lógica de Fetch Pages + el template `carta`
        await paginacion(`users/requestsSupervisors`, mensajeVacio, tarjetaPeticion);
    };

    //evento para que al dar click en la tarjeta aparezca el modal, en cualquier lado de la tarjeta
    contenedor.addEventListener("click", async (e) => {
        // creamos una variable para referenciar al elemento con clase tarjeta
        const tarjetaEscogida = e.target.closest(".tarjeta");
        // si tarjeta esocgida no fue encontrada, la funcion se rompe sin que se rompa el resto del codigo
        if (!tarjetaEscogida) return;

        // Fija precisión en la clase específica tarjeta
        if (!tarjetaEscogida.classList.contains(".tarjeta")) return;

        // Se adhiere al Atributo data-* custom que agregamos en el componente
        const userId = tarjetaEscogida.dataset.id;

        // Pasamos la función de recarga al modal
        // Lanza Pop-Up (usuario.js). (Modo 'Ver Peticion' == True) 
        modalUsuario.ver(userId, recargarContainer, true, true);
    });

    // Llenado automático primera carga en memoria SPA
    await recargarContainer();
};