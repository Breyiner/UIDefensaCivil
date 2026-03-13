/**
 * Helper de Modales CRUD: Recurso (recurso.js)
 * Proporciona interfaces emergentes SweetAlert para listar, crear o editar catálogos
 * de "Servicios y Recursos" generales.
 */
import * as api from "../api";
import * as alerta from "../alertas";

/* =====================================================
   VER Y ALTERAR ESTADO LÓGICO
==================================================== */
// Permite explorar individualmente una fila registrada de un recurso y apagarla/encenderla a placer
export const ver = async (id, recargarContainer) => {
    // Consume info cruda JSON referente
    const datos = await api.get(`resources/${id}`);
    
    // Tarjeta gráfica descriptiva del Recurso
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

    // Helper "VerEstado" propio de la arquitectura que inyecta palancas de activación
    alerta.VerEstado(
        htmlModal,
        true, // Switch autorizador que prende el evento Edit
        datos.is_active, // Estatus actual DB para preconfigurar palanca de toggle
        // EDITAR (Callback asignado)
        async () => editar(id, recargarContainer),
        // ACTIVAR
        async () => {
            // PATCH request (actualización mínima de metadatos)
            const resp = await api.patch(`resources/status/${id}`, { is_active: 1 });
            if (resp.success) {
                await alerta.alertaOK(resp.message);
                await recargarContainer();
            } else {
                alerta.alertaWarning(resp.message);
            }
        },
        // DESACTIVAR (El toggle invertido)
        async () => {
            const resp = await api.patch(`resources/status/${id}`, { is_active: 0 });
            if (resp.success) {
                await alerta.alertaOK(resp.message);
                await recargarContainer();
            } else {
                alerta.alertaWarning(resp.message);
            }
        },
        'resources', // Variable indicadora de la URL para el componente general
        id
    );
};


/* =====================================================
   CREAR
==================================================== */
// Lanzador del popup para añadir recursos frescos a la bolsa
export const crear = async (recargarContainer) => {
    // Markup modal estandar sin rellenar variable alguna
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

    // Envuelve promesa click bajo entorno Sweet Alert
    alerta.Crear(htmlModal, async () => {
        // Caza DOMs y desmenuza variables textuales
        const nombre = document.querySelector(".form__nombre").value;
        const servicio = document.querySelector(".form__servicio").value;

        // Dispara orden de escritura API
        const data = await api.post("resources", { name: nombre, service:servicio });

        // Evaluando si todo es color de rosas, de lo contrario escupe las alarmas al usuario final
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
==================================================== */
// Recibe un Id y recrea el modal Form pero con contenido Value pre-aplicado
export const editar = async (id, recargarContainer) => {
    // Trae las variantes originales
    const info = await api.get(`resources/${id}`);

    // Despliega visual de modal reciclando y pegando las variantes guardadas "value=info.name"
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

    // Confirma el proceso Patch de base de datos asíncronamente
    alerta.Crear(htmlModal, async () => {
        // Analíticas de dom, extrae nodos de la plantilla
        const nombre = document.querySelector(".form__nombre").value;
        const servicio = document.querySelector(".form__servicio").value;

        // Mandado de payload modificativa a la terminal back
        const data = await api.patch(`resources/${id}`, { name: nombre, service: servicio});

        // Test normal a success
        if (data.success) {
            await alerta.alertaOK(data.message);
            await recargarContainer();
        } else {
            alerta.alertaWarning(data.message, data.errors);
        }
    });
};
