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
      autoClose: true
    };

    // SOLO FECHAS PASADAS
    if (tipo === "fechaAntes") {
      config.dateFormat = "yyyy-MM-dd";
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