import 'remixicon/fonts/remixicon.css'

import "./styles/main.css";
import { router } from "./Router/router.js"; 
import componenteHeader from "../src/componentes/header/index.html?raw";
import { componenteHeader as header } from "./Componentes/Header/header.js"
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
window.Chart = Chart;
document.querySelector("body").insertAdjacentHTML("afterbegin", componenteHeader);

const main = document.querySelector("#app");

window.addEventListener("hashchange", async (e) => {
    header();
    router(main);
});

window.addEventListener("DOMContentLoaded", async () => {
    header();
    router(main);
});