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

    // Modal grid asimétrico para solo lectura (ModalVer)
    const htmlModal = `
        <div class="modalVer modal-50">
            <div class="modalVer__dato modalVer__dato--largo">
                <i class="ri-error-warning-line"></i>
                <div class="modalVer__titulo">Nombre</div>
                <div class="modalVer__texto">${datos.name}</div>
            </div>
        </div>
    `;

    // Engancha el wrapper nativo de Estado, inserta Modificar si True
    alerta.VerEstado(
        htmlModal,
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

    // Html Template literal enrutando clase base .explicacion
    const htmlModal = `
        <div class="explicacion modal">
            <p class="explicacion__titulo">Crear Vulnerabilidad</p>
        </div>

        <div class="form">
            <div class="form__inputBox modal-50">
                <i class="ri-error-warning-fill"></i>
                <input 
                    type="text" 
                    class="form__input form__nombre" 
                    placeholder="Nombre de la vulnerabilidad"
                    autocomplete="off">
            </div>
        </div>
    `;

    // Escucha el submit afirmativo del sweetAlert
    alerta.Crear(htmlModal, async () => {

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

    // UI form clon pre-cargada con String Value anterior insertado
    const htmlModal = `
        <div class="explicacion modal">
            <p class="explicacion__titulo">Editar Vulnerabilidad</p>
        </div>
        <div class="form">
            <div class="form__inputBox modal-50">
                <i class="ri-error-warning-fill"></i>
                <input 
                    type="text" 
                    class="form__input form__nombre"
                    value="${info.name}"
                    autocomplete="off">
            </div>
        </div>
    `;

    // Engancha acción a ejecutarse tras interactuar "Confirm"
    alerta.Crear(htmlModal, async () => {

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
