/**
 * Helper de Modal de Consulta: Recurso Disponible (recursoDisponible.js)
 * A diferencia del catálogo maestro de recursos, este archivo levanta un modal
 * de SÓLO lectura para detallar qué recurso en específico está disponible (Instanciado) cerca
 * evaluando su geoubicación y distancia al plan familiar.
 */
import * as api from "../api";
import * as alerta from "../alertas";

// Ventana exclusiva de información, sin rutinas de edición o deleción.
export const ver = async (id) => {
  // Dispara el GET al API en el controlador availableResources 
  const datos = await api.get(`availableResources/${id}`);

  const modalDiv = document.createElement("div");
  modalDiv.classList.add("modalVer", "modal");

  const campos = [
    { icono: "ri-error-warning-line", titulo: "Nombre del recurso", texto: datos.resource_name },
    { icono: "ri-heart-line", titulo: "Servicio", texto: datos.resource_service },
    { icono: "ri-phone-line", titulo: "Telefono de contacto", texto: datos.phone },
    { icono: "ri-file-text-line", titulo: "Descripcion", texto: datos.description },
    { icono: "ri-map-2-line", titulo: "Ubicacion", texto: datos.location },
    { icono: "ri-map-pin-line", titulo: "Distancia", texto: datos.distance },
  ];

  campos.forEach(({ icono, titulo, texto }) => {
    const datoDiv = document.createElement("div");
    datoDiv.classList.add("modalVer__dato", "modalVer__dato--largo");

    const icon = document.createElement("i");
    icon.classList.add(icono);

    const tituloDiv = document.createElement("div");
    tituloDiv.classList.add("modalVer__titulo");
    tituloDiv.textContent = titulo;

    const textoDiv = document.createElement("div");
    textoDiv.classList.add("modalVer__texto");
    textoDiv.textContent = texto;

    datoDiv.append(icon, tituloDiv, textoDiv);
    modalDiv.appendChild(datoDiv);
  });
        
  // Enlaza con el helper genérico "Ver" enviando false, false, indicando carencia de UI CRUD (Solo Ver)
  alerta.Ver(modalDiv, false, false, null, null);
};