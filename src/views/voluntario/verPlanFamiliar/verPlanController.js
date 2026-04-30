/**
 * Controlador Principal: Dashboard de Planes Familiares del Voluntario (verPlanController.js)
 * Renderiza la pantalla principal del Voluntario ("Mis Planes") usando paginación.
 * Muestra el estado de cada plan (En Progreso, Aprobado, Rechazado) con colores distintivos.
 * Contiene lógica condicional de enrutamiento basada en el Rol del usuario (Voluntario vs Supervisor).
 */
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
    const carta = async (info) => {

        const div = document.createElement("div");
        div.classList.add("verPlan", "tarjeta");

        // Lógica de Semáforo UI basado en el Código de Estado (Status_id) del Flujo de Aprobación
        // 3: Enviado a Revisión (Azul)
        // 4, 7: Aprobados / Certificados (Verde)
        // 5, 6: Rechazos temporales o definitivos (Rojo)
        const estadoClase =
            info.status_id == 3 ? "verPlan__estado--azul" :
            info.status_id == 4 || info.status_id == 7 ? "verPlan__estado--verde" :
            info.status_id == 5 || info.status_id == 6 ? "verPlan__estado--rojo" :
            ""; // Vacio por default (Asume estado 1 o 2 'En Progreso')

        // Override Label Texto para Rechazos (El backend tal vez manda textos largos, front los recorta)
        const estadoTexto =
            info.status_id == 5 ? "Rechz.Cambios" :
            info.status_id == 6 ? "Rechz.Definitivo" :
            info.status;

        // Maquetación DOM de la Carta
        div.innerHTML = `
            <div class="verPlan__icono">
                <i class="ri-parent-fill"></i>
            </div>
            <div class="verPlan__apellidos">${info.last_names}</div>
            <div class="verPlan__estado ${estadoClase}">
                ${estadoTexto}
            </div>
            <div class="verPlan__detalles--ubicacion">
                <i class="ri-map-pin-line"></i>
                ${info.department} - ${info.city}
            </div>
            <div class="verPlan__detalles--fecha">
                <i class="ri-calendar-event-fill"></i>
                Ultima Edicion: ${info.date_create}
            </div>
            ${
                // Restricción de Botón "Revisar":
                // Desaparece si el plan está: (2) Enviado a certificar, (6) Rechazo Mortal, (7) Terminado
                info.status_id == 2 || 
                info.status_id == 6 || 
                info.status_id == 7
                    ? ""
                    : `<button class="verPlan__boton boton" 
                              data-id="${info.id}" 
                              data-status="${info.status_id}">
                          Revisar Plan
                       </button>`
            }
        `;

        return div;
    };

    /**
     * Enganche Global Paginador Backend-Frontend
     * Trae exclusivamente los planes amarrados al ID del Usuario Logueado (Token JWT implícito en Helper).
     */
    const recargarContainer = async (endpoint="familyPlans", status = 0) => {
        contenedor.innerHTML = "";
        const paginado = await api.getPaginacion(endpoint);
        const planes = paginado.data;

        planes.forEach(async(plan) => {

            if (plan.status__id == 0)
                await paginacion("familyPlans", mensajeVacio, carta)
            if (plan.status_id == status){
                
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