/**
 * Componente UI: Modales de Factores de Riesgo
 * Módulo visual puro encargado de estructurar y retornar los nodos DOM de los diálogos nativos.
 * No contiene lógica de control de eventos, validaciones, montajes al DOM ni llamadas asíncronas.
 * 
 * @module riesgoModales
 */

import { campoFormulario } from "../campoFormulario.js";

/**
 * Crea y retorna el nodo DOM del diálogo <dialog> para agregar/editar una vulnerabilidad.
 * 
 * @param {Object} params
 * @param {Object|null} params.initialData - Datos previos en caso de edición
 * @param {Array} params.vulnerabilities - Listado de vulnerabilidades catálogos
 * @param {Array} params.vulnerabilityGrades - Listado de grados de vulnerabilidades catálogos
 * @returns {HTMLDialogElement} Elemento dialog listo para ser controlado
 */
export const agregarVulnerabilidadMemoria = ({ initialData = null, vulnerabilities = [], vulnerabilityGrades = [] }) => {
  const modal = document.createElement("dialog");
  modal.classList.add("modal-edicion");

  const cabecera = document.createElement("div");
  cabecera.classList.add("modal-edicion__cabecera");
  
  const titulo = document.createElement("h3");
  titulo.classList.add("modal-edicion__titulo");
  titulo.textContent = initialData ? "Editar Vulnerabilidad" : "Agregar Vulnerabilidad";
  cabecera.appendChild(titulo);
  modal.appendChild(cabecera);

  const content = document.createElement("div");
  content.classList.add("modal-edicion__content");

  const form = document.createElement("form");
  form.classList.add("modal-edicion__formulario");

  // Select 1: Vulnerability
  const grupoVuln = campoFormulario({
    iconClass: "ri-alert-line",
    inputType: "selector-portatil",
    id: "vulnerabilidadSelect",
    iconId: "selector__icono"
  });
  const selectVulnerability = grupoVuln.querySelector("select");
  selectVulnerability.classList.add("form__vulnerability");
  selectVulnerability.setAttribute("required", "");
  
  const optionDefault1 = document.createElement("option");
  optionDefault1.value = "";
  optionDefault1.textContent = "Seleccione vulnerabilidad";
  selectVulnerability.appendChild(optionDefault1);

  vulnerabilities.forEach(item => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.name;
    if (initialData && (item.id == initialData.vulnerability_id || item.id == initialData.vulnerability?.id)) {
      option.selected = true;
    }
    selectVulnerability.appendChild(option);
  });

  // Select 2: Grade
  const grupoGrade = campoFormulario({
    iconClass: "ri-bar-chart-line",
    inputType: "selector-portatil",
    id: "gradoSelect",
    iconId: "selector__icono"
  });
  const selectGrade = grupoGrade.querySelector("select");
  selectGrade.classList.add("form__vulnerabilityGrade");
  selectGrade.setAttribute("required", "");

  const optionDefault2 = document.createElement("option");
  optionDefault2.value = "";
  optionDefault2.textContent = "Seleccione grado";
  selectGrade.appendChild(optionDefault2);

  vulnerabilityGrades.forEach(item => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.name;
    if (initialData && (item.id == initialData.vulnerability_grade_id || item.id == initialData.vulnerability_grade?.id)) {
      option.selected = true;
    }
    selectGrade.appendChild(option);
  });

  form.append(grupoVuln, grupoGrade);
  content.appendChild(form);
  modal.appendChild(content);

  const pie = document.createElement("div");
  pie.classList.add("modal-edicion__pie");

  const btnCancelar = document.createElement("button");
  btnCancelar.type = "button";
  btnCancelar.classList.add("modal-edicion__btn", "modal-edicion__btn--secundario");
  btnCancelar.textContent = "Cancelar";

  const btnGuardar = document.createElement("button");
  btnGuardar.type = "button";
  btnGuardar.classList.add("modal-edicion__btn", "modal-edicion__btn--primario");
  btnGuardar.textContent = "Guardar";

  pie.append(btnCancelar, btnGuardar);
  modal.appendChild(pie);

  return modal;
};

/**
 * Crea y retorna el nodo DOM del diálogo <dialog> para agregar/editar una acción de reducción.
 * 
 * @param {Object} params
 * @param {Array} params.members - Listado de integrantes cargado
 * @param {Object|null} params.initialData - Datos previos en caso de edición
 * @returns {HTMLDialogElement} Elemento dialog listo para ser controlado
 */
