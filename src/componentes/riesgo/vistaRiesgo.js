/**
 * Componente: Formulario VistaRiesgo
 * Módulo visual puro encargado de estructurar y retornar el nodo DOM del formulario de factores de riesgo.
 * Sigue la estructura de tarjeta_peticion y tarjeta_gestion retornando directamente el elemento.
 * 
 * @module VistaRiesgo
 */
import { adjuntarOpciones as adjuntarOpc } from "@/helpers/index.js";

/**
 * Crea y retorna el elemento visual (tarjeta tipo chip) de una vulnerabilidad.
 * Guia de estilo basada en tarjeta_peticion.js y tarjeta.css
 * 
 * @param {Object} item - Datos de la vulnerabilidad
 * @param {boolean} esSupervisor - Indica si el rol es supervisor (oculta botón de eliminar)
 * @param {Function} [onEdit] - Callback al hacer clic en el chip para editar
 * @param {Function} [onDelete] - Callback al hacer clic en el botón de eliminar
 * @returns {HTMLElement} Elemento DOM del tag
 */
export const tarjetaVulnerabilidad = (item, esSupervisor, onEdit, onDelete) => {
  const tag = document.createElement("div");
  tag.setAttribute("data-id", item.id || item.tempId);
  tag.className = "gestionarAfecciones__afeccion";

  const label = document.createElement("span");
  label.className = "gestionarAfecciones__tipoNombre";
  
  const vName = item.vulnerability?.name || item.vulnerability_name || "";
  const gName = item.vulnerability_grade?.name || item.vulnerability_grade_name || item.grade_name || "";
  label.textContent = `${vName} - Grado: ${gName}`;

  tag.append(label);

  tag.classList.add("gestionarAfecciones__afeccion--editable");
  tag.addEventListener("click", (e) => {
    if (e.target.closest("button") || e.target.closest("i.ri-close-line")) return;
    if (onEdit) onEdit();
  });

  if (!esSupervisor) {
    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.className = "vacuna-tag__eliminar";

    const xIcon = document.createElement("i");
    xIcon.className = "ri-close-line";
    btnEliminar.appendChild(xIcon);

    btnEliminar.addEventListener("click", (e) => {
      e.stopPropagation();
      if (onDelete) onDelete();
    });

    tag.appendChild(btnEliminar);
  }

  return tag;
};

/**
 * Crea y retorna el elemento visual (tarjeta tipo chip) de una acción de reducción.
 * Guia de estilo basada en tarjeta_peticion.js y tarjeta.css
 * 
 * @param {Object} item - Datos de la acción
 * @param {boolean} esSupervisor - Indica si el rol es supervisor (oculta botón de eliminar)
 * @param {Function} [onEdit] - Callback al hacer clic en el chip para editar
 * @param {Function} [onDelete] - Callback al hacer clic en el botón de eliminar
 * @returns {HTMLElement} Elemento DOM del tag
 */
