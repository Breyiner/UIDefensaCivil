/**
 * Controlador: Revisión de Plan Familiar (RevisionPlanController.js)
 * Facilita las acciones críticas para un Supervisor al evaluar un Plan Familiar.
 * Gestiona botones asíncronos para Aprobar, Rechazar (Definitivo/Cambios) y Ver PDF.
 */
import * as alerta from "../../../../helpers/alertas";
import * as api from "../../../../helpers/api";
import paginacion from "../../../../helpers/paginacion";
// import { dropdownFiltro } from "../../../../componentes/filter/dropdown"
// import { searchBar } from "../../../../componentes/filter/searchBar"
import { ver } from "../../../../helpers/modales/integrante";
import { color } from "chart.js/helpers";
import { estado_planes, estado_usuarios, getBadgeClase } from "../../../../helpers/cambioEstado";
import { cardPlanFamiliar } from "../../../../componentes/cards/planFamiliarCard";

const ListadoPlanController = async () => {

    const statusPlans = await api.get(`statusPlans/`);

    const botonBack = document.getElementById("botonBack");

    const contenedor = document.querySelector(".container__paginas");

    const selectStatusCont = document.createElement("div");

    selectStatusCont.classList.add("selector--estado__cont");


    // encontrar contenedor donde van los filtros
    const contenedorFiltro = document.querySelector(".container__filtro");


    botonBack.onclick = () => {
        if (window.procesoPeticion) return;
        location.href = `#/supervisor/`;
    };


    // agregar campos de filtro

    // const searchbar = await searchBar(searchBarFiltro)
    // const dropdown = await dropdownFiltro()

    // contenedorFiltro.append(searchbar)
    // contenedorFiltro.append(dropdown)


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


    // dropdown.addEventListener("change", e => {
    //     filtroEstado = Number(e.target.value);
    //     renderPlanes();
    // })
    // function searchBarFiltro(event) {
    //     filtroBusqueda = event.target.value.trim();
    //     renderPlanes();
    // }

    await recargarContainer();

};

export default ListadoPlanController;