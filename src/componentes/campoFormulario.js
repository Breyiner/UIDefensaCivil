/**
 * Componente UI Reutilizable: Campo de Formulario (campoFormulario.js)
 * Genera y retorna una fila estandarizada con icono y su respectivo input, select o textarea.
 * Evita repetir el código de maquetación DOM por cada campo de entrada y utiliza classList exclusivamente.
 * 
 * @param {Object} params
 * @param {string} params.iconClass - Clase CSS del icono de RemixIcon (ej. "ri-user-line")
 * @param {string} params.inputType - Tipo de campo: "selector-portatil", "textarea" o "input"
 * @param {string} params.id - Atributo ID para identificar el campo de entrada
 * @param {string} [params.iconId=""] - ID opcional para el elemento de icono
 * @returns {HTMLElement} Elemento DOM de la fila de formulario
 */
export const campoFormulario = ({ iconClass, inputType, id, iconId = "" }) => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("input");

  const inputBox = document.createElement("div");
  if (inputType === "selector-portatil") {
    inputBox.classList.add("form__inputBox", "form__inputBox--selector");
  } else {
    inputBox.classList.add("form__inputBox");
  }

  const i = document.createElement("i");
  i.classList.add(...iconClass.split(" ").filter(Boolean));
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

export default campoFormulario;
