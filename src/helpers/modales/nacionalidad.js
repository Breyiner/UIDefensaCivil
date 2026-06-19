/**
 * Helper de Modales CRUD: Nacionalidad (nacionalidad.js)
 * Centraliza la creación en tiempo de ejecución de las ventanas emergentes (SweetAlert)
 * para el catálogo básico de nacionalidades, permitiendo visualizarlas (y cambiar su estado), crearlas y editarlas.
 */
import * as api from "../api";
import * as alerta from "../alertas";

/* =====================================================
   VER Y ALTERAR ESTADO LÓGICO
==================================================== */
// Lanza un modal informativo de una Nacionalidad específica
export const ver = async (id, recargarContainer) => {

    // Despacha la solicitud GET buscando el registro por su Primary Key
    const datos = await api.get(`nationalities/${id}`);

    // Diseña el DOM a inyectar en SweetAlert
    const modalDiv = document.createElement("div");
    modalDiv.classList.add("modalVer", "modal-50");

    const datoDiv = document.createElement("div");
    datoDiv.classList.add("modalVer__dato");

    const icon = document.createElement("i");
    icon.classList.add("ri-flag-line");

    const tituloDiv = document.createElement("div");
    tituloDiv.classList.add("modalVer__titulo");
    tituloDiv.textContent = "Nombre";

    const textoDiv = document.createElement("div");
    textoDiv.classList.add("modalVer__texto");
    textoDiv.textContent = datos.name;

    datoDiv.append(icon, tituloDiv, textoDiv);
    modalDiv.appendChild(datoDiv);

    // Llama al sistema base de Alertas pasándole qué botones manejará
    alerta.VerEstado(
        modalDiv,
        true, // Indica verdadero el parámetro de permitir Edición
        datos.is_active, // Pasa el estado real de la BD (1 = Activo, 0 = Inactivo)

        // CALLBACK EDITAR: Llama a la siguiente lógica encargada de edición pasándole los mismos parámetros
        async () => editar(id, recargarContainer),

        // CALLBACK ACTIVAR: Rutina manual que el usuario pide para reactivar el catálogo
        async () => {
            const resp = await api.patch(`nationalities/status/${id}`, { is_active: 1 });
            if (resp.success) {
                await alerta.alertaOK(resp.message); // Éxito guardando
                await recargarContainer(); // Cargar la tabla global nuevamente
            } else {
                alerta.alertaWarning(resp.message);} // Respuesta fallida
        },

        // CALLBACK DESACTIVAR: Rutina para marcar el estatus lógico a cero
        async () => {
            const resp = await api.patch(`nationalities/status/${id}`, { is_active: 0 });
            if (resp.success) {
                await alerta.alertaOK(resp.message); // Operación de desactivación lograda
                await recargarContainer(); // Actualizar UI
            } else {
                alerta.alertaWarning(resp.message);} // Hubo problemas
        },
        'nationalities', // Endpoint base
        id
    );
};


/* =====================================================
   CREAR
==================================================== */
// Exporta la UI interactiva que permite a un Administrador crear nuevas nacionalidades
export const crear = async (recargarContainer) => {

    const explicacionDiv = document.createElement("div");
    explicacionDiv.classList.add("explicacion", "modal");

    const tituloP = document.createElement("p");
    tituloP.classList.add("explicacion__titulo");
    tituloP.textContent = "Crear Nacionalidad";
    explicacionDiv.appendChild(tituloP);

    const formDiv = document.createElement("div");
    formDiv.classList.add("form");

    const inputBoxDiv = document.createElement("div");
    inputBoxDiv.classList.add("form__inputBox", "modal-50");

    const icon = document.createElement("i");
    icon.classList.add("ri-flag-2-fill");

    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("form__input", "form__nombre");
    input.placeholder = "Nombre de la nacionalidad";
    input.autocomplete = "off";

    inputBoxDiv.append(icon, input);
    formDiv.appendChild(inputBoxDiv);

    const container = document.createElement("div");
    container.append(explicacionDiv, formDiv);

    // Utiliza la estructura Swal genérica de "Crear" para invocarlo
    alerta.Crear(container, async () => {

        // Recoge el texto introducido por el usuario dentro del modal HTML
        const nombre = document.querySelector(".form__nombre").value;

        // Dispara la persistencia al backend enviándolo en formato objeto Payload JSON
        const data = await api.post("nationalities", { name: nombre });

        if (data.success) {
            await alerta.alertaOK(data.message); // Inserción exitosa devuelta por backend
            await recargarContainer(); // Ordena actualizar la grilla global
        } else {
            alerta.alertaWarning(data.message, data.errors); // Problema (ej. Ya existe, duplicado)
        }

    });
};


/* =====================================================
   EDITAR
==================================================== */
// Abre el modal de formulario popular con la información cargada desde DB
export const editar = async (id, recargarContainer) => {

    // Recupera lo guardado en el backend
    const info = await api.get(`nationalities/${id}`);

    const explicacionDiv = document.createElement("div");
    explicacionDiv.classList.add("explicacion", "modal");

    const tituloP = document.createElement("p");
    tituloP.classList.add("explicacion__titulo");
    tituloP.textContent = "Editar Nacionalidad";
    explicacionDiv.appendChild(tituloP);

    const formDiv = document.createElement("div");
    formDiv.classList.add("form");

    const inputBoxDiv = document.createElement("div");
    inputBoxDiv.classList.add("form__inputBox", "modal-50");

    const icon = document.createElement("i");
    icon.classList.add("ri-flag-2-fill");

    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("form__input", "form__nombre");
    input.value = info.name;
    input.autocomplete = "off";

    inputBoxDiv.append(icon, input);
    formDiv.appendChild(inputBoxDiv);

    const container = document.createElement("div");
    container.append(explicacionDiv, formDiv);

    // Captura cambios tras oprimir confirmar de Swal
    alerta.Crear(container, async () => {

        // Lee el input
        const nombre = document.querySelector(".form__nombre").value;

        // Hace una petición Partial Modification (PATCH) solo del nombre
        const data = await api.patch(`nationalities/${id}`, { name: nombre });

        if (data.success) {
            await alerta.alertaOK(data.message); // Todo bien
            await recargarContainer(); // Carga de nuevo la lista
        } else {
            alerta.alertaWarning(data.message, data.errors); // Algo salió mal (backend error)
        }

    });
};
