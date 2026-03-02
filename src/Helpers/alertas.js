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
    title: mensaje,
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

export const Crear = async (htmlModal, funcionModal, funcionAlAbrir) => {
  Swal.fire({
    html: htmlModal,
    confirmButtonText: 'Guardar',
    confirmButtonColor: '#ff6600',
    showCloseButton: true,
    focusConfirm: false,
    customClass: {
      confirmButton: 'botonOK'
    },

    didOpen: () => {
      if (funcionAlAbrir) {
        funcionAlAbrir();
      }
    },

    preConfirm: async () => {
      return await funcionModal();
    }
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
            <p><strong>Rol:</strong> ${item.rol}</p>
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

export const VerCambiarEstadoRolUsuarios = (
  htmlModal,
  recargarContainer,
  id,
  estado,
  rol,
  esAdmin
) => {

  Swal.fire({
    html: htmlModal,
    showCloseButton: true,
    focusConfirm: false,

    // 👉 CAMBIAR ROL
    showConfirmButton: esAdmin && estado == 1,
    confirmButtonText: "Cambiar Rol",

    // 👉 ACTIVAR / DESACTIVAR
    showCancelButton: true,
    cancelButtonText: estado == 1 ? "Desactivar" : "Activar",

    // 👉 HISTORIAL (BOTÓN CENTRAL)
    showDenyButton: true,
    denyButtonText: "Historial",

    customClass: {
      confirmButton: "botonOK",
      cancelButton: estado == 1 ? "botonEliminar" : "botonOK",
      denyButton: "botonHistorial"
    },

    // 👉 CONFIRMAR (CAMBIAR ROL)
    preConfirm: async () => {

      const confirmacion = await Swal.fire({
        title: `¿Seguro que deseas cambiar el rol de usuario a ${rol == 3 ? "Supervisor" : "Voluntario"}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: 'botonOK',
          cancelButton: 'botonEliminar',
        }
      });

      if (!confirmacion.isConfirmed) return false;

      try {

        const datos = {
          role: rol == 3 ? "Supervisor" : "Voluntario",
        };

        const response = await api.patch(`users/role/${id}`, datos);

        if (response.success) {
          await alertaOK(response.message);
          if (recargarContainer) await recargarContainer();
        } else {
          alertaWarning(response.message, response.errors);
        }

      } catch (error) {
        console.error(error);
        alertaError("Error al cambiar rol");
      }

      return true;
    }

  }).then(async (result) => {

    // 👉 HISTORIAL
    if (result.isDenied) {
      Historial("users", id);
      return;
    }

    // 👉 ACTIVAR / DESACTIVAR
    if (result.dismiss === Swal.DismissReason.cancel) {

      const confirmacion = await Swal.fire({
        title: `¿Seguro que deseas ${estado == 1 ? "desactivar" : "activar"} al usuario?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: estado == 1 ? "Sí, desactivar" : "Sí, activar",
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: estado == 1 ? "botonEliminar" : "botonOK",
          cancelButton: estado == 1 ? "botonOK" : "botonEliminar",
        }
      });

      if (!confirmacion.isConfirmed) return;

      try {

        const response = await api.patch(`users/status/${id}`, {
          state_user_id: estado == 1 ? 2 : 1,
        });

        if (response.success) {
          await alertaOK(response.message);
          if (recargarContainer) await recargarContainer();
        } else {
          alertaWarning(response.message, response.errors);
        }

      } catch (error) {
        console.error(error);
        alertaError("Error al cambiar estado");
      }
    }

  });
};

export const AutorizacionDatos = () => {
  return Swal.fire({
    title: "Autorización para el Tratamiento de Datos Personales",
    html: `
      <div style="text-align:left; font-size:13px; line-height:1.6;">

        <div style="
            max-height: 220px;
            overflow-y: auto;
            padding-right: 8px;
            border: 1px solid #eee;
            border-radius: 10px;
            padding: 10px;
            margin-bottom: 15px;
        ">

          <p>
            En cumplimiento de lo dispuesto en la Ley 1581 de 2012 y el Decreto 1377 de 2013,
            autorizo de manera libre, previa, expresa, voluntaria e informada el tratamiento
            de mis datos personales suministrados a través del presente formulario.
          </p>

          <p>
            Los datos serán utilizados con la finalidad de elaborar, gestionar y administrar
            el Plan Familiar de Emergencia, así como para realizar procesos de validación,
            seguimiento, control y mejora de los programas institucionales relacionados
            con la gestión del riesgo y la atención de emergencias.
          </p>

          <p>
            Entiendo que el tratamiento podrá incluir la recolección, almacenamiento,
            uso, circulación, actualización y supresión de la información, conforme
            a las políticas de protección de datos adoptadas por la entidad.
          </p>

          <p>
            Declaro que he sido informado acerca de mis derechos como titular de datos
            personales, entre ellos:
          </p>

          <ul style="padding-left:18px;">
            <li>Conocer, actualizar y rectificar mis datos personales.</li>
            <li>Solicitar prueba de la autorización otorgada.</li>
            <li>Ser informado sobre el uso que se ha dado a mis datos.</li>
            <li>Revocar la autorización y/o solicitar la supresión del dato cuando proceda.</li>
            <li>Acceder en forma gratuita a mis datos personales.</li>
          </ul>

          <p>
            Esta autorización permanecerá vigente mientras exista una relación
            administrativa o legal con la entidad o hasta que el titular
            solicite su revocatoria en los términos establecidos por la ley.
          </p>

        </div>

        <div style="display:flex; align-items:center; gap:8px;">
          <input type="checkbox" id="checkAutorizacion">
          <label for="checkAutorizacion" style="cursor:pointer;">
            Declaro que he leído y acepto la autorización
          </label>
        </div>

      </div>
    `,
    icon: false,
    width: 600,
    showCancelButton: true,
    confirmButtonText: "Aceptar y continuar",
    cancelButtonText: "Cancelar",
    customClass: {
      confirmButton: "botonOK",
      cancelButton: "botonCancelar",
      title: "modalTitulo"
    },

    didOpen: () => {
      const confirmBtn = Swal.getConfirmButton();
      confirmBtn.disabled = true;

      const checkbox = document.getElementById("checkAutorizacion");

      checkbox.addEventListener("change", () => {
        confirmBtn.disabled = !checkbox.checked;
      });
    }
  })
};

export const rechazarCambios = (id) => {
  return Swal.fire({
    title: "rechazar con cambios",
    html: `
      <div style="text-align:left;">
        <label style="font-weight:600;">Comentarios</label>
        <textarea 
          id="comentariosDevolver" 
          placeholder="Escribe el motivo de la devolución (mínimo 10 caracteres)..."
          style="
            width:100%;
            height:150px;
            margin-top:8px;
            padding:10px;
            border-radius:10px;
            border:1px solid #ddd;
            resize:none;
            overflow-y:auto;
            font-size:14px;
          "
        ></textarea>
        <small id="contadorTexto" style="display:block;margin-top:6px;color:#888;">
          0 / mínimo 10 caracteres
        </small>
      </div>
    `,
    width: 600,
    showCancelButton: true,
    confirmButtonText: "Devolver",
    cancelButtonText: "Cancelar",
    customClass: {
      confirmButton: "botonEliminar",
      cancelButton: "botonOK",
      title: "modalTitulo"
    },

    didOpen: () => {
      const textarea = document.getElementById("comentariosDevolver");
      const confirmBtn = Swal.getConfirmButton();
      const contador = document.getElementById("contadorTexto");

      confirmBtn.disabled = true;

      textarea.addEventListener("input", () => {
        const longitud = textarea.value.trim().length;
        contador.textContent = `${longitud} / mínimo 10 caracteres`;

        confirmBtn.disabled = longitud < 10;
      });
    },

    preConfirm: async () => {

      const comentarios = document.getElementById("comentariosDevolver").value.trim();

      if (comentarios.length < 10) {
        Swal.showValidationMessage("El comentario debe tener mínimo 10 caracteres");
        return;
      }

      try {

        const response = await api.patch(`familyPlans/status/${id}`, {
          status_plan_id: 5,
          comentary: comentarios
        });

        if (response.success) {
          await alertaOK(response.message);
        } else {
          alertaWarning(response.message, response.errors);
        }

      } catch (error) {
        console.error(error);
        alertaError("Error al devolver");
      }

      return; 
    }
  });

};