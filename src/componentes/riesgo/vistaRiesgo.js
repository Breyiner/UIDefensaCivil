/**
 * Componente: Formulario VistaRiesgo
 * Modulo visual puro encargado de estructurar y retornar el nodo DOM del formulario de factores de riesgo.
 * Sigue la estructura de tarjeta_gestion retornando directamente el elemento.
 * 
 * @module VistaRiesgo
 */
import { campoFormulario } from "../campoFormulario.js";

/**
 * Genera el formulario HTML de factores de riesgo
 * 
 * @param {Object} params
 * @param {boolean} params.esSupervisor - Estado de rol de supervisor
 * @returns {HTMLElement} Elemento HTML <form>
 */
export default ({ esSupervisor = false }) => {

  const mainForm = document.createElement("form");
  mainForm.method = "POST";
  mainForm.classList.add("form");

  // Descripción (Textarea)
  const divDesc = campoFormulario({
    iconClass: "ri-file-text-line",
    inputType: "textarea",
    id: "descripcion"
  });
  const descripcionTextarea = divDesc.querySelector("textarea");
  descripcionTextarea.placeholder = "Descripcion";
  descripcionTextarea.setAttribute("data-tipo", "textoLargo");

  // Ubicación (Input)
  const divUbic = campoFormulario({
    iconClass: "ri-map-pin-2-fill",
    inputType: "input",
    id: "ubicacion"
  });
  const ubicacionInput = divUbic.querySelector("input");
  ubicacionInput.placeholder = "Ubicacion del riesgo";
  ubicacionInput.type = "text";
  ubicacionInput.setAttribute("data-tipo", "textoMedio");

  // Amenaza (Selector)
  const divAmenaza = campoFormulario({
    iconClass: "ri-alert-line",
    inputType: "selector-portatil",
    id: "tiposAmenaza",
    iconId: "selector__icono"
  });
  const amenazaSelect = divAmenaza.querySelector(".selector-portatil");
  const optAmenaza = document.createElement("option");
  optAmenaza.value = "";
  optAmenaza.hidden = true;
  optAmenaza.textContent = "Seleccione un tipo de amenaza...";
  amenazaSelect.appendChild(optAmenaza);

  // Distancia (Input)
  const divDist = campoFormulario({
    iconClass: "ri-map-pin-line",
    inputType: "input",
    id: "distancia"
  });
  const distanciaInput = divDist.querySelector("input");
  distanciaInput.placeholder = "Distancia del riesgo";
  distanciaInput.type = "text";
  distanciaInput.setAttribute("data-tipo", "numeroDecimal");

  // Sección de Vulnerabilidades
  const divVuln = document.createElement("div");
  divVuln.classList.add("input");
  
  const listaVulnDiv = document.createElement("div");
  listaVulnDiv.classList.add("gestionarAfecciones__lista");
  listaVulnDiv.id = "vulnerabilidades-lista";

  const sectionVulnDiv = document.createElement("div");
  sectionVulnDiv.classList.add("gestionarAfecciones");

  const headerVulnDiv = document.createElement("div");
  headerVulnDiv.classList.add("gestionarAfecciones__header");

  const tituloVulnDiv = document.createElement("div");
  tituloVulnDiv.classList.add("gestionarAfecciones__titulo");
  const vulnIcon = document.createElement("i");
  vulnIcon.classList.add("ri-sensor-line");
  const tituloVulnP = document.createElement("p");
  tituloVulnP.textContent = "Vulnerabilidad";
  tituloVulnDiv.append(vulnIcon, tituloVulnP);

  const btnAgregarVuln = document.createElement("button");
  btnAgregarVuln.type = "button";
  btnAgregarVuln.classList.add("gestionarAfecciones__boton", "boton");
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
  divAcc.classList.add("input");
  
  const listaAccDiv = document.createElement("div");
  listaAccDiv.classList.add("gestionarAfecciones__lista");
  listaAccDiv.id = "acciones-lista";

  const sectionAccDiv = document.createElement("div");
  sectionAccDiv.classList.add("gestionarAfecciones");

  const headerAccDiv = document.createElement("div");
  headerAccDiv.classList.add("gestionarAfecciones__header");

  const tituloAccDiv = document.createElement("div");
  tituloAccDiv.classList.add("gestionarAfecciones__titulo");
  const accIcon = document.createElement("i");
  accIcon.classList.add("ri-shield-cross-line");
  const tituloAccP = document.createElement("p");
  tituloAccP.textContent = "Acciones de reduccion familiar";
  tituloAccDiv.append(accIcon, tituloAccP);

  const btnAgregarAcc = document.createElement("button");
  btnAgregarAcc.type = "button";
  btnAgregarAcc.classList.add("gestionarAfecciones__boton", "boton");
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
  btnGuardar.classList.add("boton");
  btnGuardar.id = "botonGuardar";
  btnGuardar.textContent = "Siguiente";

  // Armar formulario
  mainForm.append(divDesc, divUbic, divAmenaza, divDist, divVuln, divAcc, btnGuardar);

  return mainForm;
};
