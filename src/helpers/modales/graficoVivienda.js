/**
 * Helper Modal Fotográfico: Gráfico de Vivienda (graficoVivienda.js)
 * Exclusivamente diseñado para desplegar la previsualización en grande
 * de un croquis de vivienda traído por API conectándolo al backend Storage.
 */
import * as api from "../api";
import * as alerta from "../alertas";

// Función asíncrona para mostrar la imagen ampliada dado un ID de gráfico
export const ver = async(id) => {
  // Dispara la petición a la API pidiendo los detalles del gráfico
  const datos = await api.get(`housingGraphics/${id}`);
  
  // Construye un código HTML inyectando la ruta de la imagen (Combinando la URL base del Storage de la API con el path relativo)
  const modalDiv = document.createElement("div");
  modalDiv.classList.add("modalVer", "modal");

  const tituloDiv = document.createElement("div");
  tituloDiv.classList.add("modalVer__dato", "modalVer__dato--largo");

  const icon = document.createElement("i");
  icon.classList.add("ri-file-image-line");

  const tituloText = document.createElement("div");
  tituloText.classList.add("modalVer__titulo");
  tituloText.textContent = "Grafico de vivienda";

  tituloDiv.append(icon, tituloText);

  const img = document.createElement("img");
  img.classList.add("modalVer__imagen");
  img.src = `${api.urlStorage}/${datos.path}`;

  const descDiv = document.createElement("div");
  descDiv.classList.add("modalVer__dato", "modalVer__dato--largo");

  const descIcon = document.createElement("i");
  descIcon.classList.add("ri-parent-line");

  const descTitulo = document.createElement("div");
  descTitulo.classList.add("modalVer__titulo");
  descTitulo.textContent = "Descripcion";

  const descTexto = document.createElement("div");
  descTexto.classList.add("modalVer__texto");
  descTexto.textContent = datos.description;

  descDiv.append(descIcon, descTitulo, descTexto);

  modalDiv.append(tituloDiv, img, descDiv);

  // Invoca a la alerta genérica en modo de sólo lectura (sin botones extra)
  alerta.Ver(modalDiv, false, false, null, null);
};