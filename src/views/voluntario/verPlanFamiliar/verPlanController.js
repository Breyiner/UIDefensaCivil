/**
 * Controlador Principal: Dashboard de Planes Familiares del Voluntario (verPlanController.js)
 * Renderiza la pantalla principal del Voluntario ("Mis Planes") usando paginación.
 * Muestra el estado de cada plan (En Progreso, Aprobado, Rechazado) con colores distintivos.
 * Contiene lógica condicional de enrutamiento basada en el Rol del usuario (Voluntario vs Supervisor).
 */
import { cardPlanFamiliar } from "../../../componentes/cards/planFamiliarCard";
import { dropdownFiltro } from "../../../componentes/filter/dropdown";
import { searchBar } from "../../../componentes/filter/searchBar";
import * as api from "../../../helpers/api";
import paginacion from "../../../helpers/paginacion";

export default async () => {
  // Referencias DOM
  const botonBack = document.getElementById("botonBack");
  const contenedor = document.querySelector(".container__paginas"); // Grid Wrapper Main

  // encontrar contenedor donde van los filtros
  const contenedorFiltro = document.querySelector(".container__filtro");

  // agregar campos de filtro

  const searchbar = await searchBar(searchBarFiltro);
  const dropdown = await dropdownFiltro(dropdownItems(), dropdownOnChange);

  contenedorFiltro.append(searchbar);
  contenedorFiltro.append(dropdown);

  if (window.procesoPeticion === undefined) window.procesoPeticion = false;
  window.procesoPeticion = false;

  //

  // Extracción de Token de Autorización LocalStorage (1 Admin, 2 Supervisor, 3 Voluntario)
  const rolId = localStorage.getItem("role_id");

  const esSupervisor = location.hash.includes("supervisor");
  const base = esSupervisor ? "supervisor" : "voluntario";

  // Lógica dinámica Botón Atrás (Si entra un supervisor a mironear, que lo devuelva a su casa)
  botonBack.onclick = () => {
    if (window.procesoPeticion) return;
    // location.href = rolId == 3 ? `#/voluntario` : `#/supervisor`;
    location.href = `#/${base}`;
  };

  const mensajeVacio = "No tienes ningun plan familiar realizado.";

  let filtroEstado = 0;
  let filtroBusqueda = "";
  let todosLosPlanes = [];

  const cargarPlanes = async (endpoint = "familyPlans") => {
    const paginado = await api.getPaginacion(endpoint);
    todosLosPlanes = paginado.data;
    renderPlanes(); // aplica los filtros actuales (vacíos al inicio)
  };

  const renderPlanes = () => {
    contenedor.innerHTML = "";

    const planesFiltrados = todosLosPlanes.filter((plan) => {
      const pasaEstado = filtroEstado === 0 || plan.status_id == filtroEstado;
      const pasaBusqueda =
        filtroBusqueda === "" ||
        plan.last_names.toLowerCase().includes(filtroBusqueda.toLowerCase());

      return pasaEstado && pasaBusqueda; // deben cumplirse los dos
    });

    planesFiltrados.forEach((plan) => {
      contenedor.append(cardPlanFamiliar(plan));
    });
  };

  // Delegación Eventos de Click Muro Principal "Mis Planes"
  contenedor.addEventListener("click", async (e) => {
    const boton = e.target.closest("button");
    if (!boton) return;
    if (!boton.classList.contains("verPlan__boton")) return; // Solo acciona el botón inferior
    if (window.procesoPeticion) return;

    // Recupera Data-Attr embutidos en el HTML al renderizar
    const planId = boton.dataset.id;
    const status = boton.dataset.status;

    // Router Inteligente de Permisos Segun el actor logueado:
    if (rolId == 3) {
      // Branch VOLUNTARIO (Autor)

      // Si el estado es 1 (Nuevo/Recien creado), Obligale a pasar primero por el Test Psicológico de Vulnerabilidad.
      if (status == 1) {
        location.href = `#/voluntario/plan_familiar/testVunerabilidad?id=${planId}`;
      } else {
        // Si ya pasó el test, llévalo al Menu Index Hub Modules
        location.href = `#/voluntario/plan_familiar/familia?id=${planId}`;
      }
    } else if (rolId == 2) {
      // Branch SUPERVISOR (Revisor)
      // Llévalo al módulo especializado de auditoría y revisión
      location.href = `#/supervisor/plan_familiar/revision?id=${planId}`;
    }
  });

  function filtrarPlanes(e){
    filtroEstado = Number(e.target.value);
      renderPlanes();
  }


     async function dropdownItems ( ) {
  
      const estados = await api.get("statusPlans")
  
          if (!estados){
              throw new Error("Filtro no encontrado")
          }
  
          console.log(estados)
          return estados
  
      }
  
      function dropdownOnChange(event){
          renderPlanes();
      }

  function searchBarFiltro(event) {
    filtroBusqueda = event.target.value.trim();
    renderPlanes();
  }

  cargarPlanes();
};
