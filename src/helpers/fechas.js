import AirDatepicker from "air-datepicker";
import localeEs from "air-datepicker/locale/es";
import "air-datepicker/air-datepicker.css";

export const initFechas = () => {

  document.querySelectorAll("[data-fecha]").forEach(input => {

    const tipo = input.dataset.fecha;

    // impedir escritura manual
    input.readOnly = true;
    input.addEventListener("keydown", e => e.preventDefault());
    input.addEventListener("paste", e => e.preventDefault());

    // configuración base
    const config = {
      locale: localeEs,
      buttons: ['today', 'clear'],
      autoClose: true,
      onSelect({date}) {
        if (date) {
          const yyyy = date.getFullYear();
          const mm = String(date.getMonth() + 1).padStart(2, '0');
          const dd = String(date.getDate()).padStart(2, '0');
          input.dataset.isoDate = `${yyyy}-${mm}-${dd}`;
        } else {
          input.dataset.isoDate = "";
        }
      }
    };

    // SOLO FECHAS PASADAS
    if (tipo === "fechaAntes") {
      config.dateFormat = "dd/MM/yy";
      config.maxDate = new Date();
    }

    // SOLO FECHAS FUTURAS
    if (tipo === "fechaDespues") {
      config.dateFormat = "yyyy-MM-dd";
      config.minDate = new Date();
    }

    // SOLO MES Y AÑO
    if (tipo === "fechaMes") {
      config.view = "months";
      config.minView = "months";
      config.dateFormat = "yyyy-MM";
      config.maxDate = new Date();
    }

    new AirDatepicker(input, config);

  });

};

/**
 * Formatea una fecha del formato YYYY-MM-DD al formato visual DD/MM/YY.
 * 
 * @param {string} dateStr - Fecha en formato YYYY-MM-DD (ej: "2026-07-16")
 * @returns {string} Fecha formateada (ej: "16/07/26")
 */
export const formatearFecha = (dateStr) => {
  if (!dateStr) return "";
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0].substring(2)}`;
};

/**
 * Inicializa un AirDatepicker para inputs dentro de modales con clases dinámicas desplegadas
 * 
 * @param {HTMLInputElement} input - Elemento input a asociar con el selector de fecha
 * @param {Object} options - Opciones de configuración
 * @param {HTMLElement} options.modal - Elemento modal contenedor del datepicker
 * @param {HTMLElement} options.formModal - Elemento formulario del modal para clases desplegadas
 * @param {Date} [options.minDate=null] - Fecha mínima seleccionable
 * @param {Date} [options.maxDate=null] - Fecha máxima seleccionable
 * @returns {AirDatepicker} Instancia del datepicker creado
 */
export const initModalDatepicker = (input, { modal, formModal, minDate = null, maxDate = null } = {}) => {
  const config = {
    locale: localeEs,
    buttons: ['today', 'clear'],
    autoClose: true,
    dateFormat: "yyyy-MM-dd",
    container: modal,
    onShow(isFinished) {
      if (!isFinished && formModal) formModal.classList.add("modal-edicion__formulario--desplegado");
    },
    onHide(isFinished) {
      if (!isFinished && formModal) formModal.classList.remove("modal-edicion__formulario--desplegado");
    }
  };

  if (minDate) config.minDate = minDate;
  if (maxDate) config.maxDate = maxDate;

  return new AirDatepicker(input, config);
};
