import Swal from "sweetalert2";
import * as api from "./api.js";

// ==========================================
// ALERTAS BÁSICAS DE INFORMACIÓN
// ==========================================
// Las siguientes construcciones de alertaError, alertaOK y alertaWarning
// están siendo reemplazadas por la vista nativa: src/componentes/modales/modalGeneral.html

// Muestra un modal de Error clásico (Icono X rojo) con un solo botón de "Ok"
export const alertaError = (mensaje) => {
  return Swal.fire({
    icon: "error",
    title: "Error",
    text: mensaje,
    confirmButtonText: "Ok",
    customClass: {
      confirmButton: "botonCancelar", // Inyecta CSS personalizado naranja/rojo
    },
  });
};

// Muestra un modal de Éxito (Icono Check verde). Permite ser arrastrado por la pantalla.
export const alertaOK = (mensaje) => {
  return Swal.fire({
    title: mensaje,
    icon: "success",
    draggable: true, // Habilita el drag and drop del modal
    confirmButtonText: "Ok",
    customClass: {
      confirmButton: "botonOK", // CSS personalizado en verde/azul
      title: "modalTitulo",
    },
  });
};

// Muestra un modal de Advertencia o Precaución (Icono de Triángulo amarillo)
export const alertaWarning = (titulo, mensaje) => {
  return Swal.fire({
    icon: "warning",
    title: titulo,
    html: mensaje,
    confirmButtonText: "Ok",
    customClass: {
      confirmButton: "botonOK",
    },
  });
};

// ==========================================
// ALERTAS DE CONFIRMACIÓN O PREGUNTA
// ==========================================

// Modal interactivo de "¿Sí o No?". Devuelve una Promesa (Promise) que resuelve en un estado booleano
export const alertaQuest = (mensaje) => {
  return Swal.fire({
    title: mensaje,
    icon: "question",
    showCancelButton: true, // Activa el botón secundario "No"
    cancelButtonText: "No",
    confirmButtonText: "Si",
    customClass: {
      confirmButton: "botonOK",
      cancelButton: "botonCancelar",
    },
  });
};

