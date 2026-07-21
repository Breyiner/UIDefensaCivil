/**
 * Componente: Formulario VistaMascotas
 * Modulo visual puro encargado de estructurar y retornar el nodo DOM del formulario de mascota.
 * Sigue estrictamente la restricción de ser síncrono, visual, usar classList y no hacer consultas a API.
 * 
 * @module VistaMascotas
 */
import { campoFormulario } from "../campoFormulario.js";

/**
 * Genera el formulario HTML de mascotas de forma síncrona
 * 
 * @param {Object} params
 * @param {boolean} params.esSupervisor - Estado de rol de supervisor (deshabilita edición/adición)
 * @returns {HTMLElement} Elemento HTML <form>
 */
export default ({ esSupervisor = false }) => {
  const mainForm = document.createElement("form");
  mainForm.method = "POST";
  mainForm.classList.add("form");

  // Especie
  const divEsp = campoFormulario({
    iconClass: "ri-bell-line",
    inputType: "selector-portatil",
    id: "especies",
    iconId: "selector__icono"
  });
  const especiesSelect = divEsp.querySelector("select");
  const optEsp = document.createElement("option");
  optEsp.value = "";
  optEsp.hidden = true;
  optEsp.textContent = "Seleccione un tipo de especie...";
  especiesSelect.appendChild(optEsp);

  // Nombre
  const divNom = campoFormulario({
    iconClass: "ri-coupon-line",
    inputType: "input",
    id: "nombre"
  });
  const nombreInput = divNom.querySelector("input");
  nombreInput.placeholder = "nombre";
  nombreInput.type = "text";
  nombreInput.setAttribute("data-tipo", "textoCorto");

  // Raza y Edad
  const doubleDiv = document.createElement("div");
  doubleDiv.classList.add("form__inputBox--double");

  const divRaz = campoFormulario({
    iconClass: "ri-dna-line",
    inputType: "input",
    id: "raza"
  });
  const razaInput = divRaz.querySelector("input");
  razaInput.placeholder = "raza";
  razaInput.type = "text";

  const divEdad = campoFormulario({
    iconClass: "ri-cake-2-line",
    inputType: "input",
    id: "edad"
  });
  const edadInput = divEdad.querySelector("input");
  edadInput.type = "text";
  edadInput.placeholder = "fecha de nacimiento";
  edadInput.setAttribute("data-fecha", "fechaAntes");
  edadInput.readOnly = true;
  edadInput.addEventListener("keydown", e => e.preventDefault());
  edadInput.addEventListener("paste", e => e.preventDefault());

  doubleDiv.append(divRaz, divEdad);

  // Género
  const divGen = campoFormulario({
    iconClass: "ri-user-line",
    inputType: "selector-portatil",
    id: "generos",
    iconId: "selector__icono"
  });
  const generosSelect = divGen.querySelector("select");
  const optGen = document.createElement("option");
  optGen.value = "";
  optGen.hidden = true;
  optGen.textContent = "Seleccione Macho/Hembra...";
  generosSelect.appendChild(optGen);

  // Vacunas
  const divVac = document.createElement("div");
  divVac.classList.add("input");
  const listaDiv = document.createElement("div");
  listaDiv.classList.add("gestionarAfecciones__lista");

  const sectionDiv = document.createElement("div");
  sectionDiv.classList.add("gestionarAfecciones");

  const headerDiv = document.createElement("div");
  headerDiv.classList.add("gestionarAfecciones__header");

  const tituloDiv = document.createElement("div");
  tituloDiv.classList.add("gestionarAfecciones__titulo");
  const syringeIcon = document.createElement("i");
  syringeIcon.classList.add("ri-syringe-line");
  const tituloP = document.createElement("p");
  tituloP.textContent = "Lista de Vacunas";
  tituloDiv.append(syringeIcon, tituloP);

  const btnAgregar = document.createElement("button");
  btnAgregar.type = "button";
  btnAgregar.classList.add("gestionarAfecciones__boton", "boton");
  btnAgregar.id = "btnAgregarVacuna";
  btnAgregar.textContent = "Agregar nuevo";
  
  if (esSupervisor) {
    btnAgregar.classList.add("oculto");
  }

  headerDiv.append(tituloDiv, btnAgregar);
  sectionDiv.append(headerDiv, listaDiv);
  divVac.appendChild(sectionDiv);

  const btnGuardar = document.createElement("button");
  btnGuardar.classList.add("boton");
  btnGuardar.id = "botonGuardar";
  btnGuardar.textContent = "Guardar";

  mainForm.append(divEsp, divNom, doubleDiv, divGen, divVac, btnGuardar);

  return mainForm;
};
