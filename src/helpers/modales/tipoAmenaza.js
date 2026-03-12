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

    // Interfaz asimétrica flex-box para alojar detalles read-only (Solo Ver)
    const htmlModal = `
        <div class="modalVer modal-50">
            <div class="modalVer__dato modalVer__dato--largo">
                <i class="ri-alert-line"></i>
                <div class="modalVer__titulo">Nombre</div>
                <div class="modalVer__texto">${datos.name}</div>
            </div>
        </div>
    `;

    // Patrón VerEstado invocado: Añade botón Editar si habilitado, y botón palanca Lógico Is_Active
    alerta.VerEstado(
        htmlModal,
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

    // Html Template literal enrutando clase base .explicacion para UI Alert y contenedores Form
    const htmlModal = `
        <div class="explicacion modal">
            <p class="explicacion__titulo">Crear Tipo de Amenaza</p>
        </div>

        <div class="form">
            <div class="form__inputBox modal-50">
                <i class="ri-alert-fill"></i>
                <input 
                    type="text" 
                    class="form__input form__nombre" 
                    placeholder="Nombre del tipo de amenaza"
                    autocomplete="off">
            </div>
        </div>
    `;

    // Manda el string modal crudo, y empalma el bloque Confirm / Create en la UI del alerta
    alerta.Crear(htmlModal, async () => {

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

    // UI form clon pre-cargada con Interpolaciones "value="
    const htmlModal = `
        <div class="explicacion modal">
            <p class="explicacion__titulo">Editar Tipo de Amenaza</p>
        </div>
        <div class="form">
            <div class="form__inputBox modal-50">
                <i class="ri-alert-fill"></i>
                <input 
                    type="text" 
                    class="form__input form__nombre"
                    value="${info.name}"
                    autocomplete="off">
            </div>
        </div>
    `;

    // Engancha acción a ejecutarse tras interactuar "Confirm" o "Completar"
    alerta.Crear(htmlModal, async () => {

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