export const agregarAccionMemoria = ({ members = [], initialData = null }) => {
  const modal = document.createElement("dialog");
  modal.classList.add("modal-edicion");

  const cabecera = document.createElement("div");
  cabecera.classList.add("modal-edicion__cabecera");
  
  const titulo = document.createElement("h3");
  titulo.classList.add("modal-edicion__titulo");
  titulo.textContent = initialData ? "Editar Acción" : "Agregar Acción de Reducción";
  cabecera.appendChild(titulo);
  modal.appendChild(cabecera);

  const content = document.createElement("div");
  content.classList.add("modal-edicion__content");

  const form = document.createElement("form");
  form.classList.add("modal-edicion__formulario");

  // Campo Acción
  const grupoAccion = campoFormulario({
    iconClass: "ri-shield-check-line",
    inputType: "input",
    id: "accionInput"
  });
  const inputAction = grupoAccion.querySelector("input");
  inputAction.type = "text";
  inputAction.classList.add("form__action");
  inputAction.placeholder = "Acción a realizar";
  inputAction.setAttribute("data-tipo", "textoCorto");
  inputAction.setAttribute("required", "");
  if (initialData) {
    inputAction.value = initialData.action || "";
  }

  // Campo Miembro Encargado
  const grupoMember = campoFormulario({
    iconClass: "ri-user-line",
    inputType: "selector-portatil",
    id: "miembroSelect",
    iconId: "selector__icono"
  });
  const selectMember = grupoMember.querySelector("select");
  selectMember.classList.add("form__member");
  selectMember.setAttribute("required", "");
  
  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Seleccione un miembro";
  selectMember.appendChild(optionDefault);

  members.forEach(member => {
    const option = document.createElement("option");
    option.value = member.id;
    option.textContent = member.full_name || member.name || `${member.names} ${member.last_names}`;
    if (initialData && member.id == (initialData.member_id || initialData.member?.id)) {
      option.selected = true;
    }
    selectMember.appendChild(option);
  });

  // Campo Fecha
  const grupoFecha = campoFormulario({
    iconClass: "ri-calendar-line",
    inputType: "input",
    id: "fechaInput"
  });
  const inputDate = grupoFecha.querySelector("input");
  inputDate.type = "text";
  inputDate.placeholder = "Fecha de finalización";
  inputDate.classList.add("form__date");
  inputDate.setAttribute("required", "");
  if (initialData) {
    inputDate.value = initialData.end_date ? initialData.end_date.split("T")[0] : "";
  }

  form.append(grupoAccion, grupoMember, grupoFecha);
  content.appendChild(form);
  modal.appendChild(content);

  const pie = document.createElement("div");
  pie.classList.add("modal-edicion__pie");

  const btnCancelar = document.createElement("button");
  btnCancelar.type = "button";
  btnCancelar.classList.add("modal-edicion__btn", "modal-edicion__btn--secundario");
  btnCancelar.textContent = "Cancelar";

  const btnGuardar = document.createElement("button");
  btnGuardar.type = "button";
  btnGuardar.classList.add("modal-edicion__btn", "modal-edicion__btn--primario");
  btnGuardar.textContent = "Guardar";

  pie.append(btnCancelar, btnGuardar);
  modal.appendChild(pie);

  // Establecer fecha mínima como el día de hoy local en el calendario nativo
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  inputDate.setAttribute("min", todayStr);

  return modal;
};

/**
 * Crea y retorna el nodo DOM del diálogo <dialog> de sólo lectura para visualizar detalles del riesgo.
 * 
 * @param {Object} riskData - Datos formateados del factor de riesgo y sus relaciones
 * @returns {HTMLDialogElement} Elemento dialog listo para ser controlado
 */
