/**
 * Helper de Modales CRUD: Nacionalidad (nacionalidad.js)
 * Centraliza la creación en tiempo de ejecución de las ventanas emergentes (SweetAlert)
 * para el catálogo básico de nacionalidades, permitiendo visualizarlas (y cambiar su estado), crearlas y editarlas.
 */
import * as api from "../api";
import * as alerta from "../alertas";

/* =====================================================
   VER Y ALTERAR ESTADO LÓGICO
==================================================== */
// Lanza un modal informativo de una Nacionalidad específica
export const ver = async (id, recargarContainer) => {

    // Despacha la solicitud GET buscando el registro por su Primary Key
    const datos = await api.get(`nationalities/${id}`);

    // Diseña el DOM en formato string de backticks a inyectar en SweetAlert
    const htmlModal = `
        <div class="modalVer modal-50">
            <div class="modalVer__dato">
                <i class="ri-flag-line"></i>
                <div class="modalVer__titulo">Nombre</div>
                <div class="modalVer__texto">${datos.name}</div>
            </div>
        </div>
    `;

    // Llama al sistema base de Alertas pasándole qué botones manejará
    alerta.VerEstado(
        htmlModal,
        true, // Indica verdadero el parámetro de permitir Edición
        datos.is_active, // Pasa el estado real de la BD (1 = Activo, 0 = Inactivo)

        // CALLBACK EDITAR: Llama a la siguiente lógica encargada de edición pasándole los mismos parámetros
        async () => editar(id, recargarContainer),

        // CALLBACK ACTIVAR: Rutina manual que el usuario pide para reactivar el catálogo
        async () => {
            const resp = await api.patch(`nationalities/status/${id}`, { is_active: 1 });
            if (resp.success) {
                await alerta.alertaOK(resp.message); // Éxito guardando
                await recargarContainer(); // Cargar la tabla global nuevamente
            } else {
                alerta.alertaWarning(resp.message);} // Respuesta fallida
        },

        // CALLBACK DESACTIVAR: Rutina para marcar el estatus lógico a cero
        async () => {
            const resp = await api.patch(`nationalities/status/${id}`, { is_active: 0 });
            if (resp.success) {
                await alerta.alertaOK(resp.message); // Operación de desactivación lograda
                await recargarContainer(); // Actualizar UI
            } else {
                alerta.alertaWarning(resp.message);} // Hubo problemas
        },
        'nationalities', // Endpoint base
        id
    );
};


/* =====================================================
   CREAR
==================================================== */
// Exporta la UI interactiva que permite a un Administrador crear nuevas nacionalidades
export const crear = async (recargarContainer) => {

    // Bloque HTML crudo del formulario
    const htmlModal = `
        <div class="explicacion modal">
            <p class="explicacion__titulo">Crear Nacionalidad</p>
        </div>

        <div class="form">
            <div class="form__inputBox modal-50">
                <i class="ri-flag-2-fill"></i>
                <input 
                    type="text" 
                    class="form__input form__nombre" 
                    placeholder="Nombre de la nacionalidad"
                    autocomplete="off">
            </div>
        </div>
    `;

    // Utiliza la estructura Swal genérica de "Crear" para invocarlo
    alerta.Crear(htmlModal, async () => {

        // Recoge el texto introducido por el usuario dentro del modal HTML
        const nombre = document.querySelector(".form__nombre").value;

        // Dispara la persistencia al backend enviándolo en formato objeto Payload JSON
        const data = await api.post("nationalities", { name: nombre });

        if (data.success) {
            await alerta.alertaOK(data.message); // Inserción exitosa devuelta por backend
            await recargarContainer(); // Ordena actualizar la grilla global
        } else {
            alerta.alertaWarning(data.message, data.errors); // Problema (ej. Ya existe, duplicado)
        }

    });
};


/* =====================================================
   EDITAR
==================================================== */
// Abre el modal de formulario popular con la información cargada desde DB
export const editar = async (id, recargarContainer) => {

    // Recupera lo guardado en el backend
    const info = await api.get(`nationalities/${id}`);

    // Modela el form con value="${info.name}"
    const htmlModal = `
        <div class="explicacion modal">
            <p class="explicacion__titulo">Editar Nacionalidad</p>
        </div>
        <div class="form">
            <div class="form__inputBox modal-50">
                <i class="ri-flag-2-fill"></i>
                <input 
                    type="text" 
                    class="form__input form__nombre"
                    value="${info.name}"
                    autocomplete="off">
            </div>
        </div>
    `;

    // Captura cambios tras oprimir confirmar de Swal
    alerta.Crear(htmlModal, async () => {

        // Lee el input
        const nombre = document.querySelector(".form__nombre").value;

        // Hace una petición Partial Modification (PATCH) solo del nombre
        const data = await api.patch(`nationalities/${id}`, { name: nombre });

        if (data.success) {
            await alerta.alertaOK(data.message); // Todo bien
            await recargarContainer(); // Carga de nuevo la lista
        } else {
            alerta.alertaWarning(data.message, data.errors); // Algo salió mal (backend error)
        }

    });
};
