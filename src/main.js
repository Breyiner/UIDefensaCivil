import 'remixicon/fonts/remixicon.css'
import "./style.css";
import { router } from "./Router/router.js"; 
import componenteHeader from "../src/componentes/header/index.html?raw";

document.querySelector("body").insertAdjacentHTML("afterbegin", componenteHeader);

window.addEventListener("hashchange", async (e) => {
});

window.addEventListener("DOMContentLoaded", async () => {
});