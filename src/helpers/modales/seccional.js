/**
 * Helper de Modales CRUD: Seccional (seccional.js)
 * Interfaz Pop-Up prefabricada (SweetAlert) para administrar el 
 * maestro de seccionales institucionales de la Cruz Roja mediante Formularios.
 */
import * as api from "../api";
import * as alerta from "../alertas";

/* =====================================================
   VER Y ALTERAR ESTADO LÓGICO
==================================================== */
// Permite explorar individualmente una fila registrada de una Seccional y apagarla/encenderla a placer
export const ver = async (id, recargarContainer) => {

    // Consume info cruda JSON referente a la seccional a visualizar
    const datos = await api.get(`sectionals/${id}`);

    // Plantilla modal de estilo Grid asimétrico visualizando campos leídos
    const htmlModal = `
        <div class="modalVer modal-50">
            <div class="modalVer__dato">
                <i class="ri-building-line"></i>
                <div class="modalVer__titulo">Nombre</div>
                <div class="modalVer__texto">${datos.name}</div>
            </div>
        </div>
    `;

    // Helper "VerEstado" propio de la arquitectura que inyecta palancas de activación
    alerta.VerEstado(
        htmlModal,
        true, // Permite edición
        datos.is_active, // Estatus booleano actual DB para preconfigurar palanca de toggle (Activo/Inactivo)

        // EDITAR (Callback asignado)
        async () => editar(id, recargarContainer),

        // ACTIVAR (Rutina de encendido)
        async () => {
            // PATCH request (actualización mínima de metadatos apuntando a is_active)
            const resp = await api.patch(`sectionals/status/${id}`,{ is_active: 1});
            if (resp.success) {
                await alerta.alertaOK(resp.message); // Banner de culminación exitosa
                await recargarContainer(); // Refrescar la base visual que llamó al modal
            } else {
            alerta.alertaWarning(resp.message); // Notificar problema
        }
        },

        // DESACTIVAR (Rutina de apagado lógico / inhabilitar)
        async () => {
            const resp = await api.patch(`sectionals/status/${id}`,{ is_active: 0});
            if (resp.success) {
                await alerta.alertaOK(resp.message);
                await recargarContainer();
            } else {
            alerta.alertaWarning(resp.message);
        }
        }
        ,'sectionals',id // Parámetros posicionales para la API y trazabilidad interna de Alertas
    );
};


/* =====================================================
   CREAR
==================================================== */
// Lanzador del popup para añadir seccionales nuevas a la base de datos
export const crear = async (recargarContainer) => {

    // Markup modal estandar para solicitar info inicial
    const htmlModal = `
        <div class="explicacion modal">
            <p class="explicacion__titulo">Crear Seccional</p>
        </div>

        <div class="form">
            <div class="form__inputBox modal-50">
                <i class="ri-building-fill"></i>
                <input 
                    type="text" 
                    class="form__input form__nombre" 
                    placeholder="Nombre de la seccional"
                    autocomplete="off">
            </div>
        </div>
    `;

    // Envuelve promesa click bajo el entorno centralizado Sweet Alert
    alerta.Crear(htmlModal, async () => {

        // Caza el input desde el HTML dinámico inyectado arriba
        const nombre = document.querySelector(".form__nombre").value;

        // Dispara orden de escritura API usando método POST (Creación íntegra)
        const data = await api.post("sectionals", { name: nombre });

        // Evaluando si fue exitoso el guardado para avisar o retroalimentar al operante
        if (data.success) {
            await alerta.alertaOK(data.message);
            await recargarContainer(); // Cargar la tabla o grid primario
        } else {
            alerta.alertaWarning(data.message, data.errors); // Producir advertencias en pantalla de fallar (Backend validators)
        }

    });
};


/* =====================================================
   EDITAR
==================================================== */
// Recibe un Id y recrea el modal Form pero con contenido existente "Value" modificado
export const editar = async (id, recargarContainer) => {

    // Extrae desde base de datos la data fresca
    const info = await api.get(`sectionals/${id}`);

    // Despliega visual de modal reciclando e incrustando las variantes dentro de la caja de texto
    const htmlModal = `
        <div class="explicacion modal">
            <p class="explicacion__titulo">Editar Seccional</p>
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
        </div>
    `;

    // Procesa interceptor de click final Sweet Alert para actualizar recurso
    alerta.Crear(htmlModal, async () => {

        // Obtiene valores nuevos o modificados de cajas texto
        const nombre = document.querySelector(".form__nombre").value;
        
        // Peticiona actualización en parche (PATCH) a red
        const data = await api.patch(`sectionals/${id}`, { name: nombre });
        
        // En caso que API resuelva correcto
        if (data.success) {
            await alerta.alertaOK(data.message); // Aviso verde OK
            await recargarContainer(); // Cargar padres
        } else {
            alerta.alertaWarning(data.message, data.errors); // Aviso amarillo/rojo
        }

    });
};
