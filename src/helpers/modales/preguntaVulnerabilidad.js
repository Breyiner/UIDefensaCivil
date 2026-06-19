/**
 * Helper de Modales CRUD: Pregunta Vulnerabilidad (preguntaVulnerabilidad.js)
 * Proporciona interfaces emergentes SweetAlert para interactuar y mantener el 
 * catálogo de Preguntas base aplicadas al evaluar la vulnerabilidad de las viviendas.
 */
import * as api from "../api";
import * as alerta from "../alertas";

/* =====================================================
   VER Y ALTERAR ESTADO LÓGICO
==================================================== */
// Función principal para visualizar los detalles globales de lectura de un elemento Pregunta
export const ver = async (id, recargarContainer) => {
    // Comunica con URL en servidor para sustraer JSON asociado a su ID
    const datos = await api.get(`vulnerableQuestions/${id}`);
    
    const modalDiv = document.createElement("div");
    modalDiv.classList.add("modalVer", "modal-50");

    const descDatoDiv = document.createElement("div");
    descDatoDiv.classList.add("modalVer__dato", "modalVer__dato--largo");

    const descIcon = document.createElement("i");
    descIcon.classList.add("ri-questionnaire-line");

    const descTitulo = document.createElement("div");
    descTitulo.classList.add("modalVer__titulo");
    descTitulo.textContent = "Descripción";

    const descTexto = document.createElement("div");
    descTexto.classList.add("modalVer__texto");
    descTexto.textContent = datos.description;

    descDatoDiv.append(descIcon, descTitulo, descTexto);
    modalDiv.appendChild(descDatoDiv);

    const precDatoDiv = document.createElement("div");
    precDatoDiv.classList.add("modalVer__dato", "modalVer__dato--largo");

    const precIcon = document.createElement("i");
    precIcon.classList.add("ri-question-line");

    const precTitulo = document.createElement("div");
    precTitulo.classList.add("modalVer__titulo");
    precTitulo.textContent = "¿Precaución?";

    const precTexto = document.createElement("div");
    precTexto.classList.add("modalVer__texto");
    precTexto.textContent = datos.question_caution ? "Sí" : "No";

    precDatoDiv.append(precIcon, precTitulo, precTexto);
    modalDiv.appendChild(precDatoDiv);

    // Utiliza un patrón extendido de SweetAlert llamado "VerEstado" (probablemente implementa Toggle de Active/Inactive)
    alerta.VerEstado(
        modalDiv,
        true, // Switch para habilitar opción editar
        datos.is_active, // Variable booleana dictadora de Activado/Desactivado
        // EDITAR (Sección Hook Callback)
        async () => editar(id, recargarContainer),
        // ACTIVAR (Rutina de encendido)
        async () => {
            const resp = await api.patch(`vulnerableQuestions/status/${id}`, { is_active: 1 });
            if (resp.success) {
                await alerta.alertaOK(resp.message); // Banner de culminación
                await recargarContainer(); // Llama a refetch para sincronizar la vista Main list
            } else {
                alerta.alertaWarning(resp.message);
            }
        },
        // DESACTIVAR (Rutina de apagado / soft delete / toggle disable state)
        async () => {
            const resp = await api.patch(`vulnerableQuestions/status/${id}`, { is_active: 0 });
            if (resp.success) {
                await alerta.alertaOK(resp.message);
                await recargarContainer();
            } else {
                alerta.alertaWarning(resp.message);
            }
        },
        'vulnerableQuestions', // Nombre físico de ruta endpoint (usos para generalidades REST si es necesario)
        id
    );
};