export const verRiesgo = (riskData) => {
  const modal = document.createElement("dialog");
  modal.classList.add("modal-edicion");

  const cabecera = document.createElement("div");
  cabecera.classList.add("modal-edicion__cabecera");
  
  const titulo = document.createElement("h3");
  titulo.classList.add("modal-edicion__titulo");
  titulo.textContent = "Detalles de Factor de Riesgo";
  cabecera.appendChild(titulo);
  modal.appendChild(cabecera);

  const content = document.createElement("div");
  content.classList.add("modal-edicion__content");

  const modalDiv = document.createElement("div");
  modalDiv.classList.add("modalVer", "modal", "modal-ver-sin-contenedor");


  // 1. Tipo de Amenaza
  const datoAmenaza = document.createElement("div");
  datoAmenaza.classList.add("modalVer__dato", "modalVer__dato--largo");
  const iconAmenaza = document.createElement("i");
  iconAmenaza.classList.add("ri-shield-check-line");
  const tituloAmenaza = document.createElement("div");
  tituloAmenaza.classList.add("modalVer__titulo");
  tituloAmenaza.textContent = "Tipo de Amenaza";
  const textoAmenaza = document.createElement("div");
  textoAmenaza.classList.add("modalVer__texto");
  textoAmenaza.textContent = riskData.threatTypeName || "";
  datoAmenaza.append(iconAmenaza, tituloAmenaza, textoAmenaza);

  // 2. Descripcion
  const datoDesc = document.createElement("div");
  datoDesc.classList.add("modalVer__dato", "modalVer__dato--largo");
  const iconDesc = document.createElement("i");
  iconDesc.classList.add("ri-user-line");
  const tituloDesc = document.createElement("div");
  tituloDesc.classList.add("modalVer__titulo");
  tituloDesc.textContent = "Descripcion";
  const textoDesc = document.createElement("div");
  textoDesc.classList.add("modalVer__texto");
  textoDesc.textContent = riskData.description || "";
  datoDesc.append(iconDesc, tituloDesc, textoDesc);

  // 3. Ubicacion del riesgo
  const datoUbic = document.createElement("div");
  datoUbic.classList.add("modalVer__dato");
  const iconUbic = document.createElement("i");
  iconUbic.classList.add("ri-map-pin-2-line");
  const tituloUbic = document.createElement("div");
  tituloUbic.classList.add("modalVer__titulo");
  tituloUbic.textContent = "Ubicacion del riesgo";
  const textoUbic = document.createElement("div");
  textoUbic.classList.add("modalVer__texto");
  textoUbic.textContent = riskData.location || "";
  datoUbic.append(iconUbic, tituloUbic, textoUbic);

  // 4. Distancia
  const datoDist = document.createElement("div");
  datoDist.classList.add("modalVer__dato");
  const iconDist = document.createElement("i");
  iconDist.classList.add("ri-map-pin-line");
  const tituloDist = document.createElement("div");
  tituloDist.classList.add("modalVer__titulo");
  tituloDist.textContent = "Distancia";
  const textoDist = document.createElement("div");
  textoDist.classList.add("modalVer__texto");
  textoDist.textContent = riskData.distanceText || "";
  datoDist.append(iconDist, tituloDist, textoDist);

  // 5. Acciones de reducción de riesgo
  const datoAcc = document.createElement("div");
  datoAcc.classList.add("modalVer__dato", "modalVer__dato--largo");
  const iconAcc = document.createElement("i");
  iconAcc.classList.add("ri-list-check");
  const tituloAcc = document.createElement("div");
  tituloAcc.classList.add("modalVer__titulo");
  tituloAcc.textContent = "Acciones de reducción de riesgo";
  const textoAcc = document.createElement("div");
  textoAcc.classList.add("modalVer__texto");
  textoAcc.textContent = riskData.actionsText || "";
  datoAcc.append(iconAcc, tituloAcc, textoAcc);

  // 6. Vulnerabilidades
  const datoVuln = document.createElement("div");
  datoVuln.classList.add("modalVer__dato", "modalVer__dato--largo");
  const iconVuln = document.createElement("i");
  iconVuln.classList.add("ri-list-check");
  const tituloVuln = document.createElement("div");
  tituloVuln.classList.add("modalVer__titulo");
  tituloVuln.textContent = "Vulnerabilidades";
  const textoVuln = document.createElement("div");
  textoVuln.classList.add("modalVer__texto");
  textoVuln.textContent = riskData.vulnerabilitiesText || "";
  datoVuln.append(iconVuln, tituloVuln, textoVuln);

  modalDiv.append(datoAmenaza, datoDesc, datoUbic, datoDist, datoAcc, datoVuln);

  content.appendChild(modalDiv);
  modal.appendChild(content);

  const pie = document.createElement("div");
  pie.classList.add("modal-edicion__pie");

  const btnCerrar = document.createElement("button");
  btnCerrar.type = "button";
  btnCerrar.classList.add("modal-edicion__btn", "modal-edicion__btn--secundario");
  btnCerrar.textContent = "Cerrar";
  
  pie.appendChild(btnCerrar);
  modal.appendChild(pie);

  return modal;
};
