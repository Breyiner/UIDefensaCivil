/**
 * Módulo principal (main.js)
 * Punto de entrada de la aplicación. Se encarga de importar estilos, 
 * inicializar bibliotecas de terceros (TomSelect), 
 * montar el componente del header y arrancar el enrutador principal en el contenedor "#app".
 */

import 'remixicon/fonts/remixicon.css';
import "./styles/main.css";
import 'tom-select/dist/css/tom-select.css';
import { router } from "./router/router.js";
import { componenteHeader as header } from "./componentes/header/header.js"
import TomSelect from 'tom-select';
import { isAuth } from './helpers/auth.js';


// // 1. Crea una función para inicializar listas desplegables avanzadas (TomSelect)
const initTomSelect = () => {

    // Selecciona todos los elementos en el DOM que tengan la clase ".selector"
    const elements = document.querySelectorAll(".selector");

    // Itera sobre cada elemento encontrado
    elements.forEach(el => {

        // Inicializa un nuevo TomSelect en el elemento
        new TomSelect(el, {
            create: false, // Evita que el usuario cree nuevas opciones libremente
            sortField: { field: "text", direction: "asc" }, // Ordena alfabéticamente por texto

            render: {

                // Personaliza cómo se dibuja visualmente la opción en la lista desplegable
                option: function (data, escape) {
                    const icon = data.icon
                        ? `<i class="${escape(data.icon)}"></i> ` // Si detecta un ícono, inyecta su clase
                        : '';
                    return `<div>${icon}${escape(data.text)}</div>`; // Retorna el HTML construido de la opción
                },

                // Personaliza cómo se dibuja visualmente el ítem una vez que es seleccionado
                item: function (data, escape) {
                    const icon = data.icon
                        ? `<i class="${escape(data.icon)}"></i> ` // Si detecta un ícono, inyecta su clase
                        : '';
                    return `<div>${icon}${escape(data.text)}</div>`; // Retorna el HTML construido del ítem activo
                }
            }
        });
    });
};


// // 2. Ejecuta la inicialización lógica general después de que la ruta o hash cambie en el navegador
window.addEventListener("hashchange", async () => {
    const main = document.querySelector("#app");

    // SOLUCIÓN: Buscar y remover el contenedor real de nivel superior (.headerCont)
    const headerContEl = document.querySelector(".headerCont");
    if (headerContEl) {
        headerContEl.remove();
    }
    
    // Inicializa la lógica del encabezado si el usuario está autenticado.
    if (isAuth()) {
        await header();
    }
    
    await router(main); 
    initTomSelect(); 
});

// // Cuando el documento principal carga desde cero por primera vez
window.addEventListener("DOMContentLoaded", async () => {
    const layout = document.querySelector(".layout");
    if (!layout) {
        console.error(" No se encontró el elemento .layout en el DOM");
        return;
    }

    const main = document.querySelector("#app");
    if (!main) {
        console.error(" No se encontró #app");
        return;
    }
    
    // Inicializa la lógica del encabezado (como contadores de notificaciones y eventos) después de ejecutar la ruta.
    // Esto es muy importante para que la interacción del encabezado esté totalmente operativa.
    if (isAuth()) {
        await header(); // Luego inicializar el header
    }
    
    await router(main);
    initTomSelect();
});