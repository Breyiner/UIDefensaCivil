/**
 * Helper de Modales CRUD: Vulnerabilidad (vulnerabilidad.js)
 * Interfaz Pop-Up prefabricada (SweetAlert) para administrar el 
 * catálogo de deficiencias o vulnerabilidades típicas.
 */
import * as api from "../api";
import * as alerta from "../alertas";

/* =====================================================
   VER Y ALTERAR ESTADO LÓGICO
==================================================== */
// Consulta información base sobre la Vulnerabilidad y enlaza palancas
export const ver = async (id, recargarContainer) => {

    // Descarga json en tiempo real
    const datos = await api.get(`vulnerabilities/${id}`);

    const modalDiv = document.createElement("div");
    modalDiv.classList.add("modalVer", "modal-50");

    const datoDiv = document.createElement("div");
    datoDiv.classList.add("modalVer__dato", "modalVer__dato--largo");

    const icon = document.createElement("i");
    icon.classList.add("ri-error-warning-line");

    const tituloDiv = document.createElement("div");
    tituloDiv.classList.add("modalVer__titulo");
    tituloDiv.textContent = "Nombre";

    const textoDiv = document.createElement("div");
    textoDiv.classList.add("modalVer__texto");
    textoDiv.textContent = datos.name;

    datoDiv.append(icon, tituloDiv, textoDiv);
    modalDiv.appendChild(datoDiv);

    // Engancha el wrapper nativo de Estado, inserta Modificar si True
    alerta.VerEstado(
        modalDiv,
        true, // Encender botón 'Edit'
        datos.is_active, // Estatus booleano DB

        // EDITAR (Enlace a función contigua)
        async () => editar(id, recargarContainer),

        // ACTIVAR (Evento para Reactivar el registro a la red global)
        async () => {
            // PATCH directo al Endpoint de status localizando un 1 lógico
            const resp = await api.patch(`vulnerabilities/status/${id}`, { is_active: 1 });
            if (resp.success) {
                await alerta.alertaOK(resp.message);
                await recargarContainer(); // Carga refresh UI padre
            } else {
                alerta.alertaWarning(resp.message);
            }
        },

        // DESACTIVAR (Evento apagado lógico para conservación del historial SQL)
        async () => {
            // PATCH invirtiendo a 0 lógico
            const resp = await api.patch(`vulnerabilities/status/${id}`, { is_active: 0 });
            if (resp.success) {
                await alerta.alertaOK(resp.message);
                await recargarContainer();
            } else {
                alerta.alertaWarning(resp.message);
            }
        },
        'vulnerabilities', // URI local
        id
    );
};


/* =====================================================
   CREAR
==================================================== */
// Dispara interfaz que requiere input de Nombre para asentar una nueva vulnerabilidad
export const crear = async (recargarContainer) => {

    const explicacionDiv = document.createElement("div");
    explicacionDiv.classList.add("modal-edicion__cabecera");

    const tituloP = document.createElement("p");
    tituloP.classList.add("modal-edicion__titulo");
    tituloP.textContent = "Crear Vulnerabilidad";
    explicacionDiv.appendChild(tituloP);

    const formDiv = document.createElement("div");
    formDiv.classList.add("form");

    const inputBoxDiv = document.createElement("div");
    inputBoxDiv.classList.add("form__inputBox", "modal-50");

    const icon = document.createElement("i");
    icon.classList.add("ri-error-warning-fill");

    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("form__input", "form__nombre");
    input.placeholder = "Nombre de la vulnerabilidad";
    input.autocomplete = "off";

    inputBoxDiv.append(icon, input);
    formDiv.appendChild(inputBoxDiv);

    const container = document.createElement("div");
    container.append(explicacionDiv, formDiv);

    // Escucha el submit afirmativo del sweetAlert
    alerta.Crear(container, async () => {

        // Evalúa captador Value DOM
        const nombre = document.querySelector(".form__nombre").value;

        // Rutina POST inserción cruda
        const data = await api.post("vulnerabilities", { name: nombre });

        // Evaluando si la confirmación backend rebotó o acertó
        if (data.success) {
            await alerta.alertaOK(data.message);
            await recargarContainer(); // Refresh total
        } else {
            alerta.alertaWarning(data.message, data.errors);
        }

    });
};


/* =====================================================
   EDITAR
==================================================== */
// Permite modificar el nombre de una vulnerabilidad específica (pre-cargándola)
export const editar = async (id, recargarContainer) => {

    // Extrae la unidad directa usando path API local
    const info = await api.get(`vulnerabilities/${id}`);

    const editExplicacionDiv = document.createElement("div");
    editExplicacionDiv.classList.add("explicacion", "modal");

    const editTituloP = document.createElement("p");
    editTituloP.classList.add("explicacion__titulo");
    editTituloP.textContent = "Editar Vulnerabilidad";
    editExplicacionDiv.appendChild(editTituloP);

    const editFormDiv = document.createElement("div");
    editFormDiv.classList.add("form");

    const editInputBoxDiv = document.createElement("div");
    editInputBoxDiv.classList.add("form__inputBox", "modal-50");

    const editIcon = document.createElement("i");
    editIcon.classList.add("ri-error-warning-fill");

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.classList.add("form__input", "form__nombre");
    editInput.value = info.name;
    editInput.autocomplete = "off";

    editInputBoxDiv.append(editIcon, editInput);
    editFormDiv.appendChild(editInputBoxDiv);

    const container = document.createElement("div");
    container.append(editExplicacionDiv, editFormDiv);

    // Engancha acción a ejecutarse tras interactuar "Confirm"
    alerta.Crear(container, async () => {

        // Value del único form field
        const nombre = document.querySelector(".form__nombre").value;

        // Pide actualización con PATCH endpoint REST
        const data = await api.patch(`vulnerabilities/${id}`, { name: nombre });

        // Valuar
        if (data.success) {
            await alerta.alertaOK(data.message);
            await recargarContainer();
        } else {
            alerta.alertaWarning(data.message, data.errors);
        }

    });
};
