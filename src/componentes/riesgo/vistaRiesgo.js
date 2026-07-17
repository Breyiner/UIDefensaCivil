
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
  tag.classList.add("gestionarAfecciones__afeccion");

  const label = document.createElement("span");
  label.classList.add("gestionarAfecciones__tipoNombre");
  label.textContent = item.labelText || "";

  tag.append(label);

  tag.classList.add("gestionarAfecciones__afeccion--editable");
  tag.addEventListener("click", (e) => {
    if (e.target.closest("button") || e.target.closest("i.ri-close-line")) return;
    if (onEdit) onEdit();
  });

  if (!esSupervisor) {
    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.classList.add("vacuna-tag__eliminar");

    const xIcon = document.createElement("i");
    xIcon.classList.add("ri-close-line");
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
  tag.classList.add("gestionarAfecciones__afeccion");

  const label = document.createElement("span");
  label.classList.add("gestionarAfecciones__tipoNombre");
  label.textContent = item.labelText || "";

  tag.append(label);

  tag.classList.add("gestionarAfecciones__afeccion--editable");
  tag.addEventListener("click", (e) => {
    if (e.target.closest("button") || e.target.closest("i.ri-close-line")) return;
    if (onEdit) onEdit();
  });

  if (!esSupervisor) {
    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.classList.add("vacuna-tag__eliminar");

    const xIcon = document.createElement("i");
    xIcon.classList.add("ri-close-line");
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
 * Crea y retorna un contenedor de grupo de formulario (input, select, o textarea)
 * con su respectivo icono y clases.
 * 
 * @param {string} iconClass - Clase CSS del icono de FontAwesome/RemixIcon
 * @param {string} inputType - Tipo de campo: "selector-portatil", "textarea", u otro (input)
 * @param {string} id - Atributo id del campo
 * @param {string} [iconId=""] - Atributo id del elemento <i> (opcional)
 * @returns {HTMLElement} Elemento DOM wrapper del grupo
 */
export const createFormGroup = (iconClass, inputType, id, iconId = "") => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("input");

  const inputBox = document.createElement("div");
  if (inputType === "selector-portatil") {
    inputBox.classList.add("form__inputBox", "form__inputBox--selector");
  } else {
    inputBox.classList.add("form__inputBox");
  }

  const i = document.createElement("i");
  i.className = iconClass;
  if (iconId) i.id = iconId;

  let field;
  if (inputType === "selector-portatil") {
    field = document.createElement("select");
    field.classList.add("selector-portatil");
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
  const divAmenaza = createFormGroup("ri-alert-line", "selector-portatil", "tiposAmenaza", "selector__icono");
  const amenazaSelect = divAmenaza.querySelector(".selector-portatil");
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
