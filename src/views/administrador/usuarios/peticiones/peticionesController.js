/**
 * Controlador: Peticiones Globales de Usuario (peticionesController.js)
 * Vista exclusiva de Administrador para evaluar TODAS las solicitudes de nuevos
 * perfiles. Muestra las cartas paginadas y levanta el modal de Aprobación/Rechazo.
 */
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { alertas as alerta, api, paginacion } from "@/helpers/index.js";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { usuario as modalUsuario } from "@/helpers/modales/index.js";
import { tarjetaPeticion } from "@/componentes/gestionUser/index.js";
import { panelAcciones } from "../../../../componentes/peticiones/accionesPeticiones";
import { verPeticionVentana } from "../../../../componentes/ver_Estado";

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
        location.href = `#/administrador/`;
    };
    
    // Mensaje que se muestra si no hay peticiones por aceptar/rechazar
    const mensajeVacio = "No hay ninguna peticion de activacion";
    
    // Orquestador encapsulado para Refresh / Update Table sin refresco general de la pag SPA web
    const recargarContainer = async () => {
        contenedor.innerHTML = ""; // Hard reset
        
        // El script helpers Paginador consume un endpoint exclusivo 'requestsSupervisors' 
        // Pasando su propia lógica de Fetch Pages + el template tarjeta
        await paginacion(`users/requests/admins`, mensajeVacio, tarjetaPeticion);
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

        const endpoint = `users/${userId}`;
        
        // 5. Si tenemos el ID, lanzamos el modal.
        if (userId) {

            verPeticionVentana(endpoint, recargarContainer, true);
        }
    });
    
    panelAcciones(contenedor, recargarContainer);
    // Llenado automático primera carga en memoria SPA
    await recargarContainer();
};