import * as validacion from "@/helpers/validacionInputs.js";
import AirDatepicker from "air-datepicker";
import localeEs from "air-datepicker/locale/es";
import "air-datepicker/air-datepicker.css";
import { alertas as alerta } from "@/helpers/index.js";

/**
 * Componente UI: Modal para Añadir/Editar Vacuna (VacunaModal)
 * Abre un elemento <dialog> nativo para capturar nombre y fecha de vacuna.
 * 
 * @module VacotaModal
 */

/**
 * Abre y muestra el modal de vacunas
 * 
 * @param {Object} params
 * @param {Object|null} params.initialData - Datos iniciales de la vacuna (para edición)
 * @param {string} params.birthDate - Fecha de nacimiento de la mascota (para limitar la fecha de la vacuna)
 * @param {Function} params.onSave - Callback al hacer clic en guardar con los datos { name, date }
 */
export default ({ initialData = null, birthDate = "", onSave }) => {
  const modal = document.createElement("dialog");
  modal.className = "modal-edicion";

  const cabecera = document.createElement("div");
  cabecera.className = "modal-edicion__cabecera";
  
  const titulo = document.createElement("h3");
  titulo.className = "modal-edicion__titulo";
  titulo.textContent = initialData ? "Editar Vacuna" : "Agregar Vacuna";
  cabecera.appendChild(titulo);
  modal.appendChild(cabecera);

  const content = document.createElement("div");
  content.className = "modal-edicion__content";

  const form = document.createElement("form");
  form.className = "modal-edicion__formulario";

  // Campo Nombre
  const grupoNombre = document.createElement("div");
  grupoNombre.className = "input";
  const formGroup1 = document.createElement("div");
  formGroup1.className = "form__inputBox";
  const icon1 = document.createElement("i");
  icon1.className = "ri-syringe-line";
  const inputNombre = document.createElement("input");
  inputNombre.type = "text";
  inputNombre.className = "form__input";
  inputNombre.placeholder = "Nombre de la vacuna";
  inputNombre.autocomplete = "off";
  inputNombre.setAttribute("data-tipo", "textoCorto");
  inputNombre.value = initialData ? initialData.name : "";
  formGroup1.append(icon1, inputNombre);
  grupoNombre.appendChild(formGroup1);

  // Campo Fecha
  const grupoFecha = document.createElement("div");
  grupoFecha.className = "input";
  const formGroup2 = document.createElement("div");
  formGroup2.className = "form__inputBox";
  const icon2 = document.createElement("i");
  icon2.className = "ri-calendar-line";
  const inputFecha = document.createElement("input");
  inputFecha.type = "text";
  inputFecha.className = "form__input";
  inputFecha.placeholder = "Fecha de vacunación";
  inputFecha.setAttribute("data-tipo", "fechaVacuna");
  inputFecha.value = initialData ? initialData.date : "";
  inputFecha.dataset.birthDate = birthDate;
  
  // Impedir escritura manual
  inputFecha.readOnly = true;
  inputFecha.addEventListener("keydown", e => e.preventDefault());
  inputFecha.addEventListener("paste", e => e.preventDefault());

  form.style.transition = "padding-bottom 0.3s ease";

  // Configurar AirDatepicker con límites
  const datepickerConfig = {
    locale: localeEs,
    buttons: ['today', 'clear'],
    autoClose: true,
    dateFormat: "yyyy-MM-dd",
    maxDate: new Date(),
    container: modal,
    onShow(isFinished) {
      if (!isFinished) {
        form.style.paddingBottom = "270px";
      }
    },
    onHide(isFinished) {
      if (!isFinished) {
        form.style.paddingBottom = "0px";
      }
    }
  };

  if (birthDate) {
    const parts = birthDate.split('-');
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    d.setDate(d.getDate() + 1); // un día después del nacimiento
    datepickerConfig.minDate = d;
  }

  formGroup2.append(icon2, inputFecha);
  grupoFecha.appendChild(formGroup2);

  form.append(grupoNombre, grupoFecha);
  content.appendChild(form);
  modal.appendChild(content);

  const pie = document.createElement("div");
  pie.className = "modal-edicion__pie";

  const btnCancelar = document.createElement("button");
  btnCancelar.type = "button";
  btnCancelar.className = "modal-edicion__btn modal-edicion__btn--secundario";
  btnCancelar.textContent = "Cancelar";

  const btnGuardar = document.createElement("button");
  btnGuardar.type = "button";
  btnGuardar.className = "modal-edicion__btn modal-edicion__btn--primario";
  btnGuardar.textContent = "Guardar";

  pie.append(btnCancelar, btnGuardar);
  modal.appendChild(pie);

  document.body.appendChild(modal);

  // Inicializar AirDatepicker después de anexar el modal al DOM
  new AirDatepicker(inputFecha, datepickerConfig);

  // Bind de validaciones de entrada automáticas del proyecto
  validacion.validadorAutomatico.init(form);

  const closeModal = () => {
    modal.close();
    modal.remove();
  };

  btnCancelar.addEventListener("click", closeModal);
  btnGuardar.addEventListener("click", async () => {
    const isValid = validacion.validadorAutomatico.validarTodo(form);
    if (!isValid) return;

    if (onSave) {
      const result = await onSave({
        name: inputNombre.value,
        date: inputFecha.value
      });
      if (result && result.success) {
        const msg = result.message;
        closeModal();
        if (msg) {
          await alerta.alertaOK(msg);
        }
      }
    }
  });



  modal.addEventListener("mousedown", (e) => {
    // Evita cerrar si el click comenzó dentro del calendario
    if (e.target.closest(".air-datepicker")) return;
    if (e.target === modal) {
      closeModal();
    }
  });

  modal.showModal();
};
