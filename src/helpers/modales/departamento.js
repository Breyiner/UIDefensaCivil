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

    const htmlModal = `
        <div class="explicacion modal">
            <p class="explicacion__titulo">Crear Departamento</p>
        </div>

        <div class="form">
        <div class="input">
            <div class="form__inputBox modal-50">
                <i class="ri-map-2-line"></i>
                <input type="text" class="form__input form__nombre" 
                placeholder="Nombre del departamento"autocomplete="off"
                data-tipo="textoCorto">
            </div>
        </div>
        </div>
    `;

    alerta.Crear(htmlModal, async () => {
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