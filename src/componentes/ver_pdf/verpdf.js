/**
 * Componente de Presentación: Visualizador de PDF (verpdf.js)
 * Se limita exclusivamente a construir la estructura DOM del visor
 * y a enlazar el evento del botón al callback provisto por el controlador.
 */

/**
 * Crea e inicializa el nodo DOM del visualizador de PDF.
 * 
 * @function verPdfComponent
 * @param {string} urlBlob - URL segura del Blob del PDF en memoria.
 * @param {Function} onDownload - Callback provisto por el controlador para gestionar la descarga del archivo.
 * @returns {HTMLDivElement} Elemento contenedor principal del visor listo para ser inyectado.
 */
export const verPdfComponent = (urlBlob, onDownload) => {
    // 1. Contenedor principal del componente
    const viewerContainer = document.createElement("div");
    viewerContainer.classList.add("pdf-viewer-container");

    // 2. Botón de descarga independiente
    const btnDescargar = document.createElement("button");
    btnDescargar.classList.add("boton", "boton--azul", "pdf-btn-descargar");

    // Icono RemixIcon
    const iconDescargar = document.createElement("i");
    iconDescargar.classList.add("ri-download-2-line");

    // Etiqueta de texto
    const textDescargar = document.createElement("span");
    textDescargar.textContent = "Descargar PDF";

    btnDescargar.appendChild(iconDescargar);
    btnDescargar.appendChild(textDescargar);

    // Asignar el comportamiento / callback de descarga definido en el controlador
    btnDescargar.onclick = onDownload;

    // 3. contenedor de responsividad móvil
    const iframeWrapper = document.createElement("div");
    iframeWrapper.classList.add("pdf-iframe-wrapper");

    // Iframe responsivo para el visualizador
    const iframe = document.createElement("iframe");
    iframe.classList.add("pdf-iframe");
    // Carga el PDF en memoria ocultando barras nativas (#toolbar=0) y ajustando el zoom al ancho del celular (view=FitH&zoom=page-width)
    iframe.src = `${urlBlob}#toolbar=0&navpanes=0&view=FitH&zoom=page-width`;

    iframeWrapper.appendChild(iframe);

    // 4. Anidar elementos en el contenedor del visualizador
    viewerContainer.appendChild(btnDescargar);
    viewerContainer.appendChild(iframeWrapper);

    return viewerContainer;
};
