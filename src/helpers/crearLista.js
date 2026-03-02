import * as api from "./api";

export default async function crearLista({
    contenedorSelector,
    endpoint,
    renderContenido,
    modal
}) {

    const contenedor = document.querySelector(contenedorSelector);
    if (!contenedor) return;

    let datos = [];

    // 🔥 Función para recargar la lista
    const recargar = async () => {
        datos = await api.get(endpoint);
        contenedor.innerHTML = "";

        for (const item of datos) {

            const boton = document.createElement("button");
            let clases = item.is_active ? "listaDatos__valor" : "listaDatos__valor listaDatos_Inactivo"
            boton.className = clases;
            boton.dataset.id = item.id;
            const spanPrincipal = document.createElement("span");
            spanPrincipal.className = "listaDatos__nombre";

            renderContenido(spanPrincipal, item);

            boton.appendChild(spanPrincipal);
            contenedor.appendChild(boton);
        }
    };

    // Primera carga
    await recargar();

    // 🔥 Delegación de eventos
    contenedor.addEventListener("click", async (e) => {
        const boton = e.target.closest(".listaDatos__valor");
        if (!boton) return;

        const id = boton.dataset.id;

        // Espera si el modal hace algo async
        if (typeof modal === "function") {
            await modal(id, recargar);
        }
    });
}
