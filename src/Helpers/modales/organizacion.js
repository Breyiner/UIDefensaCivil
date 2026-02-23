import * as api from "../api";
import * as alerta from "../alertas";

/* =====================================================
   VER
===================================================== */
export const ver = async (id, recargarContainer) => {

    const datos = await api.get(`organizations/${id}`);
    
    const htmlModal = `
        <div class="modalVer modal-50">
            <div class="modalVer__dato">
                <i class="ri-building-line"></i>
                <div class="modalVer__titulo">Nombre</div>
                <div class="modalVer__texto">${datos.name}</div>
            </div>
            <div class="modalVer__dato">
                <i class="ri-article-line"></i>
                <div class="modalVer__titulo">Seccional</div>
                <div class="modalVer__texto">${datos.sectional.name}</div>
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
            const resp = await api.patch(`organizations/status/${id}`, { is_active: 1 });
            if (resp.success) {
                await alerta.alertaOK(resp.message);
                await recargarContainer();
            } else {
                alerta.alertaWarning(resp.message);}
        },

        // DESACTIVAR
        async () => {
            const resp = await api.patch(`organizations/status/${id}`, { is_active: 0 });
            if (resp.success) {
                await alerta.alertaOK(resp.message);
                await recargarContainer();
            } else {
                alerta.alertaWarning(resp.message);}
        },
        'organizations',
        id
    );
};


/* =====================================================
   CREAR
===================================================== */
export const crear = async (recargarContainer) => {

    // Obtener las secciones para el select
    const secciones = await api.get("sectionals");

    const opciones = secciones.map(sec => `<option value="${sec.id}">${sec.name}</option>`).join('');

    const htmlModal = `
        <div class="explicacion modal">
            <p class="explicacion__titulo">Crear Organización</p>
        </div>

        <div class="form">
            <div class="form__inputBox modal-50">
                <i class="ri-building-fill"></i>
                <input 
                    type="text" 
                    class="form__input form__nombre" 
                    placeholder="Nombre de la organización"
                    autocomplete="off">
            </div>
            <div class="form__inputBox">
                <i class="ri-article-fill"></i>
                <select class="form__input form__seccional">
                    ${opciones}
                </select>
            </div>
        </div>
    `;

    alerta.Crear(htmlModal, async () => {

        const nombre = document.querySelector(".form__nombre").value;
        const seccional = document.querySelector(".form__seccional").value;

        const data = await api.post("organizations", { name: nombre, sectional_id: seccional });

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

    const info = await api.get(`organizations/${id}`);
    const secciones = await api.get("sectionals");

    const opciones = secciones.map(sec => `
        <option value="${sec.id}" ${info.section && info.section.id === sec.id ? "selected" : ""}>
            ${sec.name}
        </option>
    `).join('');

    const htmlModal = `
        <div class="explicacion modal">
            <p class="explicacion__titulo">Editar Organización</p>
        </div>
        <div class="form">
            <div class="form__inputBox modal-50">
                <i class="ri-building-fill"></i>
                <input 
                    type="text" 
                    class="form__input form__nombre"
                    value="${info.name}"
                    autocomplete="off">
            </div> 
            <div class="form__inputBox">
                <i class="ri-article-fill"></i>
                <select class="form__input form__seccional">
                    ${opciones}
                </select>
            </div>
        </div>
    `;

    alerta.Crear(htmlModal, async () => {

        const nombre = document.querySelector(".form__nombre").value;
        const seccional = document.querySelector(".form__seccional").value;

        const data = await api.patch(`organizations/${id}`, { name: nombre, sectional_id: seccional });

        if (data.success) {
            await alerta.alertaOK(data.message);
            await recargarContainer();
        } else {
            alerta.alertaWarning(data.message, data.errors);
        }

    });
};
