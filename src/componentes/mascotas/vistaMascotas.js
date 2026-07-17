/**
 * Componente: Formulario VistaMascotas
 * Modulo visual puro encargado de estructurar y retornar el nodo DOM del formulario de mascota.
 * Sigue la estructura de tarjeta_gestion retornando directamente el elemento.
 * 
 * @module VistaMascotas
 */
import { adjuntarOpciones as adjuntarOpc, formatearFecha } from "@/helpers/index.js";

/**
 * Crea y retorna el elemento visual (chip) de una vacuna
 * 
 * @param {Object} vacuna - Datos de la vacuna
 * @param {boolean} esSupervisor - Indica si el rol es supervisor (oculta botón de eliminar)
 * @param {Function} [onEdit] - Callback al hacer clic en el chip para editar
 * @param {Function} [onDelete] - Callback al hacer clic en el botón de eliminar
 * @returns {HTMLElement} Elemento DOM del tag
 */
export const crearVacunaTag = (vacuna, esSupervisor, onEdit, onDelete) => {
  const tag = document.createElement("div");
  tag.className = "gestionarAfecciones__afeccion";

  const label = document.createElement("span");
  label.className = "gestionarAfecciones__tipoNombre";
  label.textContent = `${vacuna.name} - ${formatearFecha(vacuna.date)}`;
  tag.appendChild(label);

  tag.classList.add("gestionarAfecciones__afeccion--editable");
  tag.addEventListener("click", (e) => {
    if (e.target.closest(".vacuna-tag__eliminar")) return;
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
 * Crea y retorna un contenedor de grupo de formulario (input o select)
 * con su respectivo icono y clases.
 * 
 * @param {string} iconClass - Clase CSS del icono de FontAwesome/RemixIcon
 * @param {string} inputType - Tipo de campo: "selector-portatil" u otro (input)
 * @param {string} id - Atributo id del campo
 * @param {string} [iconId=""] - Atributo id del elemento <i> (opcional)
 * @returns {HTMLElement} Elemento DOM wrapper del grupo
 */
export const createFormGroup = (iconClass, inputType, id, iconId = "") => {
  const wrapper = document.createElement("div");
  wrapper.className = "input";

  const inputBox = document.createElement("div");
  inputBox.className = inputType === "selector-portatil" ? "form__inputBox form__inputBox--selector" : "form__inputBox";

  const i = document.createElement("i");
  i.className = iconClass;
  if (iconId) i.id = iconId;

  let field;
  if (inputType === "selector-portatil") {
    field = document.createElement("select");
    field.className = "selector-portatil";
  } else {
    field = document.createElement("input");
    field.autocomplete = "off";
  }
  field.id = id;

  inputBox.append(i, field);
  wrapper.appendChild(inputBox);
  return wrapper;
};

/**
 * Genera el formulario HTML de mascotas
 * 
 * @param {Object} params
 * @param {Object|null} params.petData - Información cargada del perfil de la mascota
 * @param {boolean} params.esSupervisor - Estado de rol de supervisor
 * @returns {HTMLElement} Elemento HTML <form>
 */
export default async ({ petData = null, esSupervisor = false }) => {

  const mainForm = document.createElement("form");
  mainForm.method = "POST";
  mainForm.className = "form";

  const divEsp = createFormGroup("ri-bell-line", "selector-portatil", "especies", "selector__icono");
  const especiesSelect = divEsp.querySelector("select");
  const optEsp = document.createElement("option");
  optEsp.value = "";
  optEsp.hidden = true;
  optEsp.textContent = "Seleccione un tipo de especie...";
  especiesSelect.appendChild(optEsp);

  const divNom = createFormGroup("ri-coupon-line", "input", "nombre");
  const nombreInput = divNom.querySelector("input");
  nombreInput.placeholder = "nombre";
  nombreInput.type = "text";
  nombreInput.setAttribute("data-tipo", "textoCorto");

  const doubleDiv = document.createElement("div");
  doubleDiv.className = "form__inputBox--double";

  const divRaz = createFormGroup("ri-dna-line", "input", "raza");
  const razaInput = divRaz.querySelector("input");
  razaInput.placeholder = "raza";
  razaInput.type = "text";

  const divEdad = createFormGroup("ri-cake-2-line", "input", "edad");
  const edadInput = divEdad.querySelector("input");
  edadInput.type = "text";
  edadInput.placeholder = "fecha de nacimiento";
  edadInput.setAttribute("data-fecha", "fechaAntes");
  edadInput.readOnly = true;
  edadInput.addEventListener("keydown", e => e.preventDefault());
  edadInput.addEventListener("paste", e => e.preventDefault());

  doubleDiv.append(divRaz, divEdad);

  const divGen = createFormGroup("ri-user-line", "selector-portatil", "generos", "selector__icono");
  const generosSelect = divGen.querySelector("select");
  const optGen = document.createElement("option");
  optGen.value = "";
  optGen.hidden = true;
  optGen.textContent = "Seleccione Macho/Hembra...";
  generosSelect.appendChild(optGen);

  const divVac = document.createElement("div");
  divVac.className = "input";
  const listaDiv = document.createElement("div");
  listaDiv.className = "gestionarAfecciones__lista";

  const sectionDiv = document.createElement("div");
  sectionDiv.className = "gestionarAfecciones";

  const headerDiv = document.createElement("div");
  headerDiv.className = "gestionarAfecciones__header";

  const tituloDiv = document.createElement("div");
  tituloDiv.className = "gestionarAfecciones__titulo";
  const syringeIcon = document.createElement("i");
  syringeIcon.className = "ri-syringe-line";
  const tituloP = document.createElement("p");
  tituloP.textContent = "Lista de Vacunas";
  tituloDiv.append(syringeIcon, tituloP);

  const btnAgregar = document.createElement("button");
  btnAgregar.type = "button";
  btnAgregar.className = "gestionarAfecciones__boton boton";
  btnAgregar.id = "btnAgregarVacuna";
  btnAgregar.textContent = "Agregar nuevo";
  
  if (esSupervisor) {
    btnAgregar.classList.add("oculto");
  }

  headerDiv.append(tituloDiv, btnAgregar);
  sectionDiv.append(headerDiv, listaDiv);
  divVac.appendChild(sectionDiv);

  const btnGuardar = document.createElement("button");
  btnGuardar.className = "boton";
  btnGuardar.id = "botonGuardar";
  btnGuardar.textContent = "Guardar";

  mainForm.append(divEsp, divNom, doubleDiv, divGen, divVac, btnGuardar);

  // Carga de opciones de Dropdowns
  await adjuntarOpc.adjuntar(especiesSelect, "species");
  await adjuntarOpc.adjuntarNoValida(generosSelect, "animalGenders");

  // Inyección de datos previos cargados
  if (petData) {
    nombreInput.value = petData.name || "";
    razaInput.value = petData.breed || "";
    // Formatea la fecha ISO para mostrarla como DD/MM/YY visualmente, manteniendo el valor ISO en el dataset
    if (petData.birth_date) {
      const isoDate = petData.birth_date.split("T")[0];
      edadInput.value = formatearFecha(isoDate);
      edadInput.dataset.isoDate = isoDate;
    } else {
      edadInput.value = "";
      edadInput.dataset.isoDate = "";
    }
    especiesSelect.value = petData.species_id || "";
    generosSelect.value = petData.animal_gender_id || "";
  }

  return mainForm;
};
