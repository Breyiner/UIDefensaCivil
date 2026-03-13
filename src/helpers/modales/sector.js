/**
 * Helper de Modales CRUD: Sector (sector.js)
 * Interfaz Pop-Up prefabricada (SweetAlert) para administrar el maestro
 * de Sectores geográficos. Capaz de inyectarse, procesarse y re-renderizar la vista.
 */
import * as api from "../api";
import * as alerta from "../alertas";

/* =====================================================
   VER Y ALTERAR ESTADO LÓGICO
==================================================== */
// Detalle para explorar fila persistida de Sector y capacidad de conmutar (encender/apagar)
export const ver = async (id, recargarContainer) => {

    // Fetch asíncrono desde backend, obteniendo info JSON base del ID estricto
    const datos = await api.get(`sectors/${id}`);

    // UI card HTML con iconografía Remix Icon e interpelación a datos crudos
    const htmlModal = `
        <div class="modalVer modal-50">
            <div class="modalVer__dato">
                <i class="ri-map-pin-2-line"></i>
                <div class="modalVer__titulo">Nombre</div>
                <div class="modalVer__texto">${datos.name}</div>
            </div>
        </div>
    `;

    // Enmarcado general en Sweet Alert "Extended" portando botones de Switch Is_Active generalizados
    alerta.VerEstado(
        htmlModal,
        true, // Switch permitir botón de editar
        datos.is_active, // Estatus actual DB para preconfigurar palanca de toggle

        // EDITAR (Sección Hook Callback)
        async () => editar(id, recargarContainer),

        // ACTIVAR (Rutina de disparo de restablecimiento rápido)
        async () => {
            // PATCH para reavivar flag lógico booleano de is_active a true (1)
            const resp = await api.patch(`sectors/status/${id}`, { is_active: 1 });
            if (resp.success) {
                await alerta.alertaOK(resp.message);
                await recargarContainer(); // Carga de listado completo main window
            } else {
                alerta.alertaWarning(resp.message);
            }
        },

        // DESACTIVAR (Eliminado encubierto, inactiva del sistema pero conserva FK e historia)
        async () => {
            const resp = await api.patch(`sectors/status/${id}`, { is_active: 0 });
            if (resp.success) {
                await alerta.alertaOK(resp.message);
                await recargarContainer();
            } else {
                alerta.alertaWarning(resp.message);
            }
        },
        'sectors', // String usado internamente como prefijo por ciertas adaptaciones (Opcional por si es dinamico)
        id
    );
};


/* =====================================================
   CREAR
==================================================== */
// Levanta modal interactivo que requiere texto del operador para consolidar nuevos sectores en nube
export const crear = async (recargarContainer) => {

    // Box modal HTML nativo (Inyección de strings JS puro)
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

    // Interceptor principal de pulsaciones para concretar (Callback general confirmante)
    alerta.Crear(htmlModal, async () => {

        // Recolectan la información puesta en los Input Boxes de SweetAlert renderizado
        const nombre = document.querySelector(".form__nombre").value;

        // Mandar el json modelado bajo key "name" al controlador POST rest principal (Insert)
        const data = await api.post("sectors", { name: nombre });

        // Dictamina rutas en base a finalización
        if (data.success) {
            await alerta.alertaOK(data.message);
            await recargarContainer(); // Actualizar parent view
        } else {
            alerta.alertaWarning(data.message, data.errors); // Producir un 'Oops'
        }

    });
};


/* =====================================================
   EDITAR
==================================================== */
// Se engatilla desde "VerEstado" en general, propiciando actualización textual (renombrar) al sector id dictado
export const editar = async (id, recargarContainer) => {

    // Adquiere la frescura de datos pre-aplicando a cajas nativas a fin de prever 'cacheamiento' visual
    const info = await api.get(`sectors/${id}`);

    // Modal calcado pero con inyecciones de las variables previas "value='info...'"
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

    // Alerta envolvente que ejecuta bloque en 'Save / Aceptar'
    alerta.Crear(htmlModal, async () => {

        // Evaluar variables presentes en DOM popup para el POST
        const nombre = document.querySelector(".form__nombre").value;

        // Proporciona PATCH con la intención de sobrescribir
        const data = await api.patch(`sectors/${id}`, { name: nombre });

        // Valuar promesas
        if (data.success) {
            await alerta.alertaOK(data.message);
            await recargarContainer();
        } else {
            alerta.alertaWarning(data.message, data.errors);
        }

    });
};
