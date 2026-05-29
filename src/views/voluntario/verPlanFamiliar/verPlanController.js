/**
 * Controlador Principal: Dashboard de Planes Familiares del Voluntario (verPlanController.js)
 * Renderiza la pantalla principal del Voluntario ("Mis Planes") usando paginación.
 * Muestra el estado de cada plan (En Progreso, Aprobado, Rechazado) con colores distintivos.
 * Contiene lógica condicional de enrutamiento basada en el Rol del usuario (Voluntario vs Supervisor).
 */

import { alertas as alerta } from "@/helpers";
import { api } from "@/helpers";
import { paginacion } from "@/helpers";
import { integrante } from "@/helpers/modales";
import { color } from "chart.js/helpers";
import { estado_planes, estado_usuarios, getBadgeClase } from "@/helpers";
import { cardPlanFamiliar } from "@/componentes/cards/planFamiliarCard.js";

const verPlanController = async () => {

    const statusPlans = await api.get(`statusPlans/`);

    const botonBack = document.getElementById("botonBack");

    const contenedor = document.querySelector(".container__paginas");

    const selectStatusCont = document.createElement("div");

    selectStatusCont.classList.add("selector--estado__cont");


    // encontrar contenedor donde van los filtros
    const contenedorFiltro = document.querySelector(".container__filtro");


    botonBack.onclick = () => {
        if (window.procesoPeticion) return;
        location.href = `#/voluntario/`;
    };

    let filtroEstado = 0;
    let filtroBusqueda = "";
    let todosLosPlanes = [];

    const renderPlanes = () => {
        contenedor.innerHTML = "";

        const planesFiltrados = todosLosPlanes.filter(plan => {
            const pasaEstado = filtroEstado === 0 || plan.status_id == filtroEstado;
            const pasaBusqueda = filtroBusqueda === "" ||
                plan.last_names.toLowerCase().includes(filtroBusqueda.toLowerCase());

            return pasaEstado && pasaBusqueda; // deben cumplirse los dos
        });

        planesFiltrados.forEach(async (plan) => {
            contenedor.append(await carta(plan));
        });
    };


    // let estadoActivo = 0;


    const mensajeVacio = "No tienes ningun plan familiar realizado.";


    const recargarContainer = async () => {
        contenedor.innerHTML = "";
        await paginacion("familyPlans", mensajeVacio, cardPlanFamiliar);
    };

    await paginacion("familyPlans", mensajeVacio, cardPlanFamiliar);

};

export default verPlanController;