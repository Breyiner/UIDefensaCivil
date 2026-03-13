/**
 * Helper de Modales CRUD: Especie Animal (especie.js)
 * Módulo especializado en construir en tiempo de ejecución (Inyección de Strings HTML)
 * y abrir dialogos SweetAlert para el catálogo de tipos de mascotas.
 */
import * as api from "../api";
import * as alerta from "../alertas";

/* =====================================================
   VER Y ALTERAR ESTADO LÓGICO
==================================================== */
// Función que invoca un modal para leer los datos de la especie
export const ver = async (id, recargarContainer) => {

    // Consume la API pidiendo los detalles de la especie por ID
    const datos = await api.get(`species/${id}`);

    // Diseña la interfaz HTML usando los datos inyectados de la respuesta
    const htmlModal = `
        <div class="modalVer modal-50">
            <div class="modalVer__dato">
                <i class="ri-bear-smile-line"></i>
                <div class="modalVer__titulo">Nombre</div>
                <div class="modalVer__texto">${datos.name}</div>
            </div>
        </div>
    `;

    // Utiliza el helper genérico "VerEstado" pasándole lógica de callbacks
    alerta.VerEstado(
        htmlModal,
        true, // Habilita el botón de edición
        datos.is_active, // Informa el estado booleano para mostrar Activar o Desactivar

        // CALLBACK EDITAR: Si el usuario desea modificar el registro
        async () => editar(id, recargarContainer),

        // CALLBACK ACTIVAR: Si oprime botón para devolver al estado Activo (1)
        async () => {
            const resp = await api.patch(`species/status/${id}`, { is_active: 1 });
            if (resp.success) {
                await alerta.alertaOK(resp.message); // Notifica el cambio exitoso
                await recargarContainer(); // Refresca lista global
            } else {
                alerta.alertaWarning(resp.message); // Advierte error
            }
        },

        // CALLBACK DESACTIVAR: Si oprime botón para cambiar a Inactivo (0)
        async () => {
            const resp = await api.patch(`species/status/${id}`, { is_active: 0 });
            if (resp.success) {
                await alerta.alertaOK(resp.message);
                await recargarContainer();
            } else {
                alerta.alertaWarning(resp.message);
            }
        },
        'species', // Parámetro para saber la ruta principal
        id // Identificador
    );
};


/* =====================================================
   CREAR
==================================================== */
// Crea y levanta el cuadro de diálogo con un formulario vacío 
export const crear = async (recargarContainer) => {

    // Crea el formulario HTML
    const htmlModal = `
        <div class="explicacion modal">
            <p class="explicacion__titulo">Crear Especie</p>
        </div>

        <div class="form">
            <div class="form__inputBox modal-50">
                <i class="ri-bear-smile-fill"></i>
                <input 
                    type="text" 
                    class="form__input form__nombre" 
                    placeholder="Nombre de la especie"
                    autocomplete="off">
            </div>
        </div>
    `;

    // Invoca SweetAlert pidiendo que renderice el HTML y envíe la petición POST
    alerta.Crear(htmlModal, async () => {

        // Busca el elemento del input en el DOM del modal
        const nombre = document.querySelector(".form__nombre").value;

        // Transporta los nuevos datos JSON al backend
        const data = await api.post("species", { name: nombre });

        // Evaluando el objeto de retorno del servidor
        if (data.success) {
            await alerta.alertaOK(data.message); // Éxito guardando
            await recargarContainer(); // Ordena refrescar
        } else {
            alerta.alertaWarning(data.message, data.errors); // Problemas de validación
        }

    });
};


/* =====================================================
   EDITAR
==================================================== */
// Despliega una UI de edición con los datos poblados del servidor
export const editar = async (id, recargarContainer) => {

    // Extrae el objeto registro original
    const info = await api.get(`species/${id}`);

    // Configura HTML, nota el atributo 'value="${info.name}"'
    const htmlModal = `
        <div class="explicacion modal">
            <p class="explicacion__titulo">Editar Especie</p>
        </div>
        <div class="form">
            <div class="form__inputBox modal-50">
                <i class="ri-bear-smile-fill"></i>
                <input 
                    type="text" 
                    class="form__input form__nombre"
                    value="${info.name}"
                    autocomplete="off">
            </div>
        </div>
    `;

    // Pide confirmación y guarda actualización
    alerta.Crear(htmlModal, async () => {

        // Obtiene el valor final del input de texto
        const nombre = document.querySelector(".form__nombre").value;

        // Dispara la modificación mediante verbo PATCH
        const data = await api.patch(`species/${id}`, { name: nombre });

        if (data.success) {
            await alerta.alertaOK(data.message); // Listo
            await recargarContainer(); // Repinta grilla
        } else {
            alerta.alertaWarning(data.message, data.errors); // Reporta rechazo
        }

    });
};
    