export const tarjetaAccion = (item, esSupervisor, onEdit, onDelete) => {
  const tag = document.createElement("div");
  tag.setAttribute("data-id", item.id || item.tempId);
  tag.className = "gestionarAfecciones__afeccion";

  // Formato visual de la fecha DD/MM/YY
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0].substring(2)}`;
  };
  
  const label = document.createElement("span");
  label.className = "gestionarAfecciones__tipoNombre";

  const actionText = item.action || "";
  const memberName = item.member ? `${item.member.names} ${item.member.last_names}` : (item.member_name || "Sin encargado");
  const dateFormatted = formatDate(item.end_date);

  label.textContent = `${actionText} - ${memberName} - ${dateFormatted}`;

  tag.append(label);

  tag.classList.add("gestionarAfecciones__afeccion--editable");
  tag.addEventListener("click", (e) => {
    if (e.target.closest("button") || e.target.closest("i.ri-close-line")) return;
    if (onEdit) onEdit();
  });

  if (!esSupervisor) {
    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.className = "vacuna-tag__eliminar";

    const xIcon = document.createElement("i");
    xIcon.className = "ri-close-line";
    btnEliminar.appendChild(xIcon);

    btnEliminar.addEventListener("click", (e) => {
      e.stopPropagation();
      if (onDelete) onDelete();
    });

    tag.appendChild(btnEliminar);
  }

  return tag;
};

/**
 * Genera el formulario HTML de factores de riesgo
 * 
 * @param {Object} params
 * @param {Object|null} params.riskData - Información cargada del factor de riesgo
 * @param {boolean} params.esSupervisor - Estado de rol de supervisor
 * @returns {HTMLElement} Elemento HTML <form>
 */
export default async ({ riskData = null, esSupervisor = false }) => {
  const createFormGroup = (iconClass, inputType, id, iconId = "") => {
    const wrapper = document.createElement("div");
    wrapper.className = "input";

    const inputBox = document.createElement("div");
    inputBox.className = inputType === "selector" ? "form__inputBox form__inputBox--selector" : "form__inputBox";

    const i = document.createElement("i");
    i.className = iconClass;
    if (iconId) i.id = iconId;

    let field;
    if (inputType === "selector") {
      field = document.createElement("select");
      field.className = "selector-custom";
    } else if (inputType === "textarea") {
      field = document.createElement("textarea");
    } else {
      field = document.createElement("input");
      field.autocomplete = "off";
    }
    field.id = id;

    inputBox.append(i, field);
    wrapper.appendChild(inputBox);
    return wrapper;
  };

  const mainForm = document.createElement("form");
  mainForm.method = "POST";
  mainForm.className = "form";

  // Descripción (Textarea)
  const divDesc = createFormGroup("ri-file-text-line", "textarea", "descripcion");
  const descripcionTextarea = divDesc.querySelector("textarea");
  descripcionTextarea.placeholder = "Descripcion";
  descripcionTextarea.setAttribute("data-tipo", "textoLargo");

  // Ubicación (Input)
  const divUbic = createFormGroup("ri-map-pin-2-fill", "input", "ubicacion");
  const ubicacionInput = divUbic.querySelector("input");
  ubicacionInput.placeholder = "Ubicacion del riesgo";
  ubicacionInput.type = "text";
  ubicacionInput.setAttribute("data-tipo", "textoMedio");

  // Amenaza (Selector)
  const divAmenaza = createFormGroup("ri-alert-line", "selector", "tiposAmenaza", "selector__icono");
  const amenazaSelect = divAmenaza.querySelector("select");
  const optAmenaza = document.createElement("option");
  optAmenaza.value = "";
  optAmenaza.hidden = true;
  optAmenaza.textContent = "Seleccione un tipo de amenaza...";
  amenazaSelect.appendChild(optAmenaza);

  // Distancia (Input)
  const divDist = createFormGroup("ri-map-pin-line", "input", "distancia");
  const distanciaInput = divDist.querySelector("input");
  distanciaInput.placeholder = "Distancia del riesgo";
  distanciaInput.type = "text";
  distanciaInput.setAttribute("data-tipo", "numeroDecimal");

  // Sección de Vulnerabilidades
  const divVuln = document.createElement("div");
  divVuln.className = "input";
  
  const listaVulnDiv = document.createElement("div");
  listaVulnDiv.className = "gestionarAfecciones__lista";
  listaVulnDiv.id = "vulnerabilidades-lista";

  const sectionVulnDiv = document.createElement("div");
  sectionVulnDiv.className = "gestionarAfecciones";

  const headerVulnDiv = document.createElement("div");
  headerVulnDiv.className = "gestionarAfecciones__header";

  const tituloVulnDiv = document.createElement("div");
  tituloVulnDiv.className = "gestionarAfecciones__titulo";
  const vulnIcon = document.createElement("i");
  vulnIcon.className = "ri-sensor-line";
  const tituloVulnP = document.createElement("p");
  tituloVulnP.textContent = "Vulnerabilidad";
  tituloVulnDiv.append(vulnIcon, tituloVulnP);

  const btnAgregarVuln = document.createElement("button");
  btnAgregarVuln.type = "button";
  btnAgregarVuln.className = "gestionarAfecciones__boton boton";
  btnAgregarVuln.id = "btnAgregarVulnerabilidad";
  btnAgregarVuln.textContent = "Agregar nuevo";
  
  if (esSupervisor) {
    btnAgregarVuln.classList.add("oculto");
  }

  headerVulnDiv.append(tituloVulnDiv, btnAgregarVuln);
  sectionVulnDiv.append(headerVulnDiv, listaVulnDiv);
  divVuln.appendChild(sectionVulnDiv);

  // Sección de Acciones de Reducción Familiar
  const divAcc = document.createElement("div");
  divAcc.className = "input";
  
  const listaAccDiv = document.createElement("div");
  listaAccDiv.className = "gestionarAfecciones__lista";
  listaAccDiv.id = "acciones-lista";

  const sectionAccDiv = document.createElement("div");
  sectionAccDiv.className = "gestionarAfecciones";

  const headerAccDiv = document.createElement("div");
  headerAccDiv.className = "gestionarAfecciones__header";

  const tituloAccDiv = document.createElement("div");
  tituloAccDiv.className = "gestionarAfecciones__titulo";
  const accIcon = document.createElement("i");
  accIcon.className = "ri-shield-cross-line";
  const tituloAccP = document.createElement("p");
  tituloAccP.textContent = "Acciones de reduccion familiar";
  tituloAccDiv.append(accIcon, tituloAccP);

  const btnAgregarAcc = document.createElement("button");
  btnAgregarAcc.type = "button";
  btnAgregarAcc.className = "gestionarAfecciones__boton boton";
  btnAgregarAcc.id = "btnAgregarAccion";
  btnAgregarAcc.textContent = "Agregar nuevo";
  
  if (esSupervisor) {
    btnAgregarAcc.classList.add("oculto");
  }

  headerAccDiv.append(tituloAccDiv, btnAgregarAcc);
  sectionAccDiv.append(headerAccDiv, listaAccDiv);
  divAcc.appendChild(sectionAccDiv);

  // Botón Guardar / Siguiente
  const btnGuardar = document.createElement("button");
  btnGuardar.className = "boton";
  btnGuardar.id = "botonGuardar";
  btnGuardar.textContent = riskData ? "Guardar" : "Siguiente";

  // Armar formulario
  mainForm.append(divDesc, divUbic, divAmenaza, divDist, divVuln, divAcc, btnGuardar);

  // Carga de opciones de Amenazas
  await adjuntarOpc.adjuntar(amenazaSelect, "threatTypes");

  // Inyección de datos previos cargados
  if (riskData) {
    descripcionTextarea.value = riskData.description || "";
    ubicacionInput.value = riskData.ubication || riskData.location || "";
    distanciaInput.value = riskData.distance || "";
    amenazaSelect.value = riskData.threat_type_id || "";
  }

  // TomSelect
  try {
    const { default: TomSelect } = await import("tom-select");
    new TomSelect(amenazaSelect, {
      create: false,
      sortField: { field: "text", direction: "asc" }
    });
  } catch (e) {
    console.error("Error initializing TomSelect for threats:", e);
  }

  return mainForm;
};
