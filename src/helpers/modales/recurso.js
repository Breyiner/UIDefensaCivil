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
    
    const modalDiv = document.createElement("div");
    modalDiv.classList.add("modalVer", "modal-50");

    const nomDatoDiv = document.createElement("div");
    nomDatoDiv.classList.add("modalVer__dato", "modalVer__dato--largo");

    const nomIcon = document.createElement("i");
    nomIcon.classList.add("ri-folder-line");

    const nomTitulo = document.createElement("div");
    nomTitulo.classList.add("modalVer__titulo");
    nomTitulo.textContent = "Nombre";

    const nomTexto = document.createElement("div");
    nomTexto.classList.add("modalVer__texto");
    nomTexto.textContent = datos.name;

    nomDatoDiv.append(nomIcon, nomTitulo, nomTexto);
    modalDiv.appendChild(nomDatoDiv);

    const servDatoDiv = document.createElement("div");
    servDatoDiv.classList.add("modalVer__dato", "modalVer__dato--largo");

    const servIcon = document.createElement("i");
    servIcon.classList.add("ri-service-line");

    const servTitulo = document.createElement("div");
    servTitulo.classList.add("modalVer__titulo");
    servTitulo.textContent = "Servicio";

    const servTexto = document.createElement("div");
    servTexto.classList.add("modalVer__texto");
    servTexto.textContent = datos.service;

    servDatoDiv.append(servIcon, servTitulo, servTexto);
    modalDiv.appendChild(servDatoDiv);

    // Helper "VerEstado" propio de la arquitectura que inyecta palancas de activación
    alerta.VerEstado(
        modalDiv,
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
    const explicacionDiv = document.createElement("div");
    explicacionDiv.classList.add("explicacion", "modal");

    const tituloP = document.createElement("p");
    tituloP.classList.add("explicacion__titulo");
    tituloP.textContent = "Crear Recurso";
    explicacionDiv.appendChild(tituloP);

    const formDiv = document.createElement("div");
    formDiv.classList.add("form");

    const nomBoxDiv = document.createElement("div");
    nomBoxDiv.classList.add("form__inputBox", "modal-50");

    const nomIcon = document.createElement("i");
    nomIcon.classList.add("ri-folder-fill");

    const nomInput = document.createElement("input");
    nomInput.type = "text";
    nomInput.classList.add("form__input", "form__nombre");
    nomInput.placeholder = "Nombre del recurso";
    nomInput.autocomplete = "off";

    nomBoxDiv.append(nomIcon, nomInput);
    formDiv.appendChild(nomBoxDiv);

    const servBoxDiv = document.createElement("div");
    servBoxDiv.classList.add("form__inputBox");

    const servIcon = document.createElement("i");
    servIcon.classList.add("ri-service-fill");

    const servInput = document.createElement("input");
    servInput.type = "text";
    servInput.classList.add("form__input", "form__servicio");
    servInput.placeholder = "Service del recurso";
    servInput.autocomplete = "off";

    servBoxDiv.append(servIcon, servInput);
    formDiv.appendChild(servBoxDiv);

    const container = document.createElement("div");
    container.append(explicacionDiv, formDiv);

    // Envuelve promesa click bajo entorno Sweet Alert
    alerta.Crear(container, async () => {
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

    const editExplicacionDiv = document.createElement("div");
    editExplicacionDiv.classList.add("explicacion", "modal");

    const editTituloP = document.createElement("p");
    editTituloP.classList.add("explicacion__titulo");
    editTituloP.textContent = "Editar Recurso";
    editExplicacionDiv.appendChild(editTituloP);

    const editFormDiv = document.createElement("div");
    editFormDiv.classList.add("form");

    const editNomBoxDiv = document.createElement("div");
    editNomBoxDiv.classList.add("form__inputBox", "modal-50");

    const editNomIcon = document.createElement("i");
    editNomIcon.classList.add("ri-folder-fill");

    const editNomInput = document.createElement("input");
    editNomInput.type = "text";
    editNomInput.classList.add("form__input", "form__nombre");
    editNomInput.value = info.name;
    editNomInput.autocomplete = "off";

    editNomBoxDiv.append(editNomIcon, editNomInput);
    editFormDiv.appendChild(editNomBoxDiv);

    const editServBoxDiv = document.createElement("div");
    editServBoxDiv.classList.add("form__inputBox");

    const editServIcon = document.createElement("i");
    editServIcon.classList.add("ri-service-fill");

    const editServInput = document.createElement("input");
    editServInput.type = "text";
    editServInput.classList.add("form__input", "form__servicio");
    editServInput.value = info.service;
    editServInput.autocomplete = "off";

    editServBoxDiv.append(editServIcon, editServInput);
    editFormDiv.appendChild(editServBoxDiv);

    const container = document.createElement("div");
    container.append(editExplicacionDiv, editFormDiv);

    // Confirma el proceso Patch de base de datos asíncronamente
    alerta.Crear(container, async () => {
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
