import * as api from "../api";
import * as alerta from "../alertas";

/* =====================================================
   VER
===================================================== */
export const ver = async (id, recargarContainer) => {

    const datos = await api.get(`sectors/${id}`);

    const htmlModal = `
        <div class="modalVer modal-50">
            <div class="modalVer__dato">
                <i class="ri-map-pin-2-line"></i>
                <div class="modalVer__titulo">Nombre</div>
                <div class="modalVer__texto">${datos.name}</div>
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
            const resp = await api.patch(`sectors/status/${id}`, { is_active: 1 });
            if (resp.success) {
                await alerta.alertaOK(resp.message);
                await recargarContainer();
            } else {
                alerta.alertaWarning(resp.message);}
        },

        // DESACTIVAR
        async () => {
            const resp = await api.patch(`sectors/status/${id}`, { is_active: 0 });
            if (resp.success) {
                await alerta.alertaOK(resp.message);
                await recargarContainer();
            } else {
                alerta.alertaWarning(resp.message);}
        },
        'sectors',
        id
    );
};


/* =====================================================
   CREAR
===================================================== */
export const crear = async (recargarContainer) => {

    const htmlModal = `
        <div class="explicacion modal">
            <p class="explicacion__titulo">Crear Sector</p>
        </div>

        <div class="form">
            <div class="form__inputBox modal-50">
                <i class="ri-map-pin-fill"></i>
                <input 
                    type="text" 
                    class="form__input form__nombre" 
                    placeholder="Nombre del sector"
                    autocomplete="off">
            </div>
        </div>
    `;

    alerta.Crear(htmlModal, async () => {

        const nombre = document.querySelector(".form__nombre").value;

        const data = await api.post("sectors", { name: nombre });

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

    const info = await api.get(`sectors/${id}`);

    const htmlModal = `
        <div class="explicacion modal">
            <p class="explicacion__titulo">Editar Sector</p>
        </div>
        <div class="form">
            <div class="form__inputBox modal-50">
                <i class="ri-map-pin-fill"></i>
                <input 
                    type="text" 
                    class="form__input form__nombre"
                    value="${info.name}"
                    autocomplete="off">
            </div>
        </div>
    `;

    alerta.Crear(htmlModal, async () => {

        const nombre = document.querySelector(".form__nombre").value;

        const data = await api.patch(`sectors/${id}`, { name: nombre });

        if (data.success) {
            await alerta.alertaOK(data.message);
            await recargarContainer();
        } else {
            alerta.alertaWarning(data.message, data.errors);
        }

    });
};
