/**
 * Helper de Modales CRUD: Calidad de Vivienda (calidadVivienda.js)
 * Módulo especializado en construir en tiempo de ejecución (Inyección de Strings HTML) 
 * y abrir los pop-ups asíncronos para el mantenimiento de este sub-modelo.
 */
import * as api from "../api";
import * as alerta from "../alertas";

/* =====================================================
   VER Y ALTERAR ESTADO LÓGICO (Activo/Inactivo)
==================================================== */
// Exporta la función para mostrar la ventana modal con los datos de una calidad de vivienda
export const ver = async (id, recargarContainer) => {

    // Pide a la API los datos de la calidad de vivienda específica por su ID
    const datos = await api.get(`housingQualities/${id}`);

    // Construye el componente visual HTML inyectando el nombre devuelto por la API
    const htmlModal = `
        <div class="modalVer modal-50">
            <div class="modalVer__dato">
                <i class="ri-home-4-line"></i>
                <div class="modalVer__titulo">Nombre</div>
                <div class="modalVer__texto">${datos.name}</div>
            </div>
        </div>
    `;

    // Llama al helper de alertas generales para renderizar el modal pasándole el HTML creado
    alerta.VerEstado(
        htmlModal,
        true, // Indica que este modal tiene botón de edición
        datos.is_active, // Determina si la calidad de vivienda actual está activa o inactiva

        // EDITAR: Callback ejecutado cuando el usuario hace clic en el botón de edición
        async () => editar(id, recargarContainer),

        // ACTIVAR: Callback si la calidad de vivienda estaba inactiva y el usuario desea activarla
        async () => {
            // Envía la solicitud PATCH al backend para cambiar el estado a activo (1)
            const resp = await api.patch(`housingQualities/status/${id}`, { is_active: 1 });
            if (resp.success) {
                await alerta.alertaOK(resp.message); // Muestra mensaje de éxito
                await recargarContainer(); // Recarga la tabla de datos en la vista principal
            } else {
                alerta.alertaWarning(resp.message); // Si falla, muestra error
            }
        },

        // DESACTIVAR: Callback si el usuario quiere suspender o inactivar la calidad de vivienda
        async () => {
            // Envía la solicitud PATCH para inhabilitarla (0)
            const resp = await api.patch(`housingQualities/status/${id}`, { is_active: 0 });
            if (resp.success) {
                await alerta.alertaOK(resp.message); // Muestra éxito
                await recargarContainer(); // Recarga vista global
            } else {
                alerta.alertaWarning(resp.message); // Muestra error
            }
        },
        'housingQualities', // Endpoint base asociado
        id // ID para operaciones
    );
};


/* =====================================================
   CREAR
==================================================== */
// Muestra el formulario vacío para registrar una nueva calidad de vivienda
export const crear = async (recargarContainer) => {

    // Fabrica la interfaz del formulario en HTML
    const htmlModal = `
        <div class="explicacion modal">
            <p class="explicacion__titulo">Crear Calidad de Vivienda</p>
        </div>

        <div class="form">
            <div class="form__inputBox modal-50">
                <i class="ri-home-5-fill"></i>
                <input 
                    type="text" 
                    class="form__input form__nombre" 
                    placeholder="Nombre de la calidad de vivienda"
                    autocomplete="off">
            </div>
        </div>
    `;

    // Levanta un cuadro de diálogo con el formulario base
    alerta.Crear(htmlModal, async () => {

        // Extrae el valor que el usuario ingresó en el input de texto
        const nombre = document.querySelector(".form__nombre").value;

        // Petición POST a la API para guardar los nuevos datos
        const data = await api.post("housingQualities", { name: nombre });

        // Valida la respuesta del servidor
        if (data.success) {
            await alerta.alertaOK(data.message); // Informa el éxito
            await recargarContainer(); // Ordena actualizar la grilla o lista general
        } else {
            alerta.alertaWarning(data.message, data.errors); // Provee el mensaje de validación fallida
        }

    });
};


/* =====================================================
   EDITAR
==================================================== */
// Abre el modal para modificar una calidad de vivienda existente
export const editar = async (id, recargarContainer) => {

    // Primero extrae la información existente desde la BD para rellenar el formulario
    const info = await api.get(`housingQualities/${id}`);

    // Inyecta el valor preexistente en el atributo "value" del input HTML
    const htmlModal = `
        <div class="explicacion modal">
            <p class="explicacion__titulo">Editar Calidad de Vivienda</p>
        </div>
        <div class="form">
            <div class="form__inputBox modal-50">
                <i class="ri-home-5-fill"></i>
                <input 
                    type="text" 
                    class="form__input form__nombre"
                    value="${info.name}"
                    autocomplete="off">
            </div>
        </div>
    `;

    // Carga la alerta personalizada estilo "Crear" pero para confirmar edición
    alerta.Crear(htmlModal, async () => {
        // Captura el valor modificado por el usuario
        const nombre = document.querySelector(".form__nombre").value;

        // Dispara un PATCH para sobreescribir los datos
        const data = await api.patch(`housingQualities/${id}`, { name: nombre });

        if (data.success) {
            await alerta.alertaOK(data.message); // Edición exitosa
            await recargarContainer(); // Refresca lista principal
        } else {
            alerta.alertaWarning(data.message, data.errors); // Falló validación del backend
        }
    });
};
