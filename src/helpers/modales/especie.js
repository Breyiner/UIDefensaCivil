/**
 * Helper de Modales CRUD: Especie Animal (especie.js)
 * Módulo especializado en construir en tiempo de ejecución (Inyección de Strings HTML)
 * y abrir dialogos SweetAlert para el catálogo de tipos de mascotas.
 */
import * as api from "../api";
import * as alerta from "../alertas";

/* =====================================================
   VER Y ALTERAR ESTADO LÓGICO
==================================================== */
// Función que invoca un modal para leer los datos de la especie
export const ver = async (id, recargarContainer) => {

    // Consume la API pidiendo los detalles de la especie por ID
    const datos = await api.get(`species/${id}`);

    // Diseña la interfaz HTML usando los datos inyectados de la respuesta
    const modalDiv = document.createElement("div");
    modalDiv.classList.add("modalVer", "modal-50");

    const datoDiv = document.createElement("div");
    datoDiv.classList.add("modalVer__dato");

    const icon = document.createElement("i");
    icon.classList.add("ri-bear-smile-line");

    const tituloDiv = document.createElement("div");
    tituloDiv.classList.add("modalVer__titulo");
    tituloDiv.textContent = "Nombre";

    const textoDiv = document.createElement("div");
    textoDiv.classList.add("modalVer__texto");
    textoDiv.textContent = datos.name;

    datoDiv.append(icon, tituloDiv, textoDiv);
    modalDiv.appendChild(datoDiv);

    // Utiliza el helper genérico "VerEstado" pasándole lógica de callbacks
    alerta.VerEstado(
        modalDiv,
        true, // Habilita el botón de edición
        datos.is_active, // Informa el estado booleano para mostrar Activar o Desactivar

        // CALLBACK EDITAR: Si el usuario desea modificar el registro
        async () => editar(id, recargarContainer),

        // CALLBACK ACTIVAR: Si oprime botón para devolver al estado Activo (1)
        async () => {
            const resp = await api.patch(`species/status/${id}`, { is_active: 1 });
            if (resp.success) {
                await alerta.alertaOK(resp.message); // Notifica el cambio exitoso
                await recargarContainer(); // Refresca lista global
            } else {
                alerta.alertaWarning(resp.message); // Advierte error
            }
        },

        // CALLBACK DESACTIVAR: Si oprime botón para cambiar a Inactivo (0)
        async () => {
            const resp = await api.patch(`species/status/${id}`, { is_active: 0 });
            if (resp.success) {
                await alerta.alertaOK(resp.message);
                await recargarContainer();
            } else {
                alerta.alertaWarning(resp.message);
            }
        },
        'species', // Parámetro para saber la ruta principal
        id // Identificador
    );
};


/* =====================================================
   CREAR
==================================================== */
// Crea y levanta el cuadro de diálogo con un formulario vacío 
export const crear = async (recargarContainer) => {

    const explicacionDiv = document.createElement("div");
    explicacionDiv.classList.add("explicacion", "modal");

    const tituloP = document.createElement("p");
    tituloP.classList.add("explicacion__titulo");
    tituloP.textContent = "Crear Especie";
    explicacionDiv.appendChild(tituloP);

    const formDiv = document.createElement("div");
    formDiv.classList.add("form");

    const inputBoxDiv = document.createElement("div");
    inputBoxDiv.classList.add("form__inputBox", "modal-50");

    const icon = document.createElement("i");
    icon.classList.add("ri-bear-smile-fill");

    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("form__input", "form__nombre");
    input.placeholder = "Nombre de la especie";
    input.autocomplete = "off";

    inputBoxDiv.append(icon, input);
    formDiv.appendChild(inputBoxDiv);

    const container = document.createElement("div");
    container.append(explicacionDiv, formDiv);

    // Invoca SweetAlert pidiendo que renderice el HTML y envíe la petición POST
    alerta.Crear(container, async () => {

        // Busca el elemento del input en el DOM del modal
        const nombre = document.querySelector(".form__nombre").value;

        // Transporta los nuevos datos JSON al backend
        const data = await api.post("species", { name: nombre });

        // Evaluando el objeto de retorno del servidor
        if (data.success) {
            await alerta.alertaOK(data.message); // Éxito guardando
            await recargarContainer(); // Ordena refrescar
        } else {
            alerta.alertaWarning(data.message, data.errors); // Problemas de validación
        }

    });
};


/* =====================================================
   EDITAR
==================================================== */
// Despliega una UI de edición con los datos poblados del servidor
export const editar = async (id, recargarContainer) => {

    // Extrae el objeto registro original
    const info = await api.get(`species/${id}`);

    const explicacionDiv = document.createElement("div");
    explicacionDiv.classList.add("explicacion", "modal");

    const tituloP = document.createElement("p");
    tituloP.classList.add("explicacion__titulo");
    tituloP.textContent = "Editar Especie";
    explicacionDiv.appendChild(tituloP);

    const formDiv = document.createElement("div");
    formDiv.classList.add("form");

    const inputBoxDiv = document.createElement("div");
    inputBoxDiv.classList.add("form__inputBox", "modal-50");

    const icon = document.createElement("i");
    icon.classList.add("ri-bear-smile-fill");

    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("form__input", "form__nombre");
    input.value = info.name;
    input.autocomplete = "off";

    inputBoxDiv.append(icon, input);
    formDiv.appendChild(inputBoxDiv);

    const container = document.createElement("div");
    container.append(explicacionDiv, formDiv);

    // Pide confirmación y guarda actualización
    alerta.Crear(container, async () => {

        // Obtiene el valor final del input de texto
        const nombre = document.querySelector(".form__nombre").value;

        // Dispara la modificación mediante verbo PATCH
        const data = await api.patch(`species/${id}`, { name: nombre });

        if (data.success) {
            await alerta.alertaOK(data.message); // Listo
            await recargarContainer(); // Repinta grilla
        } else {
            alerta.alertaWarning(data.message, data.errors); // Reporta rechazo
        }

    });
};
    