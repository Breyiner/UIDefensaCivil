/**
 * Helper de Modales CRUD: Departments (departments.js)
 * Módulo especializado en construir en tiempo de ejecución (Inyección de Strings HTML)
 * y abrir dialogos SweetAlert para el catálogo de departamentos.
 */

import * as api from "../api";
import * as alerta from "../alertas";
import * as validacion from "../validacionInputs";

/* =====================================================
   CREAR
==================================================== */
// Crea y levanta el cuadro de diálogo con un formulario vacío 
export const crear = async (recargarContainer) => {

    const explicacionDiv = document.createElement("div");
    explicacionDiv.classList.add("explicacion", "modal");

    const tituloP = document.createElement("p");
    tituloP.classList.add("explicacion__titulo");
    tituloP.textContent = "Crear Departamento";
    explicacionDiv.appendChild(tituloP);

    const formDiv = document.createElement("div");
    formDiv.classList.add("form");

    const inputDiv = document.createElement("div");
    inputDiv.classList.add("input");

    const inputBoxDiv = document.createElement("div");
    inputBoxDiv.classList.add("form__inputBox", "modal-50");

    const icon = document.createElement("i");
    icon.classList.add("ri-map-2-line");

    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("form__input", "form__nombre");
    input.placeholder = "Nombre del departamento";
    input.autocomplete = "off";
    input.dataset.tipo = "textoCorto";

    inputBoxDiv.append(icon, input);
    inputDiv.appendChild(inputBoxDiv);
    formDiv.appendChild(inputDiv);

    const container = document.createElement("div");
    container.append(explicacionDiv, formDiv);

    alerta.Crear(container, async () => {
        const contenedor = document.querySelector(".form");
        const nombre = document.querySelector(".form__nombre").value;
        const booleanValidacion = validacion.validadorAutomatico.validarTodo(contenedor)
        if (!booleanValidacion) return false
        const data = await api.post("departments", { name: nombre });

        if (data.success) {
            await alerta.alertaOK(data.message);
            await recargarContainer();
        } else {
            alerta.alertaWarning(data.message, data.errors);
        }
    },
    async () => {
        const contenedor = document.querySelector(".form");
        validacion.validadorAutomatico.init(contenedor);
    }
    );
};