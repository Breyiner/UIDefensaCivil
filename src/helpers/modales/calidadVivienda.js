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

    // Se crea con el dom los elementos
    const modalDiv = document.createElement("div");
    modalDiv.classList.add("modalVer", "modal-50");

    const datoDiv = document.createElement("div");
    datoDiv.classList.add("modalVer__dato");

    const icon = document.createElement("i");
    icon.classList.add("ri-home-4-line");

    const tituloDiv = document.createElement("div");
    tituloDiv.classList.add("modalVer__titulo");
    tituloDiv.textContent = "Nombre";

    const textoDiv = document.createElement("div");
    textoDiv.classList.add("modalVer__texto");
    textoDiv.textContent = datos.name;

    datoDiv.append(icon, tituloDiv, textoDiv);
    modalDiv.appendChild(datoDiv);

    // Llama al helper de alertas generales para renderizar el modal pasándole el DOM creado
    alerta.VerEstado(
        modalDiv,
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

    // Fabrica la interfaz del formulario con el DOM
    const explicacionDiv = document.createElement("div");
    explicacionDiv.classList.add("modal-edicion__cabecera");

    const tituloP = document.createElement("p");
    tituloP.classList.add("modal-edicion__titulo");
    tituloP.textContent = "Crear Calidad de Vivienda";
    explicacionDiv.appendChild(tituloP);

    const formDiv = document.createElement("div");
    formDiv.classList.add("form");

    const inputBoxDiv = document.createElement("div");
    inputBoxDiv.classList.add("form__inputBox", "modal-50");

    const icon = document.createElement("i");
    icon.classList.add("ri-home-5-fill");

    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("form__input", "form__nombre");
    input.placeholder = "Nombre de la calidad de vivienda";
    input.autocomplete = "off";

    inputBoxDiv.append(icon, input);
    formDiv.appendChild(inputBoxDiv);

    const container = document.createElement("div");
    container.append(explicacionDiv, formDiv);

    // Levanta un cuadro de diálogo con el formulario base
    alerta.Crear(container, async () => {

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
    const explicacionDiv = document.createElement("div");
    explicacionDiv.classList.add("explicacion", "modal");

    const tituloP = document.createElement("p");
    tituloP.classList.add("explicacion__titulo");
    tituloP.textContent = "Editar Calidad de Vivienda";
    explicacionDiv.appendChild(tituloP);

    const formDiv = document.createElement("div");
    formDiv.classList.add("form");

    const inputBoxDiv = document.createElement("div");
    inputBoxDiv.classList.add("form__inputBox", "modal-50");

    const icon = document.createElement("i");
    icon.classList.add("ri-home-5-fill");

    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("form__input", "form__nombre");
    input.value = info.name;
    input.autocomplete = "off";

    inputBoxDiv.append(icon, input);
    formDiv.appendChild(inputBoxDiv);

    const container = document.createElement("div");
    container.append(explicacionDiv, formDiv);

    // Carga la alerta personalizada estilo "Crear" pero para confirmar edición
    alerta.Crear(container, async () => {
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
