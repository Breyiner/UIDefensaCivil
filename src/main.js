import 'remixicon/fonts/remixicon.css';
import "./styles/main.css";
import 'tom-select/dist/css/tom-select.css'; // Estilos arriba

import { router } from "./Router/router.js"; 
import componenteHeader from "../src/componentes/header/index.html?raw";
import { componenteHeader as header } from "./Componentes/Header/header.js"
import { Chart, registerables } from 'chart.js';
import TomSelect from 'tom-select';

Chart.register(...registerables);
window.Chart = Chart;

// 1. Crea una función para inicializar TomSelect
const initTomSelect = () => {
    const el = document.querySelector("#selector");
    if (el) {
        new TomSelect(el, {
            create: true,
            sortField: { field: "text", direction: "asc" },
            
            // Aquí definimos cómo mostrar las opciones y el item seleccionado
            render: {
                option: function(data, escape) {
                    // data.icon puede ser algo como "ri-error-warning-fill"
                    const icon = data.icon ? `<i class="${escape(data.icon)}"></i> ` : '';
                    return `<div>${icon}${escape(data.text)}</div>`;
                },
                item: function(data, escape) {
                    const icon = data.icon ? `<i class="${escape(data.icon)}"></i> ` : '';
                    return `<div>${icon}${escape(data.text)}</div>`;
                }
            }
        });
    }
};

document.querySelector("body").insertAdjacentHTML("afterbegin", componenteHeader);
const main = document.querySelector("#app");

// 2. Ejecuta la inicialización después de que el router termine
window.addEventListener("hashchange", async () => {
    header();
    await router(main);
    initTomSelect(); // <--- Aquí
});

window.addEventListener("DOMContentLoaded", async () => {
    header();
    await router(main); 
    initTomSelect(); // <--- Y aquí
});