import Swal from "sweetalert2";
import * as api from "./api.js";
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
      title: "modalTitulo",
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
export const Crear = async (htmlModal,funcionModal) => {
    Swal.fire({
        html: htmlModal,
        confirmButtonText: 'Guardar',
        confirmButtonColor: '#ff6600', // El naranja de tu botón "Guardar"
        showCloseButton: true,
        focusConfirm: false,
        customClass: {
            confirmButton: 'botonOK'
        },
        preConfirm: async () => {funcionModal()}
    });
};

export const Ver = (htmlModal,mostrarEditar,mostrarEliminar,funcionEditar,funcionEliminar) => {
    Swal.fire({
        html: htmlModal,
        showCloseButton: true,
        focusConfirm: false,

        // BOTÓN EDITAR
        showConfirmButton: mostrarEditar,
        confirmButtonText: 'Editar',

        // BOTÓN ELIMINAR
        showCancelButton: mostrarEliminar,
        cancelButtonText: 'Eliminar',

        customClass: {
            confirmButton: 'botonEditar',
            cancelButton: 'botonEliminar'
        },
        preConfirm: () => {
            if (mostrarEditar && funcionEditar) {
                funcionEditar()
            }
            return false;
        }
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
            if (mostrarEliminar && funcionEliminar) {
                funcionEliminar()
            }
        }
    });
};

export const VerEstado = (
    htmlModal,
    mostrarEditar,
    is_active,
    funcionEditar,
    funcionActivar,
    funcionDesactivar,
    nombre,
    id
) => {

    const textoEstado = is_active == 1 ? "Desactivar" : "Activar";
    const claseBotonEstado = is_active == 1 ? "botonEliminar" : "botonActivar";

    Swal.fire({
        html: htmlModal,
        showCloseButton: true,
        focusConfirm: false,

        // EDITAR
        showConfirmButton: mostrarEditar,
        confirmButtonText: 'Editar',

        // ACTIVAR / DESACTIVAR
        showCancelButton: true,
        cancelButtonText: textoEstado,

        // HISTORIAL
        showDenyButton: true,
        denyButtonText: 'Historial',

        customClass: {
            confirmButton: 'botonEditar',
            cancelButton: claseBotonEstado,
            denyButton: 'botonHistorial'
        },

        preConfirm: () => {
            if (mostrarEditar && funcionEditar) {
                funcionEditar();
            }
            return false;
        }

    }).then((result) => {

        if (result.isDenied) {
            Historial(nombre, id);
        }

        if (result.dismiss === Swal.DismissReason.cancel) {

            if (is_active == 1) {
                if (funcionDesactivar) funcionDesactivar();
            } else {
                if (funcionActivar) funcionActivar();
            }

        }

    });
};

export const Historial = async (nombre, id) => {
    const data = await api.get(`${nombre}/history/${id}`);
    
    let contenido = `
      <div class="contenedorHistorial">
        ${data.map(item => `
          <div class="itemHistorial">
            <p><strong>Acción:</strong> ${item.action_execute}</p>
            <p><strong>Usuario:</strong> ${item.user_name}</p>
            <p><strong>Fecha:</strong> ${item.date_time}</p>
            ${item.status_old != item.status_new ? '<p><strong>Cambio de estado a:</strong> '+item.status_new+'</p>' : ""}
            <hr>
          </div>
        `).join('')}
      </div>
    `;

    Swal.fire({
      title: 'Historial',
      html: contenido,
      width: '700px',
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        popup: 'modalHistorial'
      }
    });
};

export const VerAprobarEliminarUsuarios = (
  htmlModal,
  recargarContainer,id
) => {

  Swal.fire({
    html: htmlModal,
    showCloseButton: true,
    focusConfirm: false,

    // BOTÓN APROBAR
    showConfirmButton: true,
    confirmButtonText: "Aprobar",

    // BOTÓN ELIMINAR
    showCancelButton: true,
    cancelButtonText: "Borrar",

    customClass: {
      confirmButton: "botonOK",
      cancelButton: "botonEliminar"
    },

    // 👉 PRECONFIRM (APROBAR)
    preConfirm: async () => {
      const confirmacion = await Swal.fire({
        title: "¿Seguro que deseas aprobar?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, aprobar",
        cancelButtonText: "Cancelar",
        customClass: {
            confirmButton: 'botonOK',
            cancelButton: 'botonEliminar',
        }
      });

      if (!confirmacion.isConfirmed) return false;

      try {
        const response = await api.patch(`users/status/${id}`,{ state_user_id: 1});

        if (response.success) {
          await alertaOK(response.message);
          if (recargarContainer) await recargarContainer();
        } else {
          alertaWarning(response.message, response.errors);
        }

      } catch (error) {
        console.error(error);
        alertaError("Error al aprobar");
      }

      return true;
    }

  }).then(async (result) => {

    // 👉 SI PRESIONA ELIMINAR
    if (result.dismiss === Swal.DismissReason.cancel) {

      const confirmacion = await Swal.fire({
        title: "¿Seguro que deseas borrar?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, borrar",
        cancelButtonText: "Cancelar",
        customClass: {
            confirmButton: 'botonEliminar',
            cancelButton: 'botonOK',
        }
      });

      if (!confirmacion.isConfirmed) return;

      try {
        const response = await api.delet(`users/${id}`);

        if (response.success) {
          await alertaOK(response.message);
          if (recargarContainer) await recargarContainer();
        } else {
          alertaWarning(response.message, response.errors);
        }

      } catch (error) {
        console.error(error);
        alertaError("Error al borrar");
      }
    }
  });
};
