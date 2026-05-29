/**
 * Controlador: Gestión de Usuarios Activos (gestionController.js)
 * Usa los componentes de filtrado (barra de búsqueda y selector de estado) y el helper 
 * de filtrado dinámico para permitir búsquedas locales rápidas y eficientes.
 */
<<<<<<< HEAD
import * as alerta from "../../../../helpers/alertas";
import * as api from "../../../../helpers/api";
import * as modalUsuario from "../../../../helpers/modales/usuario";
import { tarjetaEstados } from "../../../../componentes/gestionUser/tarjeta_gestion";
// Importamos el componente de barra de búsqueda para la UI
import { searchBar } from "../../../../componentes/filter/searchBar";
// Importamos el componente de menú desplegable para filtrar por estados
import { dropdownFiltro } from "../../../../componentes/filter/dropdown";
// Importamos el helper que llena dinámicamente comboboxes desde la API
import { adjuntarNoValida } from "../../../../helpers/adjuntarOpciones";
// Importamos el helper central de filtrado de datos del cliente
import { filtrarDatos } from "../../../../helpers/filter";
=======
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { alertas as alerta, api, adjuntarNoValida, filtrarDatos } from "@/helpers/index.js";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { usuario as modalUsuario } from "@/helpers/modales/index.js";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { tarjetaEstados } from "@/componentes/tarjetas/index.js";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { searchBar, dropdownFiltro } from "@/componentes/filter/index.js";
>>>>>>> origin/develop

export default async () => {

    // Extrae los botones de navegación generales
    const botonBack = document.getElementById("botonBack");

    // Contenedor dinámico principal donde se incrustarán las Cards de usuarios paginados
    const contenedor = document.querySelector(".container__paginas");
    
    // Contenedor específico donde se inyectarán los elementos visuales de los filtros
    const contenedorFiltro = document.querySelector(".container__filtro");

    // Limpiamos la barra inferior del paginador ya que realizaremos filtrado local de todos los registros
    const containerPaginador = document.querySelector(".container__paginador");
    if (containerPaginador) {
        containerPaginador.innerHTML = "";
    }

    // Prevención de clics múltiples bloqueando interacción si la red está operando
    if (window.procesoPeticion === undefined) {
        window.procesoPeticion = false;
    }
    window.procesoPeticion = false;

    // Regla global retroceder al hub Dashboard del supervisor
    botonBack.onclick = () => {
        if (window.procesoPeticion) return;
        location.href = `#/supervisor/`;
    };

    // Mensaje que se muestra en pantalla si no se encuentran registros que coincidan con los filtros
    const mensajeVacio = "No hay ningún usuario que coincida con los filtros";

    // Array en memoria que actuará como caché local para almacenar todos los usuarios obtenidos de la API
    let todosLosUsuarios = [];

    // Manejador del evento de entrada de texto en la barra de búsqueda
    function searchBarFiltro(event) {
        event.preventDefault();
        // Vuelve a procesar y renderizar los usuarios aplicando los nuevos criterios de búsqueda
        renderUsuarios();
    }

    // Manejador del evento de cambio de selección en el dropdown de estado
    function seleccionarEstado(event) {
        event.preventDefault();
        // Vuelve a procesar y renderizar los usuarios aplicando el nuevo estado seleccionado
        renderUsuarios();
    }

    // Inicialización de filtros: Limpia y agrega barra de búsqueda y dropdown en el DOM
    contenedorFiltro.innerHTML = "";
    // Instancia el input de búsqueda con un placeholder descriptivo en español
    const searchbar = searchBar(searchBarFiltro, "Buscar voluntario por nombre...");
    // Instancia el dropdown que ejecutará seleccionarEstado al cambiar su valor
    const dropdown = await dropdownFiltro(seleccionarEstado);
    // Llena el dropdown con los estados de usuario disponibles en la base de datos (activo, inactivo, pendiente)
    await adjuntarNoValida(dropdown, "stateUsers");

    // Acopla los elementos de filtrado en el contenedor de la interfaz de usuario
    contenedorFiltro.append(searchbar);
    contenedorFiltro.append(dropdown);

    // Procesa, filtra y dibuja las tarjetas de los usuarios que cumplan con los criterios establecidos
    const renderUsuarios = () => {
        contenedor.innerHTML = ""; // Limpieza del contenedor para redibujar

        // Criterios de búsqueda: 'full_name' filtra por texto y 'status_id' por el ID del estado del usuario
        const criterios = {
            full_name: searchbar.value.trim(),
            status_id: Number(dropdown.value)
        };

        // Filtra los datos locales usando el helper filtrarDatos importado
        const usuariosFiltrados = filtrarDatos(todosLosUsuarios, criterios);

        // Si el resultado del filtro está vacío, muestra un mensaje amigable al usuario
        if (usuariosFiltrados.length === 0) {
            contenedor.innerHTML = `<div class="noCantidad">${mensajeVacio}</div>`;
        } else {
            // Recorre los usuarios filtrados y los inyecta en el contenedor visual
            usuariosFiltrados.forEach((user) => {
                contenedor.append(tarjetaEstados(user));
            });
        }
    };

    // Función Helper delegada a la clase UI para limpiar rastros y rehacer peticiones (Actualizar lista post-modal)
    const recargarContainer = async () => {
        contenedor.innerHTML = ""; // Barrido

        // Petición al endpoint "users" pidiendo una cantidad alta para obtener todos los registros de una vez
        // Esto permite que el buscador y el filtro de estados operen localmente sobre el set completo del supervisor
        todosLosUsuarios = await api.get("users?per_page=1000");

        // Aseguramos que la respuesta sea un array antes de renderizar para prevenir errores
        if (!todosLosUsuarios) {
            todosLosUsuarios = [];
        }

        // Renderiza el listado aplicando los filtros activos (inicialmente vacíos/todos)
        renderUsuarios();
    };

    // Escucha pasiva delegada al contenedor padre (Técnica Event Delegation optimizada RAM)
    contenedor.addEventListener("click", async (e) => {

        // Verifica si el clic recayó exacto sobre, o dentro (Span/icon), de un <button> HTML
        const tarjetaClickeada = e.target.closest(".tarjeta");
        if (!tarjetaClickeada) return; // Rompe si tocó pared vacía

        // Recuperar Meta-ID guardado en tiempo de inyección (data-id)
        const userId = tarjetaClickeada.dataset.id;


        // Lanza función "Ver" contenida en "modales/usuario.js" pasando 
        // la ID identificadora, el refresco padre y el modo de usuario supervisor.
        // El supervisor debe ver activar/desactivar.
        modalUsuario.ver(userId, recargarContainer, false, false);
    });

    // Arranque de rutina nativo al desplegar esta vista la primera vez
    await recargarContainer();
};