// Mini-notificación (Toast) en la esquina superior derecha que desaparece sola tras 2 segundos
export const alertaMensaje = (mensaje) => {
  return Swal.fire({
    toast: true, // Convierte el modal grande en etiqueta flotante tipo Snackbar
    position: "top-end", // Posicionado arriba a la derecha
    icon: "error",
    title: mensaje,
    showConfirmButton: false, // Oculta botones
    timer: 2000, // Autodestrucción en milisegundos
    timerProgressBar: true, // Muestra barrita de tiempo decreciendo
    didOpen: (toast) => {
      // Pausa el contador al pasarle el mouse, lo reanuda al quitarlo
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
};

// Modal variante de pregunta que ofrece posponer la acción ("Más tarde" vs "Sí")
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

// ==========================================
// PANTALLAS DE CARGA (LOADING)
// ==========================================

// Lanza un Spinner animado infinito que bloquea la pantalla hasta ordenarle cierre
export const alertaLoading = () => {
  Swal.fire({
    title: "Cargando...",
    text: "Por favor espera",
    allowOutsideClick: false, // Evita que se cierre al clickear fuera (backdrop)
    didOpen: () => {
      Swal.showLoading(); // Inyecta la animación CSS de carga al modal
    },
  });
};

// Cierra forzosamente la última alerta activa en pantalla (se usa para matar el Loading anterior)
export const alertaLoadingCerrar = () => {
  Swal.close();
};

// ==========================================
// MODALES COMPLEJOS (FORMULARIOS Y HTML INYECTADO)
// ==========================================

// Abre un SweetAlert gigante donde inyecta todo un formulario o mini-vista HTML.
// Se usa mucho para ventanas modales de Creación de registros pequeños.
export const Crear = async (htmlModal, funcionModal, funcionAlAbrir) => {
  Swal.fire({
    html: htmlModal, // DOM Inyectado como String template
    confirmButtonText: "Guardar",
    confirmButtonColor: "#ff6600",
    showCloseButton: true, // Muestra botón (X) en la esquina
    focusConfirm: false,
    customClass: {
      confirmButton: "botonOK",
    },

    // Callback justo después de renderizar el HTML del modal en pantalla
    didOpen: () => {
      if (funcionAlAbrir) {
        funcionAlAbrir(); // Se usa para inicializar selects o eventos en el HTML recién inyectado
      }
    },

    // Callback que se ejecuta justo antes de validar si se cierra cuando dan click a "Guardar"
    preConfirm: async () => {
      return await funcionModal(); // Evalúa código de guardado validando si deja pasar o no
    },
  });
};

// Modal visor: Muestra información de un registro y provee botones de control (Editar / Eliminar)
export const Ver = (
  htmlModal,
  mostrarEditar,
  mostrarEliminar,
  funcionEditar,
  funcionEliminar,
  esSupervisor,
) => {
  Swal.fire({
    html: htmlModal,
    showCloseButton: true,
    focusConfirm: false,

    // BOTÓN EDITAR
    // Su visualización depende del booleano `mostrarEditar` enviado (Privilegios)
    showConfirmButton: mostrarEditar,
    confirmButtonText: "Editar",

    // BOTÓN ELIMINAR
    showCancelButton: mostrarEliminar && !esSupervisor,
    cancelButtonText: "Eliminar",

    customClass: {
      confirmButton: "botonEditar",
      cancelButton: "botonEliminar",
    },
    // Si pincha editar...
    preConfirm: () => {
      if (mostrarEditar && funcionEditar) {
        funcionEditar();
      }
      return false; // False evita que se cierre el modal automáticamente
    },
  }).then((result) => {
    // Si pincha eliminar (cancel en SweetAlert)...
    if (result.dismiss === Swal.DismissReason.cancel) {
      if (mostrarEliminar && funcionEliminar) {
        funcionEliminar();
      }
    }
  });
};

// Súper Modal visor: Permite además Mutar Estado (Activar/Desactivar) y Ver el Historial del objeto
export const VerEstado = (
  htmlModal,
  mostrarEditar,
  is_active,
  funcionEditar,
  funcionActivar,
  funcionDesactivar,
  nombre,
  id,
) => {
  // Condicionales ternarios que deciden qué texto y botón mostrar según si está activo actualmente
  const textoEstado = is_active == 1 ? "Desactivar" : "Activar";
  const claseBotonEstado = is_active == 1 ? "botonEliminar" : "botonActivar";

  Swal.fire({
    html: htmlModal,
    showCloseButton: true,
    focusConfirm: false,

    // EDITAR
    showConfirmButton: mostrarEditar,
    confirmButtonText: "Editar",

    // ACTIVAR / DESACTIVAR
    showCancelButton: true,
    cancelButtonText: textoEstado,

    // HISTORIAL
    showDenyButton: true, // Tercer botón de SweetAlert ("Deny" usado como historial acá)
    denyButtonText: "Historial",

    customClass: {
      confirmButton: "botonEditar",
      cancelButton: claseBotonEstado,
      denyButton: "botonHistorial",
    },

    // Click en Editar
    preConfirm: () => {
      if (mostrarEditar && funcionEditar) {
        funcionEditar();
      }
      return false; // Deja modal abierto
    },
  }).then((result) => {
    // Click en Ver Historial
    if (result.isDenied) {
      // Historial(nombre, id); // Llama a la función global debajo
      window.location.href = `#/administrador-datosMaestros/historial-seccional/id=${id}`;
    }

    // Click en el botón de cambiar Estado (Activar/Desactivar)
    if (result.dismiss === Swal.DismissReason.cancel) {
      if (is_active == 1) {
        // Si estaba prendido delega tarea al callback de apagado
        if (funcionDesactivar) funcionDesactivar();
      } else {
        // Viceversa
        if (funcionActivar) funcionActivar();
      }
    }
  });
};

export const verDepartCiudad = (htmlModal, funcionEditar, nombre, id) => {
  Swal.fire({
    html: htmlModal,
    showCloseButton: true,
    focusConfirm: false,

    confirmButtonText: "Editar",

    customClass: {
      confirmButton: "botonEditar",
    },

    // Click en Editar
    preConfirm: () => {
      funcionEditar();
    },
  });
};

// ==========================================
// MODALES FUNCIONALES ESPECÍFICOS DE LA LÍNEA DE NEGOCIO
// ==========================================

// Pide mediante la API el historial de auditoria de un registro ({tabla}/history/{id}) y lo formatea en una lista
export const Historial = async (nombre, id) => {
  const data = await api.get(`${nombre}/${id}/history`);

  const contenedor = document.createElement('div');
  contenedor.className = 'contenedorHistorial';

  data.forEach((item) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'itemHistorial';

    const crearParrafo = (label, valor) => {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = `${label}: `;
      p.appendChild(strong);
      p.appendChild(document.createTextNode(valor));
      return p;
    };

    itemDiv.appendChild(crearParrafo('Acción', item.action_execute));
    itemDiv.appendChild(crearParrafo('Usuario', item.user_name));
    itemDiv.appendChild(crearParrafo('Rol', item.rol));
    itemDiv.appendChild(crearParrafo('Fecha', item.date_time));

    if (item.status_old != item.status_new) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = 'Cambio de estado a: ';
      p.appendChild(strong);
      p.appendChild(document.createTextNode(item.status_new));
      itemDiv.appendChild(p);
    }

    itemDiv.appendChild(document.createElement('hr'));
    contenedor.appendChild(itemDiv);
  });

  Swal.fire({
    title: "Historial",
    html: contenedor,
    width: "700px",
    showCloseButton: true,
    showConfirmButton: false,
    customClass: {
      popup: "modalHistorial",
    },
  });
};

// Modal enfocado 100% en la gestión de Peticiones de Usuario: "Se inscribe alguien, ¿Se le aprueba el acceso o se le borra?"
export const VerAprobarEliminarUsuarios = (
  modal,
  recargarContainer,
  id,
  esAdmin,
  selectRol,
  funcionAlAbrir
) => {
  Swal.fire({
    didOpen: () => {
        Swal.getHtmlContainer().appendChild(modal);
        if (funcionAlAbrir) funcionAlAbrir();
    },
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
      cancelButton: "botonEliminar",
    },

    // 👉 PRECONFIRM (APROBAR)
    preConfirm: async () => {
      const rolSeleccionado = selectRol?.value ?? 2;

      const confirmacion = await Swal.fire({
        title: "¿Seguro que deseas aprobar?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, aprobar",
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "botonOK",
          cancelButton: "botonEliminar",
        },
      });

      // Si se arrepintió, bloquea ejecución
      if (!confirmacion.isConfirmed) return false;

      try {
        const response = await api.patch(`users/${id}/change-status`, {
          user_ids: [id],
          state_user_id: 1,
          async: false,
        });

        if (esAdmin) {
          await api.patch(`users/${id}/change-role`, {
            role: rolSeleccionado == 3 ? "Supervisor" : "Voluntario",
          });
        }

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
    },

  }).then(async (result) => {
    // 👉 SI PRESIONA ELIMINAR
    if (result.dismiss === Swal.DismissReason.cancel) {
      // Dispara validación destructiva
      const confirmacion = await Swal.fire({
        title: "¿Seguro que deseas borrar?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, borrar",
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "botonEliminar",
          cancelButton: "botonOK",
        },
      });

      if (!confirmacion.isConfirmed) return;

      // Borrado definitivo vía API
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

// Modal visor multifunción enfocado en los roles y administración de bloqueos (Suspensiones)
// de usuarios existentes que ya ingresaron a la plataforma.
export const VerCambiarEstadoRolUsuarios = (
  modal,
  recargarContainer,
  id,
  estado,
  rol,
  esAdmin,
) => {
  Swal.fire({
    didOpen: () => {
        Swal.getHtmlContainer().appendChild(modal);
    },
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
      cancelButton: estado == 1 ? "botonEliminar" : "botonOK", // Pinta en rojo si va a desactivar (suspender)
      denyButton: "botonHistorial",
    },

    // 👉 CONFIRMAR (CAMBIAR ROL)
    preConfirm: async () => {
      // Interfaz que pregunta si lo rebaja a voluntario o asciende a supervisor guiándose por el ID numérico
      const confirmacion = await Swal.fire({
        title: `¿Seguro que deseas cambiar el rol de usuario a ${rol == 3 ? "Supervisor" : "Voluntario"}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "botonOK",
          cancelButton: "botonEliminar",
        },
      });

      if (!confirmacion.isConfirmed) return false;

      // Lógica de Petición HTTP Patch atada
      try {
        const datos = {
          role: rol == 3 ? "Supervisor" : "Voluntario",
        };

        const response = await api.patch(`users/${id}/change-role`, datos);

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
    },
  }).then(async (result) => {
    // 👉 HISTORIAL
    if (result.isDenied) {
      Historial("users", id);
      return;
    }

    // 👉 ACTIVAR (REINCORPORACIÓN) / DESACTIVAR (SUSPENSIÓN)
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
        },
      });

      if (!confirmacion.isConfirmed) return;

      try {
        // Ejecución invirtiendo el id referencial (Si era 1[Activo] lo vuelve 2[Inactivo])
        const response = await api.patch(`users/${id}/change-status`, {
          user_ids: [Number(id)],
          state_user_id: estado == 1 ? 2 : 1,
          async: false,
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

// ==========================================
// MODALES LEGALES Y POLÍTICAS
// ==========================================

// Muestra las condiciones y términos obligatorias para el Plan Familiar (Ley 1581)
export const AutorizacionDatos = () => {
  const outerDiv = document.createElement('div');
  outerDiv.style.textAlign = 'left';
  outerDiv.style.fontSize = '13px';
  outerDiv.style.lineHeight = '1.6';

  const scrollDiv = document.createElement('div');
  scrollDiv.style.maxHeight = '220px';
  scrollDiv.style.overflowY = 'auto';
  scrollDiv.style.paddingRight = '8px';
  scrollDiv.style.border = '1px solid #eee';
  scrollDiv.style.borderRadius = '10px';
  scrollDiv.style.padding = '10px';
  scrollDiv.style.marginBottom = '15px';

  const parrafos = [
    'En cumplimiento de lo dispuesto en la Ley 1581 de 2012 y el Decreto 1377 de 2013, autorizo de manera libre, previa, expresa, voluntaria e informada el tratamiento de mis datos personales suministrados a través del presente formulario.',
    'Los datos serán utilizados con la finalidad de elaborar, gestionar y administrar el Plan Familiar de Emergencia, así como para realizar procesos de validación, seguimiento, control y mejora de los programas institucionales relacionados con la gestión del riesgo y la atención de emergencias.',
    'Entiendo que el tratamiento podrá incluir la recolección, almacenamiento, uso, circulación, actualización y supresión de la información, conforme a las políticas de protección de datos adoptadas por la entidad.',
    'Declaro que he sido informado acerca de mis derechos como titular de datos personales, entre ellos:',
  ];

  parrafos.forEach((texto) => {
    const p = document.createElement('p');
    p.textContent = texto;
    scrollDiv.appendChild(p);
  });

  const ul = document.createElement('ul');
  ul.style.paddingLeft = '18px';

  const derechos = [
    'Conocer, actualizar y rectificar mis datos personales.',
    'Solicitar prueba de la autorización otorgada.',
    'Ser informado sobre el uso que se ha dado a mis datos.',
    'Revocar la autorización y/o solicitar la supresión del dato cuando proceda.',
    'Acceder en forma gratuita a mis datos personales.',
  ];

  derechos.forEach((texto) => {
    const li = document.createElement('li');
    li.textContent = texto;
    ul.appendChild(li);
  });

  scrollDiv.appendChild(ul);

  const ultimoParrafo = document.createElement('p');
  ultimoParrafo.textContent = 'Esta autorización permanecerá vigente mientras exista una relación administrativa o legal con la entidad o hasta que el titular solicite su revocatoria en los términos establecidos por la ley.';
  scrollDiv.appendChild(ultimoParrafo);

  outerDiv.appendChild(scrollDiv);

  const checkboxDiv = document.createElement('div');
  checkboxDiv.style.display = 'flex';
  checkboxDiv.style.alignItems = 'center';
  checkboxDiv.style.gap = '8px';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'checkAutorizacion';

  const label = document.createElement('label');
  label.htmlFor = 'checkAutorizacion';
  label.style.cursor = 'pointer';
  label.textContent = 'Declaro que he leído y acepto la autorización';

  checkboxDiv.appendChild(checkbox);
  checkboxDiv.appendChild(label);
  outerDiv.appendChild(checkboxDiv);

  return Swal.fire({
    title: "Autorización para el Tratamiento de Datos Personales",
    html: outerDiv,
    icon: false,
    width: 600,
    showCancelButton: true,
    confirmButtonText: "Aceptar y continuar",
    cancelButtonText: "Cancelar",
    customClass: {
      confirmButton: "botonOK",
      cancelButton: "botonCancelar",
      title: "modalTitulo",
    },

    didOpen: () => {
      const confirmBtn = Swal.getConfirmButton();
      confirmBtn.disabled = true;

      checkbox.addEventListener("change", () => {
        confirmBtn.disabled = !checkbox.checked;
      });
    },
  });
};

// Modal Auxiliar para el módulo supervisor: Cuadro de texto para dictar rechazo
// obligando al interventor a dejar comentarios justificando (Mínimo 10 caracteres)
export const rechazarCambios = (id) => {
  const div = document.createElement('div');
  div.style.textAlign = 'left';

  const label = document.createElement('label');
  label.style.fontWeight = '600';
  label.textContent = 'Comentarios';
  div.appendChild(label);

  const textarea = document.createElement('textarea');
  textarea.placeholder = 'Escribe el motivo de la devolución (mínimo 10 caracteres)...';
  textarea.style.width = '100%';
  textarea.style.height = '150px';
  textarea.style.marginTop = '8px';
  textarea.style.padding = '10px';
  textarea.style.borderRadius = '10px';
  textarea.style.border = '1px solid #ddd';
  textarea.style.resize = 'none';
  textarea.style.overflowY = 'auto';
  textarea.style.fontSize = '14px';
  div.appendChild(textarea);

  const contador = document.createElement('small');
  contador.style.display = 'block';
  contador.style.marginTop = '6px';
  contador.style.color = '#888';
  contador.textContent = '0 / mínimo 10 caracteres';
  div.appendChild(contador);

  return Swal.fire({
    title: "rechazar con cambios",
    html: div,
    width: 600,
    showCancelButton: true,
    confirmButtonText: "Devolver",
    cancelButtonText: "Cancelar",
    customClass: {
      confirmButton: "botonEliminar",
      cancelButton: "botonOK",
      title: "modalTitulo",
    },

    didOpen: () => {
      const confirmBtn = Swal.getConfirmButton();
      confirmBtn.disabled = true;

      textarea.addEventListener("input", () => {
        const longitud = textarea.value.trim().length;
        contador.textContent = `${longitud} / mínimo 10 caracteres`;

        confirmBtn.disabled = longitud < 10;
      });
    },

    preConfirm: async () => {
      const comentarios = textarea.value.trim();

      if (comentarios.length < 10) {
        Swal.showValidationMessage(
          "El comentario debe tener mínimo 10 caracteres",
        );
        return;
      }

      try {
        const response = await api.patch(`familyPlans/${id}/change-status`, {
          status_plan_id: 5,
          comentary: comentarios,
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
    },
  });
};