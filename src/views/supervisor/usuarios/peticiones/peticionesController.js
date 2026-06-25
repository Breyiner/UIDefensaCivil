/**
 * Controlador: Peticiones de Usuario (peticionesController.js)
 * Renderiza y pagina la bandeja de entrada de nuevos voluntarios que esperan aprobación.
 * Al interactuar, levanta el modal especializado que permite Aprobar o Rechazar el ingreso.
 */
import { alertas as alerta, api, paginacion } from "@/helpers/index.js";
import { usuario as modalUsuario } from "@/helpers/modales/index.js";
import { tarjetaPeticion } from "@/componentes/gestionUser/index.js";
import { panelAcciones } from "../../../../componentes/peticiones/accionesPeticiones";

export default async () => {

    // Instancia el botón de retroceso superior
    const botonBack = document.querySelector("#botonBack");

    // const cont = document.querySelector(".container")

    // Contenedor principal que alojará las tarjetas renderizadas por paginación
    const contenedor = document.querySelector(".container__paginas");

    panelAcciones(contenedor);
    

    // Lógica bloqueante anti-múltiples clics por retardos asincronos
    if (window.procesoPeticion === undefined) window.procesoPeticion = false;
    window.procesoPeticion = false;

    // Enganche para volverse al dashboard menú general
    botonBack.onclick = () => {
        if (window.procesoPeticion) return;
        location.href = `#/supervisor/`;
    };

    // Mensaje que se muestra si no hay peticiones por aceptar/rechazar
    const mensajeVacio = "No hay ninguna peticion de activacion";

    // Orquestador encapsulado para Refresh / Update Table sin refresco general de la pag SPA web
    const recargarContainer = async () => {
        contenedor.innerHTML = ""; // Hard reset

        // El script helpers Paginador consume un endpoint exclusivo 'requestsSupervisors' 
        // Pasando su propia lógica de Fetch Pages + el template tarjeta
        await paginacion(`users/requests/supervisors`, mensajeVacio, tarjetaPeticion);
    };

    //evento para que al dar click en la tarjeta aparezca el modal, en cualquier lado de la tarjeta
    contenedor.addEventListener("click", async (e) => {

        // 2. Buscamos la tarjeta más cercana al lugar donde se hizo clic.
        // .closest() asegura que si tocas un texto o icono dentro, igual encuentre la tarjeta.
        const tarjetaEscogida = e.target.closest(".tarjeta");

        // 3. Si no se tocó una tarjeta (ej. se tocó el espacio entre ellas), no hacemos nada.
        if (!tarjetaEscogida) return;

        // 4. "Pescamos" el ID que guardamos en el componente tarjetaPeticion.
        const userId = tarjetaEscogida.dataset.id;

        console.log(userId);

        
        // 5. Si tenemos el ID, lanzamos el modal.
        if (userId) {
            // modalUsuario.ver(ID_DEL_USUARIO, CALLBACK_RECARGAR, MODO_PETICION, EDITABLE)
            modalUsuario.ver(userId, recargarContainer, true, false);
        }
    });
    
    // Llenado automático primera carga en memoria SPA
    await recargarContainer();
};