/* =====================================================
   CREAR
==================================================== */
// Levantamiento de formulario prefabricado SweetAlert para agregar nuevas entradas de preguntas maestra
export const crear = async (recargarContainer) => {
    const explicacionDiv = document.createElement("div");
    explicacionDiv.classList.add("explicacion", "modal");

    const tituloP = document.createElement("p");
    tituloP.classList.add("explicacion__titulo");
    tituloP.textContent = "Crear Pregunta";
    explicacionDiv.appendChild(tituloP);

    const formDiv = document.createElement("div");
    formDiv.classList.add("form");

    const inputBoxDiv = document.createElement("div");
    inputBoxDiv.classList.add("form__inputBox", "modal-50");

    const iconQuest = document.createElement("i");
    iconQuest.classList.add("ri-questionnaire-fill");

    const inputDesc = document.createElement("input");
    inputDesc.type = "text";
    inputDesc.classList.add("form__input", "form__descripcion");
    inputDesc.placeholder = "Descripción de la pregunta";
    inputDesc.autocomplete = "off";

    inputBoxDiv.append(iconQuest, inputDesc);
    formDiv.appendChild(inputBoxDiv);

    const selectBoxDiv = document.createElement("div");
    selectBoxDiv.classList.add("form__inputBox");

    const iconPrec = document.createElement("i");
    iconPrec.classList.add("ri-question-fill");

    const select = document.createElement("select");
    select.classList.add("form__input", "form__precaucion");

    const optSi = document.createElement("option");
    optSi.value = "1";
    optSi.textContent = "Sí";
    select.appendChild(optSi);

    const optNo = document.createElement("option");
    optNo.value = "0";
    optNo.textContent = "No";
    select.appendChild(optNo);

    selectBoxDiv.append(iconPrec, select);
    formDiv.appendChild(selectBoxDiv);

    const container = document.createElement("div");
    container.append(explicacionDiv, formDiv);

    // Listener de Sweet Alert `confirmButton`
    alerta.Crear(container, async () => {
        // Lee los punteros del DOM modal en pantalla de los inputs de interes
        const descripcion = document.querySelector(".form__descripcion").value;
        const precaucion = document.querySelector(".form__precaucion").value;

        // Dispara la insercción y aguarda bloqueante "await" a que el servidor de DB lo mastique
        const data = await api.post("vulnerableQuestions", { description: descripcion, question_caution: precaucion });

        // Valida finalización y muestra Success animado
        if (data.success) {
            await alerta.alertaOK(data.message);
            await recargarContainer();
        } else {
            // Advierte las anomalías que el validador Backend denegó (Ej: campos cortos, falta letra)
            alerta.alertaWarning(data.message, data.errors);
        }
    });
};


/* =====================================================
   EDITAR
==================================================== */
// Se llama por la acción de "Boton amarillo" de edición inmerso en el helper `VerEstado`
export const editar = async (id, recargarContainer) => {
    // Hace refresh a la información concreta de base de datos antes de pintar UI para no usar data cacheada sucia
    const info = await api.get(`vulnerableQuestions/${id}`);

    const editExplicacionDiv = document.createElement("div");
    editExplicacionDiv.classList.add("explicacion", "modal");

    const editTituloP = document.createElement("p");
    editTituloP.classList.add("explicacion__titulo");
    editTituloP.textContent = "Editar pregunta";
    editExplicacionDiv.appendChild(editTituloP);

    const editFormDiv = document.createElement("div");
    editFormDiv.classList.add("form");

    const editInputBoxDiv = document.createElement("div");
    editInputBoxDiv.classList.add("form__inputBox", "modal-50");

    const editIconQuest = document.createElement("i");
    editIconQuest.classList.add("ri-questionnaire-fill");

    const editInputDesc = document.createElement("input");
    editInputDesc.type = "text";
    editInputDesc.classList.add("form__input", "form__descripcion");
    editInputDesc.value = info.description;
    editInputDesc.autocomplete = "off";

    editInputBoxDiv.append(editIconQuest, editInputDesc);
    editFormDiv.appendChild(editInputBoxDiv);

    const editSelectBoxDiv = document.createElement("div");
    editSelectBoxDiv.classList.add("form__inputBox");

    const editIconPrec = document.createElement("i");
    editIconPrec.classList.add("ri-question-fill");

    const editSelect = document.createElement("select");
    editSelect.classList.add("form__input", "form__precaucion");

    const editOptSi = document.createElement("option");
    editOptSi.value = "1";
    editOptSi.textContent = "Sí";
    if (info.question_caution) editOptSi.selected = true;
    editSelect.appendChild(editOptSi);

    const editOptNo = document.createElement("option");
    editOptNo.value = "0";
    editOptNo.textContent = "No";
    if (!info.question_caution) editOptNo.selected = true;
    editSelect.appendChild(editOptNo);

    editSelectBoxDiv.append(editIconPrec, editSelect);
    editFormDiv.appendChild(editSelectBoxDiv);

    const container = document.createElement("div");
    container.append(editExplicacionDiv, editFormDiv);

    // Confirmación al editar
    alerta.Crear(container, async () => {
        // Identifica variables
        const descripcion = document.querySelector(".form__descripcion").value;
        const precaucion = document.querySelector(".form__precaucion").value;

        // Ocupa "PATCH" método http para variaciones pequeñas dejando intactos los demás fields como isActive
        const data = await api.patch(`vulnerableQuestions/${id}`, { description: descripcion, question_caution: precaucion });

        if (data.success) {
            await alerta.alertaOK(data.message);
            await recargarContainer();
        } else {
            alerta.alertaWarning(data.message, data.errors);
        }
    });
};
