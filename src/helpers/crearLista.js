/**
 * Helper Generador de Listas Interactivos (crearLista.js)
 * Función de alto nivel (Componente Creador) para inyectar listas verticales renderizadas dinámicas.
 * Usada principalmente para listas mantenedoras menores (Ej: CRUD Sexos o CRUD Nacionalidades).
 */
import * as api from "./api";

export default async function crearLista({
    contenedorSelector, // Selector '#id' donde van a insertarse las viñetas HTML
    endpoint, // Ruta de petición
    renderContenido, // Callback delegando cómo se debe renderizar el contenido específico (Inyección de spans/imagenes)
    modal // Referencia a otra función SweetAlert modal para disparar si dan un Click en las viñetas.
}) {

    const contenedor = document.querySelector(contenedorSelector);
    if (!contenedor) return;

    let datos = [];

    // 🔥 Función central para solicitar todo fresco y dibujarlo sin recargar página
    const recargar = async () => {
        datos = await api.get(endpoint);
        contenedor.innerHTML = ""; // Limpia contenido fantasma/antiguo

        // Renderiza cada registro como un <button> interactivo de acción
        for (const item of datos) {

            // Botón envoltura base (Viñeta)
            const boton = document.createElement("button");
            // Apaga opacidad de la barra si el ítem esta marcado inactivo
            let clases = item.is_active ? "listaDatos__valor" : "listaDatos__valor listaDatos_Inactivo"
            boton.className = clases;
            boton.dataset.id = item.id; // Clava flag oculto local de su ID Backend referencial

            // Elemento interior donde va el texto o iconos
            const spanPrincipal = document.createElement("span");
            spanPrincipal.className = "listaDatos__nombre";

            // Delega el formato de texto al callback ingresado mediante Inversión de Control
            renderContenido(spanPrincipal, item);

            // Integra jerárquicamente Node y se cuelga a la vista principal
            boton.appendChild(spanPrincipal);
            contenedor.appendChild(boton);
        }
    };

    // Primera carga para iniciar
    await recargar();

    // 🔥 Delegación Activa de Eventos: Engacha el `click` en el contenedor padre principal.
    // Optimiza RAM versus atar un .addEventListener por cada uno de los N botones hijos generados.
    contenedor.addEventListener("click", async (e) => {
        // Busca si el objetivo del click original fue de clase "viñeta"
        const boton = e.target.closest(".listaDatos__valor");
        if (!boton) return;

        const id = boton.dataset.id;

        // Dispara la función "Abrir y Modificar" preasignada (El SweetAlert) transmitiéndole 
        // a qué ID le dieron click y pasándole el control de recarga para auto-refrescar
        if (typeof modal === "function") {
            await modal(id, recargar);
        }
    });
}
