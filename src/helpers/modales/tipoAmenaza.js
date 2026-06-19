/**
 * Helper de Modales CRUD: Tipo de Amenaza (tipoAmenaza.js)
 * Interfaz Pop-Up prefabricada (SweetAlert) para administrar el 
 * catálogo de tipos de amenazas de riesgo latentes.
 */
import * as api from "../api";
import * as alerta from "../alertas";

/* =====================================================
   VER Y ALTERAR ESTADO LÓGICO
==================================================== */
// Consulta información estática base pregrabada sobre una Amenaza e integra Switchs CRUD
export const ver = async (id, recargarContainer) => {

    // Extrae la unidad dictatorial desde el listado backend REST
    const datos = await api.get(`threatTypes/${id}`);

    const modalDiv = document.createElement("div");
    modalDiv.classList.add("modalVer", "modal-50");

    const datoDiv = document.createElement("div");
    datoDiv.classList.add("modalVer__dato", "modalVer__dato--largo");

    const icon = document.createElement("i");
    icon.classList.add("ri-alert-line");

    const tituloDiv = document.createElement("div");
    tituloDiv.classList.add("modalVer__titulo");
    tituloDiv.textContent = "Nombre";

    const textoDiv = document.createElement("div");
    textoDiv.classList.add("modalVer__texto");
    textoDiv.textContent = datos.name;

    datoDiv.append(icon, tituloDiv, textoDiv);
    modalDiv.appendChild(datoDiv);

    // Patrón VerEstado invocado: Añade botón Editar si habilitado, y botón palanca Lógico Is_Active
    alerta.VerEstado(
        modalDiv,
        true, // Encender botón 'Edit'
        datos.is_active, // Determina estatus booleano previo db (Activalo / Desactivalo) predeterminado

        // EDITAR (Enlace a función contigua)
        async () => editar(id, recargarContainer),

        // ACTIVAR (Evento asíncrono para Reactivar el catalog item)
        async () => {
            // PATCH directo al Endpoint de status localizando un 1 lógico
            const resp = await api.patch(`threatTypes/status/${id}`, { is_active: 1 });
            if (resp.success) {
                await alerta.alertaOK(resp.message);
                await recargarContainer(); // Carga refresh contenedor principal en Table Main
            } else {
                alerta.alertaWarning(resp.message);
            }
        },

        // DESACTIVAR (Evento apagado lógico. Provee seguridad ref interrumpiendo sin Borrar SQL)
        async () => {
            // PATCH invirtiendo a 0 lógico
            const resp = await api.patch(`threatTypes/status/${id}`, { is_active: 0 });
            if (resp.success) {
                await alerta.alertaOK(resp.message);
                await recargarContainer();
            } else {
                alerta.alertaWarning(resp.message);
            }
        },
        'threatTypes', // URI helper referencial interior framework modales locales
        id
    );
};


/* =====================================================
   CREAR
==================================================== */
// Lanzamiento para inyección general de tipos únicos (Ej: Inundación, Sísmico) en el sistema backend
export const crear = async (recargarContainer) => {

    const explicacionDiv = document.createElement("div");
    explicacionDiv.classList.add("explicacion", "modal");

    const tituloP = document.createElement("p");
    tituloP.classList.add("explicacion__titulo");
    tituloP.textContent = "Crear Tipo de Amenaza";
    explicacionDiv.appendChild(tituloP);

    const formDiv = document.createElement("div");
    formDiv.classList.add("form");

    const inputBoxDiv = document.createElement("div");
    inputBoxDiv.classList.add("form__inputBox", "modal-50");

    const icon = document.createElement("i");
    icon.classList.add("ri-alert-fill");

    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("form__input", "form__nombre");
    input.placeholder = "Nombre del tipo de amenaza";
    input.autocomplete = "off";

    inputBoxDiv.append(icon, input);
    formDiv.appendChild(inputBoxDiv);

    const container = document.createElement("div");
    container.append(explicacionDiv, formDiv);

    // Manda el string modal crudo, y empalma el bloque Confirm / Create en la UI del alerta
    alerta.Crear(container, async () => {

        // Evalúa captador Value DOM
        const nombre = document.querySelector(".form__nombre").value;

        // Rutina peticionaria vía HTTP POST JSON body "name"
        const data = await api.post("threatTypes", { name: nombre });

        // Evaluando si todo es correcto para la ejecución general o emitir advertencia custom backend errors
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
// Dispara interfaz gráfica clon al crear, pero suplicando info pre-fill en los Values 
export const editar = async (id, recargarContainer) => {

    // Descarga info nativa del objeto central de DB evitando usar un String o cache
    const info = await api.get(`threatTypes/${id}`);

    const editExplicacionDiv = document.createElement("div");
    editExplicacionDiv.classList.add("explicacion", "modal");

    const editTituloP = document.createElement("p");
    editTituloP.classList.add("explicacion__titulo");
    editTituloP.textContent = "Editar Tipo de Amenaza";
    editExplicacionDiv.appendChild(editTituloP);

    const editFormDiv = document.createElement("div");
    editFormDiv.classList.add("form");

    const editInputBoxDiv = document.createElement("div");
    editInputBoxDiv.classList.add("form__inputBox", "modal-50");

    const editIcon = document.createElement("i");
    editIcon.classList.add("ri-alert-fill");

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.classList.add("form__input", "form__nombre");
    editInput.value = info.name;
    editInput.autocomplete = "off";

    editInputBoxDiv.append(editIcon, editInput);
    editFormDiv.appendChild(editInputBoxDiv);

    const container = document.createElement("div");
    container.append(editExplicacionDiv, editFormDiv);

    // Engancha acción a ejecutarse tras interactuar "Confirm" o "Completar"
    alerta.Crear(container, async () => {

        // Recibe y extrae
        const nombre = document.querySelector(".form__nombre").value;

        // Pide actualización con cuerpo modificado
        const data = await api.patch(`threatTypes/${id}`, { name: nombre });

        // Valuar
        if (data.success) {
            await alerta.alertaOK(data.message);
            await recargarContainer();
        } else {
            alerta.alertaWarning(data.message, data.errors);
        }

    });
};
