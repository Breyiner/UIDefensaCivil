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
    const elements = document.querySelectorAll("#selector");

    elements.forEach(el => {
        new TomSelect(el, {
            create: false,
            sortField: { field: "text", direction: "asc" },

            render: {
                option: function(data, escape) {
                    const icon = data.icon 
                        ? `<i class="${escape(data.icon)}"></i> ` 
                        : '';
                    return `<div>${icon}${escape(data.text)}</div>`;
                },
                item: function(data, escape) {
                    const icon = data.icon 
                        ? `<i class="${escape(data.icon)}"></i> ` 
                        : '';
                    return `<div>${icon}${escape(data.text)}</div>`;
                }
            }
        });
    });
};

export const initTomSelectPortatil = () => {
    const elements = document.querySelectorAll("#selector");

    elements.forEach(el => {

        if (el.tomselect) return;

        new TomSelect(el, {
            create: false,
            sortField: { field: "text", direction: "asc" }
        });
    });
};

const layout = document.querySelector(".layout");
layout.insertAdjacentHTML("afterbegin", componenteHeader);
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