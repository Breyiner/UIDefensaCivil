import * as api from "../api";
import * as alerta from "../alertas";

/* =====================================================
   VER
===================================================== */
export const ver = async (id, recargarContainer) => {

    const datos = await api.get(`resources/${id}`);
    
    const htmlModal = `
        <div class="modalVer modal-50">
            <div class="modalVer__dato modalVer__dato--largo">
                <i class="ri-folder-line"></i>
                <div class="modalVer__titulo">Nombre</div>
                <div class="modalVer__texto">${datos.name}</div>
            </div>
            <div class="modalVer__dato modalVer__dato--largo">
                <i class="ri-service-line"></i>
                <div class="modalVer__titulo">Servicio</div>
                <div class="modalVer__texto">${datos.service}</div>
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
            const resp = await api.patch(`resources/status/${id}`, { is_active: 1 });
            if (resp.success) {
                await alerta.alertaOK(resp.message);
                await recargarContainer();
            } else {
                alerta.alertaWarning(resp.message);}
        },

        // DESACTIVAR
        async () => {
            const resp = await api.patch(`resources/status/${id}`, { is_active: 0 });
            if (resp.success) {
                await alerta.alertaOK(resp.message);
                await recargarContainer();
            } else {
                alerta.alertaWarning(resp.message);}
        },
        'resources',
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
                <i class="ri-folder-fill"></i>
                <input 
                    type="text" 
                    class="form__input form__nombre" 
                    placeholder="Nombre del recurso"
                    autocomplete="off">
            </div>
            <div class="form__inputBox">
                <i class="ri-service-fill"></i>
                <input 
                    type="text" 
                    class="form__input form__servicio" 
                    placeholder="Service del recurso"
                    autocomplete="off">
            </div>
        </div>
    `;

    alerta.Crear(htmlModal, async () => {

        const nombre = document.querySelector(".form__nombre").value;

        const servicio = document.querySelector(".form__servicio").value;

        const data = await api.post("resources", { name: nombre, service:servicio });

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

    const info = await api.get(`resources/${id}`);

    const htmlModal = `
        <div class="explicacion modal">
            <p class="explicacion__titulo">Editar Recurso</p>
        </div>
        <div class="form">
            <div class="form__inputBox modal-50">
                <i class="ri-folder-fill"></i>
                <input 
                    type="text" 
                    class="form__input form__nombre"
                    value="${info.name}"
                    autocomplete="off">
            </div> 
            <div class="form__inputBox">
                <i class="ri-service-fill"></i>
                <input 
                    type="text" 
                    class="form__input form__servicio" 
                    value="${info.service}"
                    autocomplete="off">
            </div>
        </div>
    `;

    alerta.Crear(htmlModal, async () => {

        const nombre = document.querySelector(".form__nombre").value;

        const servicio = document.querySelector(".form__servicio").value;

        const data = await api.patch(`resources/${id}`, { name: nombre, service: servicio});

        if (data.success) {
            await alerta.alertaOK(data.message);
            await recargarContainer();
        } else {
            alerta.alertaWarning(data.message, data.errors);
        }

    });
};
