/**
 * Helper de Modales CRUD: Tipo de Documento (tipoDocumento.js)
 * Interfaz Pop-Up prefabricada (SweetAlert) para administrar el 
 * catálogo de identificadores gubernamentales válidos o Acrónimos (Ej: CC, TI, CE).
 */
import * as api from "../api";
import * as alerta from "../alertas";

/* =====================================================
   VER Y ALTERAR ESTADO LÓGICO
==================================================== */
// Consulta individual de un Documento con posiblidad de alternar su disponibilidad en selectores
// export const ver = async (id, recargarContainer) => {

//     // Absorbe el documento referenciado desde Servidor local
//     const datos = await api.get(`documentTypes/${id}`);
    
//     // Cuadros asimétricos con remociones visuales en icono/texto
//     const htmlModal = `
//         <div class="modalVer modal-50">
//             <div class="modalVer__dato">
//                 <i class="ri-id-card-line"></i>
//                 <div class="modalVer__titulo">Nombre</div>
//                 <div class="modalVer__texto">${datos.name}</div>
//             </div>
//             <div class="modalVer__dato">
//                 <i class="ri-info-card-line"></i>
//                 <div class="modalVer__titulo">Acronimo</div>
//                 <div class="modalVer__texto">${datos.acronym}</div>
//             </div>
//         </div>
//     `;

//     // Conmuta funciones globales de Alert usando patrón VerEstado
//     alerta.VerEstado(
//         htmlModal,
//         true, // Edición concedida
//         datos.is_active, // Checkmark natural

//         // EDITAR (Evento enganchado inyectado por Callback)
//         async () => editar(id, recargarContainer),

//         // ACTIVAR (Regresa elemento al ecosistema vivo)
//         async () => {
//             // PATCH a switch backend directo
//             const resp = await api.patch(`documentTypes/status/${id}`, { is_active: 1 });
//             if (resp.success) {
//                 await alerta.alertaOK(resp.message);
//                 await recargarContainer(); // Carga de fondo
//             } else {
//                 alerta.alertaWarning(resp.message);
//             }
//         },

//         // DESACTIVAR (Invalida elemento para ocultarlo en las UIs select forms)
//         async () => {
//             const resp = await api.patch(`documentTypes/status/${id}`, { is_active: 0 });
//             if (resp.success) {
//                 await alerta.alertaOK(resp.message);
//                 await recargarContainer();
//             } else {
//                 alerta.alertaWarning(resp.message);
//             }
//         },
//         'documentTypes', // Alias para peticiones o trackers
//         id
//     );
// };


/* =====================================================
   CREAR
==================================================== */
// Despliega ventanilla pidiendo nombre completo y su Abreviatura Oficial
export const crear = async (recargarContainer) => {

    const explicacionDiv = document.createElement("div");
    explicacionDiv.classList.add("explicacion", "modal");

    const tituloP = document.createElement("p");
    tituloP.classList.add("explicacion__titulo");
    tituloP.textContent = "Crear Tipo de Documento";
    explicacionDiv.appendChild(tituloP);

    const formDiv = document.createElement("div");
    formDiv.classList.add("form");

    const inputBoxDiv = document.createElement("div");
    inputBoxDiv.classList.add("form__inputBox", "modal-50");

    const idIcon = document.createElement("i");
    idIcon.classList.add("ri-id-card-fill");

    const nombreInput = document.createElement("input");
    nombreInput.type = "text";
    nombreInput.classList.add("form__input", "form__nombre");
    nombreInput.placeholder = "Nombre del tipo de documento";
    nombreInput.autocomplete = "off";

    inputBoxDiv.append(idIcon, nombreInput);
    formDiv.appendChild(inputBoxDiv);

    const acrBoxDiv = document.createElement("div");
    acrBoxDiv.classList.add("form__inputBox");

    const infoIcon = document.createElement("i");
    infoIcon.classList.add("ri-info-card-fill");

    const acrInput = document.createElement("input");
    acrInput.type = "text";
    acrInput.classList.add("form__input", "form__acronimo");
    acrInput.placeholder = "Acronimo del tipo de documento";
    acrInput.autocomplete = "off";

    acrBoxDiv.append(infoIcon, acrInput);
    formDiv.appendChild(acrBoxDiv);

    const container = document.createElement("div");
    container.append(explicacionDiv, formDiv);

    // Empalma promesa OK botón de sweet alert con peticiones REST
    alerta.Crear(container, async () => {

        // Recolectores
        const nombre = document.querySelector(".form__nombre").value;
        const acronimo = document.querySelector(".form__acronimo").value;

        // Tránsito de ida POST, pasandole nombre y acrónimo literal (Ej: Pasaporte, PA)
        const data = await api.post("documentTypes", { name: nombre, acronym: acronimo });

        // Valuar promesas con escapes correspondientes
        if (data.success) {
            await alerta.alertaOK(data.message);
            await recargarContainer(); // Actualizar parent view
        } else {
            alerta.alertaWarning(data.message, data.errors);
        }

    });
};


/* =====================================================
   EDITAR
==================================================== */
// Clona ventana creación y le inserta los atributos que le corresponden en ese instante
// export const editar = async (id, recargarContainer) => {

//     // Dispara GET para refrescar memoria
//     const info = await api.get(`documentTypes/${id}`);

//     // Modal con valores auto-rellenados, idéntico visualmente al de crear
//     const htmlModal = `
//         <div class="explicacion modal">
//             <p class="explicacion__titulo">Editar Tipo de Documento</p>
//         </div>
//         <div class="form">
//             <div class="form__inputBox modal-50">
//                 <i class="ri-id-card-fill"></i>
//                 <input 
//                     type="text" 
//                     class="form__input form__nombre"
//                     value="${info.name}"
//                     autocomplete="off">
//             </div> 
//             <div class="form__inputBox">
//                 <i class="ri-info-card-fill"></i>
//                 <input 
//                     type="text" 
//                     class="form__input form__acronimo" 
//                     value="${info.acronym}"
//                     autocomplete="off">
//             </div>
//         </div>
//     `;

//     // Ejecutor del Aceptar
//     alerta.Crear(htmlModal, async () => {

//         // Extracción simple de las 2 cajas
//         const nombre = document.querySelector(".form__nombre").value;
//         const acronimo = document.querySelector(".form__acronimo").value;

//         // Sobreescritura asomándose a la URL del identificador
//         const data = await api.patch(`documentTypes/${id}`, { name: nombre,acronym: acronimo});

//         // Interprete de logicas success o warning
//         if (data.success) {
//             await alerta.alertaOK(data.message);
//             await recargarContainer();
//         } else {
//             alerta.alertaWarning(data.message, data.errors);
//         }

//     });
// };
