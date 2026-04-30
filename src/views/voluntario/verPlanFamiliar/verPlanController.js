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

    const searchbar = await searchBar()
    const dropdown = await dropdownFiltro()

    contenedorFiltro.append(searchbar)
    contenedorFiltro.append(dropdown)


    if (window.procesoPeticion === undefined) window.procesoPeticion = false;
    window.procesoPeticion = false;

    //

    // Extracción de Token de Autorización LocalStorage (1 Admin, 2 Supervisor, 3 Voluntario)
    const rolId = localStorage.getItem("role_id");

    // Lógica dinámica Botón Atrás (Si entra un supervisor a mironear, que lo devuelva a su casa)
    botonBack.onclick = () => {
        if (window.procesoPeticion) return;
        location.href = rolId == 3 
            ? `#/voluntario` 
            : `#/supervisor`;
    };

    const mensajeVacio = "No tienes ningun plan familiar realizado.";

    /**
     * Componente Tarjeta Resumen Plan Familiar
     * Fabrica las cajas grandes que se ven al entrar al sistema.
     */


    /**
     * Enganche Global Paginador Backend-Frontend
     * Trae exclusivamente los planes amarrados al ID del Usuario Logueado (Token JWT implícito en Helper).
     */

    // SE DEBE RECONSTRUIR LA FUNCION DE PAGINACION, NO ESTÁ MODULADA!
    const recargarContainer = async (endpoint="familyPlans", status = 0) => {
        contenedor.innerHTML = "";
        const paginado = await api.getPaginacion(endpoint);
        const planes = paginado.data;

        planes.forEach(async(plan) => {

            if (status == 0){
                const tarjeta = cardPlanFamiliar(plan)
                contenedor.append(tarjeta)
            }
            else if (plan.status_id == status){
                const tarjeta = cardPlanFamiliar(plan)
                contenedor.append(tarjeta)
            }
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
        if (rolId == 3) { // Branch VOLUNTARIO (Autor)

            // Si el estado es 1 (Nuevo/Recien creado), Obligale a pasar primero por el Test Psicológico de Vulnerabilidad.
            if (status == 1) {
                location.href = `#/voluntario/plan_familiar/testVunerabilidad?id=${planId}`;
            } else {
                // Si ya pasó el test, llévalo al Menu Index Hub Modules 
                location.href = `#/voluntario/plan_familiar/familia?id=${planId}`;
            }

        } else if (rolId == 2) { // Branch SUPERVISOR (Revisor)
            // Llévalo al módulo especializado de auditoría y revisión
            location.href = `#/supervisor/plan_familiar/revision?id=${planId}`;
        }
    });

    // Run Engine
    await recargarContainer();

    dropdown.addEventListener("change", e => {
        const option = e.target
        if (option.matches(".dropdown-filtro__item")){
            return;
        }
        recargarContainer("familyPlans",option.value)
    })
};