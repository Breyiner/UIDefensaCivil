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
    
    // Plantilla modal de estilo Grid asimétrico (modal-50) visualizando campos leídos
    const htmlModal = `
        <div class="modalVer modal-50">
            <div class="modalVer__dato modalVer__dato--largo">
                <i class="ri-questionnaire-line"></i>
                <div class="modalVer__titulo">Descripción</div>
                <div class="modalVer__texto">${datos.description}</div>
            </div>
            <div class="modalVer__dato modalVer__dato--largo">
                <i class="ri-question-line"></i>
                <div class="modalVer__titulo">¿Precaución?</div>
                <div class="modalVer__texto">${datos.question_caution ? "Sí" : "No"}</div>
            </div>
        </div>
    `;

    // Utiliza un patrón extendido de SweetAlert llamado "VerEstado" (probablemente implementa Toggle de Active/Inactive)
    alerta.VerEstado(
        htmlModal,
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
    // Skeleton base
    const htmlModal = `
        <div class="explicacion modal">
            <p class="explicacion__titulo">Crear Recurso</p>
        </div>

        <div class="form">
            <div class="form__inputBox modal-50">
                <i class="ri-questionnaire-fill"></i>
                <input 
                    type="text" 
                    class="form__input form__descripcion" 
                    placeholder="Descripción del recurso"
                    autocomplete="off">
            </div>
            <div class="form__inputBox">
                <i class="ri-question-fill"></i>
                <select class="form__input form__precaucion">
                    <option value="1">Sí</option>
                    <option value="0">No</option>
                </select>
            </div>
        </div>
    `;

    // Listener de Sweet Alert `confirmButton`
    alerta.Crear(htmlModal, async () => {
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

    const htmlModal = `
        <div class="explicacion modal">
            <p class="explicacion__titulo">Editar Recurso</p>
        </div>
        <div class="form">
            <div class="form__inputBox modal-50">
                <i class="ri-questionnaire-fill"></i>
                <input 
                    type="text" 
                    class="form__input form__descripcion"
                    value="${info.description}"
                    autocomplete="off">
            </div> 
            <div class="form__inputBox">
                <i class="ri-question-fill"></i>
                <select class="form__input form__precaucion">
                    <option value="1" ${info.question_caution ? "selected" : ""}>Sí</option>
                    <option value="0" ${!info.question_caution ? "selected" : ""}>No</option>
                </select>
            </div>
        </div>
    `;

    // Confirmación al editar
    alerta.Crear(htmlModal, async () => {
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
