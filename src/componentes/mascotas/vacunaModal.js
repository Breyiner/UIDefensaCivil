import { campoFormulario } from "../campoFormulario.js";
import { formatearFecha } from "../../helpers/index.js";

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
  const grupoNombre = campoFormulario({
    iconClass: "ri-syringe-line",
    inputType: "input",
    id: "nombreInput"
  });
  const inputNombre = grupoNombre.querySelector("input");
  inputNombre.type = "text";
  inputNombre.classList.add("form__nombreVacuna");
  inputNombre.placeholder = "Nombre de la vacuna";
  inputNombre.setAttribute("data-tipo", "textoCorto");
  inputNombre.setAttribute("required", "");
  inputNombre.value = initialData ? (initialData.name || "") : "";

  // Campo Fecha
  const grupoFecha = campoFormulario({
    iconClass: "ri-calendar-line",
    inputType: "input",
    id: "fechaInput"
  });
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

/**
 * Componente UI: Modal para visualizar detalles de la mascota (mascotaDetalleModal)
 * Crea y retorna el elemento modal <dialog> para ver la información de la mascota y sus vacunas.
 * 
 * @param {Object} params
 * @param {Object} params.petData - Datos del perfil de la mascota
 * @param {Array} params.vaccines - Listado de vacunas de la mascota
 * @returns {HTMLDialogElement} Elemento dialog del modal
 */
export const mascotaDetalleModal = ({ petData, vaccines = [] }) => {
  const modal = document.createElement("dialog");
  modal.classList.add("modal-edicion");

  const cabecera = document.createElement("div");
  cabecera.classList.add("modal-edicion__cabecera");

  const titulo = document.createElement("h3");
  titulo.classList.add("modal-edicion__titulo");
  titulo.textContent = `Detalles de ${petData.name}`;
  cabecera.appendChild(titulo);
  modal.appendChild(cabecera);

  const content = document.createElement("div");
  content.classList.add("modal-edicion__content");

  const modalDiv = document.createElement("div");
  modalDiv.classList.add("modalVer", "modal", "modal-ver-sin-contenedor");

  const crearDato = (claseIcono, tituloDato, texto, largo) => {
    const dato = document.createElement("div");
    dato.classList.add("modalVer__dato");
    if (largo) dato.classList.add("modalVer__dato--largo");

    const icon = document.createElement("i");
    icon.classList.add(...claseIcono.split(" ").filter(Boolean));

    const tituloDiv = document.createElement("div");
    tituloDiv.classList.add("modalVer__titulo");
    tituloDiv.textContent = tituloDato;

    const textoDiv = document.createElement("div");
    textoDiv.classList.add("modalVer__texto");
    textoDiv.textContent = texto;

    dato.append(icon, tituloDiv, textoDiv);
    return dato;
  };

  const formattedVaccines = vaccines.map(v => `${v.name} (${formatearFecha(v.date)})`).join(", ") || "ninguna";

  modalDiv.append(
    crearDato("ri-coupon-line", "Nombre", petData.name),
    crearDato("ri-dna-line", "Raza", petData.breed),
    crearDato("ri-cake-2-line", "Edad", petData.age),
    crearDato("ri-bell-line", "Especie", petData.species ? petData.species.name : ""),
    crearDato("ri-syringe-line", "Vacunas", formattedVaccines, true)
  );

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
