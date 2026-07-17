import { createFormGroup } from "./vistaMascotas.js";

/**
 * Componente UI: Modal para Añadir/Editar Vacuna (VacunaModal)
 * Crea y retorna el elemento modal <dialog> para capturar nombre y fecha de vacuna.
 * 
 * @module VacunaModal
 */

/**
 * Crea y retorna el elemento modal
 * 
 * @param {Object} params
 * @param {Object|null} params.initialData - Datos iniciales de la vacuna (para edición)
 * @param {string} params.birthDate - Fecha de nacimiento de la mascota
 * @returns {HTMLDialogElement} Elemento dialog del modal
 */
export default ({ initialData = null, birthDate = "" } = {}) => {
  const modal = document.createElement("dialog");
  modal.classList.add("modal-edicion");

  const cabecera = document.createElement("div");
  cabecera.classList.add("modal-edicion__cabecera");

  const titulo = document.createElement("h3");
  titulo.classList.add("modal-edicion__titulo");
  titulo.textContent = initialData ? "Editar Vacuna" : "Agregar Vacuna";
  cabecera.appendChild(titulo);
  modal.appendChild(cabecera);

  const content = document.createElement("div");
  content.classList.add("modal-edicion__content");

  const form = document.createElement("form");
  form.classList.add("modal-edicion__formulario");

  // Campo Nombre
  const grupoNombre = createFormGroup("ri-syringe-line", "input", "nombreInput");
  const inputNombre = grupoNombre.querySelector("input");
  inputNombre.type = "text";
  inputNombre.classList.add("form__nombreVacuna");
  inputNombre.placeholder = "Nombre de la vacuna";
  inputNombre.setAttribute("data-tipo", "textoCorto");
  inputNombre.setAttribute("required", "");
  inputNombre.value = initialData ? (initialData.name || "") : "";

  // Campo Fecha
  const grupoFecha = createFormGroup("ri-calendar-line", "input", "fechaInput");
  const inputFecha = grupoFecha.querySelector("input");
  inputFecha.type = "text";
  inputFecha.classList.add("form__fechaVacuna");
  inputFecha.placeholder = "Fecha de vacunación";
  inputFecha.setAttribute("data-tipo", "fechaVacuna");
  inputFecha.setAttribute("required", "");
  inputFecha.value = initialData ? (initialData.date || "") : "";
  inputFecha.dataset.birthDate = birthDate;

  form.append(grupoNombre, grupoFecha);
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
