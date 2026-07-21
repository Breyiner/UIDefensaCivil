/**
 * Helper de Modales CRUD: Organización (organizacion.js)
 * Construye dinámicamente cuadros de diálogo para mantener el CRUD parcial 
 * de Organizaciones y su relación directa con un área formativa (Seccional).
 */
import * as api from "../api";
import * as alerta from "../alertas";

/* =====================================================
   CREAR
==================================================== */
// Permite a usuarios con roles administrativos el crear una nueva cruz roja dependiente de una sección local
export const crear = async (recargarContainer) => {

    // Obtener las secciones (dropdown parametrizado) de la BD para popular el campo <select>
    const secciones = await api.get("sectionals");

    const explicacionDiv = document.createElement("div");
    explicacionDiv.classList.add("modal-edicion__cabecera");

    const tituloP = document.createElement("p");
    tituloP.classList.add("modal-edicion__titulo");
    tituloP.textContent = "Crear Organización";
    explicacionDiv.appendChild(tituloP);

    const formDiv = document.createElement("div");
    formDiv.classList.add("form");

    const inputBoxDiv = document.createElement("div");
    inputBoxDiv.classList.add("form__inputBox", "modal-50");

    const iconBuilding = document.createElement("i");
    iconBuilding.classList.add("ri-building-fill");

    const inputNombre = document.createElement("input");
    inputNombre.type = "text";
    inputNombre.classList.add("form__input", "form__nombre");
    inputNombre.placeholder = "Nombre de la organización";
    inputNombre.autocomplete = "off";

    inputBoxDiv.append(iconBuilding, inputNombre);
    formDiv.appendChild(inputBoxDiv);

    const selectBoxDiv = document.createElement("div");
    selectBoxDiv.classList.add("form__inputBox");

    const iconArticle = document.createElement("i");
    iconArticle.classList.add("ri-article-fill");

    const select = document.createElement("select");
    select.classList.add("form__input", "form__seccional");

    secciones.forEach(sec => {
        const opt = document.createElement("option");
        opt.value = sec.id;
        opt.textContent = sec.name;
        select.appendChild(opt);
    });

    selectBoxDiv.append(iconArticle, select);
    formDiv.appendChild(selectBoxDiv);

    const container = document.createElement("div");
    container.append(explicacionDiv, formDiv);

    // Envía configuración base a la pantalla de alertas
    alerta.Crear(container, async () => {

        // Adquiere los campos escritos u opciones escogidas del DOM temporal (SweetAlert window)
        const nombre = document.querySelector(".form__nombre").value;
        const seccional = document.querySelector(".form__seccional").value;

        // Trata de insertar por POST en la API mandando Name + Primary Key foránea de Seccional 
        const data = await api.post("organizations", { name: nombre, sectional_id: seccional });

        if (data.success) {
            await alerta.alertaOK(data.message); // Creación aprobada
            await recargarContainer(); // Actualiza
        } else {
            alerta.alertaWarning(data.message, data.errors); // Alerta y expone array de errores devuelto por la Request
        }

    });
};


/* =====================================================
   VER Y ALTERAR ESTADO LÓGICO
==================================================== */
// Renderiza modal de visión y acciones para Organización
// export const ver = async (id, recargarContainer) => {

//     // Extrae el JSON de API con detalles (incluyendo info anidada de la seccional)
//     const datos = await api.get(`organizations/${id}`);
    
//     // Concatena y fabrica el Layout con los datos traidos
//     const htmlModal = `
//         <div class="modalVer modal-50">
//             <div class="modalVer__dato">
//                 <i class="ri-building-line"></i>
//                 <div class="modalVer__titulo">Nombre</div>
//                 <div class="modalVer__texto">${datos.name}</div>
//             </div>
//             <div class="modalVer__dato">
//                 <i class="ri-article-line"></i>
//                 <div class="modalVer__titulo">Seccional</div>
//                 <div class="modalVer__texto">${datos.sectional.name}</div>
//             </div>
//         </div>
//     `;

//     // Muestra Modal estándar pidiendo qué acciones de estado aplicar
//     alerta.VerEstado(
//         htmlModal,
//         true, // Confirmar modo de edición activado
//         datos.is_active, // Detectar su estado actual

//         // CALLBACK EDITAR
//         async () => editar(id, recargarContainer),

//         // CALLBACK ACTIVAR: Si oprime botón para devolverlo activo (1)
//         async () => {
//             const resp = await api.patch(`organizations/status/${id}`, { is_active: 1 });
//             if (resp.success) {
//                 await alerta.alertaOK(resp.message); // Notifican guardado OK
//                 await recargarContainer(); // Carga otra vez la UI
//             } else {
//                 alerta.alertaWarning(resp.message);} // Mensaje de aviso de la API
//         },

//         // CALLBACK DESACTIVAR: Inactiva el registro
//         async () => {
//             const resp = await api.patch(`organizations/status/${id}`, { is_active: 0 });
//             if (resp.success) {
//                 await alerta.alertaOK(resp.message); // Alerta positiva
//                 await recargarContainer(); // Orden de pintar de nuevo
//             } else {
//                 alerta.alertaWarning(resp.message);} // Excepción detectada
//         },
//         'organizations', // Archivo en caché / identificador global
//         id
//     );
// };

/* =====================================================
   EDITAR
==================================================== */
// Dispara interfaz que altera campos organizativos
// export const editar = async (id, recargarContainer) => {

//     // Rescata el viejo registro
//     const info = await api.get(`organizations/${id}`);
    
//     // Obtiene arreglo del catálogo de opciones paramétricos
//     const secciones = await api.get("sectionals");

//     // Construye opciones marcando como "selected" aquella con ID coincidente con la organización guardada
//     const opciones = secciones.map(sec => `
//         <option value="${sec.id}" ${info.section && info.section.id === sec.id ? "selected" : ""}>
//             ${sec.name}
//         </option>
//     `).join('');

//     // Pre-carga visual al usuario los antiguos datos
//     const htmlModal = `
//         <div class="explicacion modal">
//             <p class="explicacion__titulo">Editar Organización</p>
//         </div>
//         <div class="form">
//             <div class="form__inputBox modal-50">
//                 <i class="ri-building-fill"></i>
//                 <input 
//                     type="text" 
//                     class="form__input form__nombre"
//                     value="${info.name}"
//                     autocomplete="off">
//             </div> 
//             <div class="form__inputBox">
//                 <i class="ri-article-fill"></i>
//                 <select class="form__input form__seccional">
//                     ${opciones}
//                 </select>
//             </div>
//         </div>
//     `;

//     // Espera guardar o cancelar en Swal
//     alerta.Crear(htmlModal, async () => {

//         // Evalúa el cambio nuevo (Texto o DropDown modificado)
//         const nombre = document.querySelector(".form__nombre").value;
//         const seccional = document.querySelector(".form__seccional").value;

//         // Mandar el parche Patch
//         const data = await api.patch(`organizations/${id}`, { name: nombre, sectional_id: seccional });

//         if (data.success) {
//             await alerta.alertaOK(data.message); // Todo bien
//             await recargarContainer(); // Recarga
//         } else {
//             alerta.alertaWarning(data.message, data.errors); // Provee explicación del rechazo
//         }

//     });
// };
