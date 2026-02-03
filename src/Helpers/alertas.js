import Swal from "sweetalert2";

export const alertaError = (mensaje) => {
  return Swal.fire({
    icon: "error",
    title: "Error",
    text: mensaje,
    confirmButtonText: "Ok",
    customClass: {
      confirmButton: "botonCancelar",
    },
  });
};

export const alertaOK = (mensaje) => {
  return Swal.fire({
    title: mensaje,
    icon: "success",
    draggable: true,
    confirmButtonText: "Ok",
    customClass: {
      confirmButton: "botonOK",
    },
  });
};

export const alertaWarning = (titulo, mensaje) => {
  return Swal.fire({
    icon: "warning",
    title: titulo,
    text: mensaje,
    confirmButtonText: "Ok",
    customClass: {
      confirmButton: "botonOK",
    },
  });
};
export const alertaQuest = (mensaje) => {
  return Swal.fire({
    title: "¿Estas seguro?",
    text: mensaje,
    icon: "question",
    showCancelButton: true,
    cancelButtonText: "No",
    confirmButtonText: "Si",
    customClass: {
      confirmButton: "botonOK",
      cancelButton: "botonCancelar",
    },
  });
};

export const alertaMensaje = (mensaje) => {
  return Swal.fire({
    toast: true,
    position: "top-end",
    icon: "error",
    title: mensaje,
    showConfirmButton: false,
    timer: 2000, 
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
};

export const alertaPreguntarMasTarde = (mensaje) => {
  return Swal.fire({
    title: "¿Estas seguro?",
    text: mensaje,
    icon: "question",
    showCancelButton: true,
    cancelButtonText: "Mas tarde",
    confirmButtonText: "Si",
    customClass: {
      confirmButton: "botonOK",
      cancelButton: "botonCancelar",
    },
  });
};

export const alertaLoading = () => {
  Swal.fire({
    title: 'Cargando...',
    text: 'Por favor espera',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
   }
  });
};
export const alertaLoadingCerrar = () => {
  Swal.close();
}