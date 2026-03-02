import * as api from "../api";
import * as alerta from "../alertas";

/* =====================================================
   VER
===================================================== */
export const ver = async (id, recargarContainer) => {

    const datos = await api.get(`vulnerableQuestions/${id}`);
    
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

    alerta.VerEstado(
        htmlModal,
        true,
        datos.is_active,

        // EDITAR
        async () => editar(id, recargarContainer),

        // ACTIVAR
        async () => {
            const resp = await api.patch(`vulnerableQuestions/status/${id}`, { is_active: 1 });
            if (resp.success) {
                await alerta.alertaOK(resp.message);
                await recargarContainer();
            } else {
                alerta.alertaWarning(resp.message);}
        },

        // DESACTIVAR
        async () => {
            const resp = await api.patch(`vulnerableQuestions/status/${id}`, { is_active: 0 });
            if (resp.success) {
                await alerta.alertaOK(resp.message);
                await recargarContainer();
            } else {
                alerta.alertaWarning(resp.message);}
        },
        'vulnerableQuestions',
        id
    );
};


/* =====================================================
   CREAR
===================================================== */
export const crear = async (recargarContainer) => {

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

    alerta.Crear(htmlModal, async () => {

        const descripcion = document.querySelector(".form__descripcion").value;

        const precaucion = document.querySelector(".form__precaucion").value;

        const data = await api.post("vulnerableQuestions", { description: descripcion, question_caution: precaucion });

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
===================================================== */
export const editar = async (id, recargarContainer) => {

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

    alerta.Crear(htmlModal, async () => {

        const descripcion = document.querySelector(".form__descripcion").value;

        const precaucion = document.querySelector(".form__precaucion").value;

        const data = await api.patch(`vulnerableQuestions/${id}`, { description: descripcion, question_caution: precaucion });

        if (data.success) {
            await alerta.alertaOK(data.message);
            await recargarContainer();
        } else {
            alerta.alertaWarning(data.message, data.errors);
        }

    });
};
