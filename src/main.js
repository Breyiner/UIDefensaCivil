import 'remixicon/fonts/remixicon.css';
import "./styles/main.css";
import 'tom-select/dist/css/tom-select.css';

import { router } from "./router/router.js";
import componenteHeader from "./componentes/header/index.html?raw";
import { componenteHeader as header } from "./componentes/header/header.js"
import { Chart, registerables } from 'chart.js';
import TomSelect from 'tom-select';

Chart.register(...registerables);
window.Chart = Chart;

// 1. Crea una función para inicializar TomSelect
const initTomSelect = () => {
    const elements = document.querySelectorAll(".selector");
    elements.forEach(el => {
        new TomSelect(el, {
            create: false,
            sortField: { field: "text", direction: "asc" },

            render: {
                option: function (data, escape) {
                    const icon = data.icon
                        ? `<i class="${escape(data.icon)}"></i> `
                        : '';
                    return `<div>${icon}${escape(data.text)}</div>`;
                },
                item: function (data, escape) {
                    const icon = data.icon
                        ? `<i class="${escape(data.icon)}"></i> `
                        : '';
                    return `<div>${icon}${escape(data.text)}</div>`;
                }
            }
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