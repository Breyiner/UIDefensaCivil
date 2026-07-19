/**
 * Módulo principal (main.js)
 * Punto de entrada de la aplicación. Se encarga de importar estilos, 
 * montar el componente del header y arrancar el enrutador principal en el contenedor "#app".
 */

import 'remixicon/fonts/remixicon.css';
import "./styles/main.css";
import { router } from "./router/router.js";
import { componenteHeader as header } from "./componentes/header/header.js"
import { isAuth } from './helpers/auth.js';


// Ejecuta la inicialización lógica general después de que la ruta o hash cambie en el navegador
window.addEventListener("hashchange", async () => {
    const main = document.querySelector("#app");

    // SOLUCIÓN: Buscar y remover el contenedor real de nivel superior (.headerCont)
    const headerContEl = document.querySelector(".headerCont");
    if (headerContEl) {
        headerContEl.remove();
    }

    const mobileNav = document.getElementById("sidebarMobile");
    if (mobileNav) mobileNav.remove();
    
    // Inicializa la lógica del encabezado si el usuario está autenticado.
    if (isAuth()) {
        await header();
    }
    
    await router(main); 
});

// Cuando el documento principal carga desde cero por primera vez
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
});