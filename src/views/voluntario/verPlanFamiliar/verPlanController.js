/**
 * Controlador Principal: Dashboard de Planes Familiares del Voluntario (verPlanController.js)
 * Renderiza la pantalla principal del Voluntario ("Mis Planes") usando paginación.
 * Muestra el estado de cada plan (En Progreso, Aprobado, Rechazado) con colores distintivos.
 * Contiene lógica condicional de enrutamiento basada en el Rol del usuario (Voluntario vs Supervisor).
 */
import { cardPlanFamiliar } from "../../../componentes/cards/planFamiliarCard";
import { dropdownFiltro } from "../../../componentes/filter/dropdown";
import { searchBar } from "../../../componentes/filter/searchBar";
import { adjuntar, adjuntarNoValida } from "../../../helpers/adjuntarOpciones";
import * as api from "../../../helpers/api";
import { filtrarDatos } from "../../../helpers/filter";
import paginacion from "../../../helpers/paginacion";

export default async () => {
  // Referencias DOM
  const botonBack = document.getElementById("botonBack");
  const contenedor = document.querySelector(".container__paginas"); // Grid Wrapper Main

  // encontrar contenedor donde van los filtros
  const contenedorFiltro = document.querySelector(".container__filtro");

  // agregar campos de filtro

  const searchbar = await searchBar(searchBarFiltro);
  const dropdown = await dropdownFiltro(seleccionarEstado);
  adjuntarNoValida(dropdown,"statusPlans")


  // contenedorFiltro.append(searchbar);
  // contenedorFiltro.append(dropdown);

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


  const cargarPlanes = async (endpoint = "familyPlans") => {
    const paginado = await api.getPaginacion(endpoint);
    // todosLosPlanes = paginado.data;
    renderPlanes(); // aplica los filtros actuales (vacíos al inicio)
  };

  const renderPlanes = async() => {
    contenedor.innerHTML = "";

    const planes = await api.get("familyPlans");

    const criterios = {
      status_id: dropdown.value,
      last_names: searchbar.value
    }

    const tarjetasFiltradas = filtrarDatos(planes,criterios,)

    tarjetasFiltradas.forEach((plan) => {
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


  cargarPlanes();

  function seleccionarEstado(event) {
    event.preventDefault();
    renderPlanes()
  }

  function searchBarFiltro(event){
    event.preventDefault();
    renderPlanes()
  }

};
