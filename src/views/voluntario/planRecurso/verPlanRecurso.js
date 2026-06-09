/**
 * Controlador: Listar y Gestionar Recursos Disponibles (verPlanRecurso.js)
 * Renderiza de forma asíncrona un listado paginado de los recursos comunitarios / servicios 
 * de emergencia más cercanos a la vivienda de la familia (Hospital, Bomberos, etc).
 */
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { api } from "@/helpers/index.js";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { alertas as alerta } from "@/helpers/index.js";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { recursoDisponible as modalRecursoDisponible } from "@/helpers/modales/index.js";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { paginacion } from "@/helpers/index.js";

export default async () => {

    // Nodos Botonera Top UI
    const crear = document.getElementById("crear"); // Redirige a Nuevo
    const botonBack = document.getElementById("botonBack"); // Regresa al Menu Familiar
    const id = location.hash.split("=")[1]; // Extractor de Primary Key Family Plan ID 
    
    // Contenedor Inyección Helper Paginador Visual
    const contenedor = document.querySelector(".container__paginas");

    // Concurrency Local Block prevent Spams
    if (window.procesoPeticion === undefined) window.procesoPeticion = true;
    window.procesoPeticion = true;

    // Retorno Dash FAmiliar
    botonBack.onclick = () => {
        if (window.procesoPeticion) return;
        location.href = `#/voluntario/plan_familiar/familia?id=${id}`;
    };

    // Redirección Crear
    crear.addEventListener("click", () => {
        location.href = `#/voluntario/plan_familiar/recursos/crear?familia_id=${id}`;
    });

    const mensajeVacio = "No tienes ningun recurso registrado en la familia...";

    /**
     * Helper Component Builder: Molde html inyectable para el Grid View.
     * Recibe JSON DTO de DB y spit HTML Div Node.
     * Nota: Recicla las clases CSS "verRiesgos" originalmente pensadas para otro modulo por simplicidad UI.
     */
    const carta = async (info) => {
        const div = document.createElement("div");
        div.classList.add("verRiesgos"); // Re-uso de Estilos de Tarjeta genérica

        const divTipo = document.createElement("div");
        divTipo.className = "verRiesgos__tipoRiesgo";
        const iTipo = document.createElement("i");
        iTipo.className = "ri-error-warning-line";
        divTipo.appendChild(iTipo);
        divTipo.appendChild(document.createTextNode(info.resource_name));
        div.appendChild(divTipo);

        const divUbicacion = document.createElement("div");
        divUbicacion.className = "verRiesgos__ubicacion";
        const iUbicacion = document.createElement("i");
        iUbicacion.className = "ri-map-2-line";
        divUbicacion.appendChild(iUbicacion);
        divUbicacion.appendChild(document.createTextNode(info.location));
        div.appendChild(divUbicacion);

        const divDistancia = document.createElement("div");
        divDistancia.className = "verRiesgos__distancia";
        const iDistancia = document.createElement("i");
        iDistancia.className = "ri-map-pin-line";
        divDistancia.appendChild(iDistancia);
        divDistancia.appendChild(document.createTextNode(`${info.distance} m`));
        div.appendChild(divDistancia);

        const divDescripcion = document.createElement("div");
        divDescripcion.className = "verRiesgos__descripcion";
        const pDesc = document.createElement("p");
        pDesc.textContent = "Descripción:";
        divDescripcion.appendChild(pDesc);
        divDescripcion.appendChild(document.createTextNode(`${info.service} - ${info.description}`));
        div.appendChild(divDescripcion);

        const btnEditar = document.createElement("button");
        btnEditar.className = "boton boton--azul verRiesgos__boton--editar";
        btnEditar.dataset.id = info.id;
        btnEditar.textContent = "Editar";
        div.appendChild(btnEditar);

        const btnEliminar = document.createElement("button");
        btnEliminar.className = "boton boton--azul verRiesgos__boton--eliminar";
        btnEliminar.dataset.id = info.id;
        btnEliminar.textContent = "Eliminar";
        div.appendChild(btnEliminar);

        const btnVerMas = document.createElement("button");
        btnVerMas.className = "boton verRiesgos__boton--verMas";
        btnVerMas.dataset.id = info.id;
        btnVerMas.textContent = "Ver más";
        div.appendChild(btnVerMas);

        return div;
    };

    /**
     * Disparador Global Helper 'Paginacion' -> Fetch endpoint GET list and auto render pages.
     */
    const recargarContainer = async () => {
        contenedor.innerHTML = ""; // Limpiar Virtual DOM Container
        await paginacion(`availableResources/familyPlan/${id}`, mensajeVacio, carta);
    };

    // DELEGADOR GLOBAL Eventos Botones Tarjetas (Optimización Performance N-1)
    contenedor.addEventListener("click", async (e) => {

        const boton = e.target.closest("button"); // Caza solo clicks tipo Elemento HTML Boton
        if (!boton) return;

        const resourceId = boton.dataset.id; // DB PK Extraida de Atributo del Html

        // Branch Editar Recurso
        if (boton.classList.contains("verRiesgos__boton--editar")) {
            location.href = `#/voluntario/plan_familiar/recursos/editar?familia_id=${id}&recurso_id=${resourceId}`;
        }

        // Branch Eliminar Físicamente
        if (boton.classList.contains("verRiesgos__boton--eliminar")) {
            
            // Auto Confirmator UI Security
            const confirmacion = await alerta.alertaQuest(
                "¿Seguro que deseas eliminar este recurso?"
            );

            if (!confirmacion.isConfirmed) return;

            // Exec HTTP DELETE
            const eliminado = await api.delet(`availableResources/${resourceId}`);

            if (eliminado.success) {
                await alerta.alertaOK(eliminado.message);
                await recargarContainer(); // Auto Refresh Vista local (desaparece)
            } else {
                alerta.alertaError(eliminado.message);
            }
        }

        // Branch Ver Detalle Amplio en Popup Modal
        if (boton.classList.contains("verRiesgos__boton--verMas")) {
            modalRecursoDisponible.ver(resourceId);
        }
    });

    // AutoBoot First Fetch
    await recargarContainer();
};