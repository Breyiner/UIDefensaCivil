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
import componenteHeader from "./componentes/header/index.html?raw";
import { componenteHeader as header } from "./componentes/header/header.js"
import TomSelect from 'tom-select';


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

// // Selecciona el contenedor principal con la clase "layout"
// const layout = document.querySelector(".layout");
// // Inserta el HTML del componente header justo al principio dentro de "layout"
// layout.insertAdjacentHTML("afterbegin", componenteHeader);
// // Selecciona el contenedor dinámico "#app" donde se renderizarán todas las vistas
// const main = document.querySelector("#app");

// // 2. Ejecuta la inicialización lógica general después de que la ruta o hash cambie en el navegador
window.addEventListener("hashchange", async () => {
    //El elemento "layout" debe existir en el DOM antes
    const main = document.querySelector("#app");
    await header(); // Ejecuta las interacciones o eventos del header
    await router(main); // Invoca el enrutador para cargar la nueva vista dentro de "#app"
    initTomSelect(); // <--- Inicializa los selectores TomSelect de la pantalla actual recién cargada
});

// // Cuando el documento principal carga desde cero por primera vez
window.addEventListener("DOMContentLoaded", async () => {
    const layout = document.querySelector(".layout");

    if (!layout) {
        console.error("❌ No se encontró el elemento .layout en el DOM");
        return;
    }

    layout.insertAdjacentHTML("afterbegin", componenteHeader); // Asegura que el contenedor "#app" esté dentro de "layout" antes de cargar la nueva vista
    
    const main = document.querySelector("#app");

    if (!main) { console.error("❌ No se encontró #app"); return; }

    await header(); // Ejecuta las interacciones o eventos del header
    await router(main); // Invoca el enrutador para cargar la página de inicio o ruta actual en "#app"
    initTomSelect(); // <--- Inicializa los selectores TomSelect de la carga inicial
});