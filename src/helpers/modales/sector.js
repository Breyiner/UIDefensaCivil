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

    const modalDiv = document.createElement("div");
    modalDiv.classList.add("modalVer", "modal-50");

    const datoDiv = document.createElement("div");
    datoDiv.classList.add("modalVer__dato");

    const icon = document.createElement("i");
    icon.classList.add("ri-map-pin-2-line");

    const tituloDiv = document.createElement("div");
    tituloDiv.classList.add("modalVer__titulo");
    tituloDiv.textContent = "Nombre";

    const textoDiv = document.createElement("div");
    textoDiv.classList.add("modalVer__texto");
    textoDiv.textContent = datos.name;

    datoDiv.append(icon, tituloDiv, textoDiv);
    modalDiv.appendChild(datoDiv);

    // Enmarcado general en Sweet Alert "Extended" portando botones de Switch Is_Active generalizados
    alerta.VerEstado(
        modalDiv,
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

    const explicacionDiv = document.createElement("div");
    explicacionDiv.classList.add("explicacion", "modal");

    const tituloP = document.createElement("p");
    tituloP.classList.add("explicacion__titulo");
    tituloP.textContent = "Crear Sector";
    explicacionDiv.appendChild(tituloP);

    const formDiv = document.createElement("div");
    formDiv.classList.add("form");

    const inputBoxDiv = document.createElement("div");
    inputBoxDiv.classList.add("form__inputBox", "modal-50");

    const icon = document.createElement("i");
    icon.classList.add("ri-map-pin-fill");

    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("form__input", "form__nombre");
    input.placeholder = "Nombre del sector";
    input.autocomplete = "off";

    inputBoxDiv.append(icon, input);
    formDiv.appendChild(inputBoxDiv);

    const container = document.createElement("div");
    container.append(explicacionDiv, formDiv);

    // Interceptor principal de pulsaciones para concretar (Callback general confirmante)
    alerta.Crear(container, async () => {

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

    const editExplicacionDiv = document.createElement("div");
    editExplicacionDiv.classList.add("explicacion", "modal");

    const editTituloP = document.createElement("p");
    editTituloP.classList.add("explicacion__titulo");
    editTituloP.textContent = "Editar Sector";
    editExplicacionDiv.appendChild(editTituloP);

    const editFormDiv = document.createElement("div");
    editFormDiv.classList.add("form");

    const editInputBoxDiv = document.createElement("div");
    editInputBoxDiv.classList.add("form__inputBox", "modal-50");

    const editIcon = document.createElement("i");
    editIcon.classList.add("ri-map-pin-fill");

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.classList.add("form__input", "form__nombre");
    editInput.value = info.name;
    editInput.autocomplete = "off";

    editInputBoxDiv.append(editIcon, editInput);
    editFormDiv.appendChild(editInputBoxDiv);

    const container = document.createElement("div");
    container.append(editExplicacionDiv, editFormDiv);

    // Alerta envolvente que ejecuta bloque en 'Save / Aceptar'
    alerta.Crear(container, async () => {

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
