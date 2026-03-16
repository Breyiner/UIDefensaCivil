/**
 * Helper de Modales CRUD: Departments (departments.js)
 * Módulo especializado en construir en tiempo de ejecución (Inyección de Strings HTML)
 * y abrir dialogos SweetAlert para el catálogo de departamentos.
 */

import * as api from "../api";
import * as alerta from "../alertas";
import * as validacion from "../validacionInputs";
/* =====================================================
   VER
==================================================== */
// Función que invoca un modal para leer los datos del departamento
export const ver = async (id, recargarContainer) => {

    // Consume la API pidiendo los detalles del departamento por ID
    const datos = await api.get(`departments/${id}`);

    // Diseña la interfaz HTML usando los datos inyectados
    const htmlModal = `
        <div class="modalVer modal-50">
            <div class="modalVer__dato">
                <i class="ri-map-2-line"></i>
                <div class="modalVer__titulo">Nombre</div>
                <div class="modalVer__texto">${datos.name}</div>
            </div>
        </div>
    `;

    // Utiliza el helper pero sin lógica de estado
    alerta.verDepartCiudad(htmlModal,async () => editar(id, recargarContainer),null,null,'departments',id);
};


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
            <div class="form__inputBox modal-50">
                <i class="ri-map-2-line"></i>
                <input type="text" class="form__input form__nombre" 
                placeholder="Nombre del departamento"autocomplete="off"
                data-tipo="textoCorto">
            </div>
        </div>
    `;

    alerta.Crear(htmlModal, async () => {
        const contenedor = document.querySelector(".form");
        const nombre = document.querySelector(".form__nombre").value;
        const booleanValidacion = validacion.validadorAutomatico.validarTodo(contenedor)
        console.log(booleanValidacion);
        if (!booleanValidacion) return false
        const data = await api.post("departments", { name: nombre });

        if (data.success) {
            await alerta.alertaOK(data.message);
            await recargarContainer();
        } else {
            alerta.alertaWarning(data.message, data.errors);
        }
    });
};


/* =====================================================
   EDITAR
==================================================== */
// Despliega una UI de edición con los datos poblados del servidor
export const editar = async (id, recargarContainer) => {

    const info = await api.get(`departments/${id}`);

    const htmlModal = `
        <div class="explicacion modal">
            <p class="explicacion__titulo">Editar Departamento</p>
        </div>
        <div class="form">
            <div class="form__inputBox modal-50">
                <i class="ri-map-2-line"></i>
                <input 
                    type="text" 
                    class="form__input form__nombre"
                    value="${info.name}"
                    autocomplete="off">
            </div>
        </div>
    `;

    alerta.Crear(htmlModal, async () => {

        const nombre = document.querySelector(".form__nombre").value;

        const data = await api.put(`departments/${id}`, { name: nombre });

        if (data.success) {
            await alerta.alertaOK(data.message);
            await recargarContainer();
        } else {
            alerta.alertaWarning(data.message, data.errors);
        }

    });
};