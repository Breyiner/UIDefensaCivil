/**
 * Helper de Modales: Acciones del Plan (planAccion.js)
 * Modales de apoyo que nutren la matrix del "Plan de Acción" a nivel familiar.
 * Provee formularios SweetAlert para asignar o retirar micro-tareas ("Acciones") a miembros específicos.
 */
import * as api from "../api";
import * as alerta from "../alertas";

// Crea una nueva acción o tarea dentro de un plan familiar de acción
export const crear = async (familyPlanId, actionTypeId, recargarContainer, idPlanAccion) => {

  // Descarga los miembros de la familia que pertenecen al plan para el listado desplegable
  const members = await api.get(`members/familyPlan/select/${familyPlanId}`);

  const explicacionDiv = document.createElement("div");
  explicacionDiv.classList.add("modal-edicion__cabecera");

  const tituloP = document.createElement("p");
  tituloP.classList.add("modal-edicion__titulo");
  tituloP.textContent = "Crear Acción";
  explicacionDiv.appendChild(tituloP);

  const formDiv = document.createElement("div");
  formDiv.classList.add("form");

  const memberBoxDiv = document.createElement("div");
  memberBoxDiv.classList.add("form__inputBox", "modal-50");

  const userIcon = document.createElement("i");
  userIcon.classList.add("ri-user-line");

  const memberSelect = document.createElement("select");
  memberSelect.classList.add("form__input", "form__member");

  const defaultOpt = document.createElement("option");
  defaultOpt.value = "";
  defaultOpt.textContent = "Seleccione un miembro";
  memberSelect.appendChild(defaultOpt);

  members.forEach(member => {
    const opt = document.createElement("option");
    opt.value = member.id;
    opt.textContent = member.full_name;
    memberSelect.appendChild(opt);
  });

  memberBoxDiv.append(userIcon, memberSelect);
  formDiv.appendChild(memberBoxDiv);

  const descBoxDiv = document.createElement("div");
  descBoxDiv.classList.add("form__inputBox");

  const fileIcon = document.createElement("i");
  fileIcon.classList.add("ri-file-text-line");

  const descInput = document.createElement("input");
  descInput.type = "text";
  descInput.classList.add("form__input", "form__description");
  descInput.placeholder = "Descripción";
  descInput.autocomplete = "off";

  descBoxDiv.append(fileIcon, descInput);
  formDiv.appendChild(descBoxDiv);

  const container = document.createElement("div");
  container.append(explicacionDiv, formDiv);

  // Callback para cuando se intente guardar el modal SweetAlert
  const funcionModal = async () => {
    // Almacena en crudo el valor de selección de ID miembro de la familia, descripción insertada y demás ids de referencia
    const datos = {
      member_id: document.querySelector(".form__member").value,
      description: document.querySelector(".form__description").value,
      action_type_id: actionTypeId,
      action_plan_id: idPlanAccion
    };

    try {
      // Envía vía POST (nuevo elemento) al backend las variables capturadas de la ventana popup
      const data = await api.post("actionPlanActions", datos);

      // Interpreta la respuesta JSON
      if (data.success) {
        // Alerta OK con recarga condicional y escape natural
        await alerta.alertaOK(data.message);
        await recargarContainer();
      } else {
        // Enseña errores detectados por los validadores intermedios
        alerta.alertaWarning(data.message, data.errors);
      }

    } catch (error) {
      // Excepciones no mapeadas de red
      alerta.alertaError(error.errors);
    }
  };

  // Abre el modal visual vacío pasándole el listener asíncrono confirmador 
  alerta.Crear(container, funcionModal);
};

// Detalle completo y gestión de la acción registrada de un integrante (Editar/Eliminar)
export const verEditarEliminar = async (id, familyPlanId, recargarContainer, esSupervisor) => {
  // Pide al servidor detalles exactos de esa tarea "Acción" específica
  const datos = await api.get(`actionPlanActions/${id}`);

  const modalDiv = document.createElement("div");
  modalDiv.classList.add("modalVer", "modal");

  const miembroDatoDiv = document.createElement("div");
  miembroDatoDiv.classList.add("modalVer__dato");

  const miembroIcon = document.createElement("i");
  miembroIcon.classList.add("ri-user-line", "modalVer__icono");

  const miembroTitulo = document.createElement("div");
  miembroTitulo.classList.add("modalVer__titulo");
  miembroTitulo.textContent = "Miembro";

  const miembroTexto = document.createElement("div");
  miembroTexto.classList.add("modalVer__texto");
  miembroTexto.textContent = `${datos.member.names} ${datos.member.last_names}`;

  miembroDatoDiv.append(miembroIcon, miembroTitulo, miembroTexto);
  modalDiv.appendChild(miembroDatoDiv);

  const descDatoDiv = document.createElement("div");
  descDatoDiv.classList.add("modalVer__dato", "modalVer__dato--largo");

  const descIcon = document.createElement("i");
  descIcon.classList.add("ri-file-text-line", "modalVer__icono");

  const descTitulo = document.createElement("div");
  descTitulo.classList.add("modalVer__titulo");
  descTitulo.textContent = "Descripción";

  const descTexto = document.createElement("div");
  descTexto.classList.add("modalVer__texto");
  descTexto.textContent = datos.description;

  descDatoDiv.append(descIcon, descTitulo, descTexto);
  modalDiv.appendChild(descDatoDiv);

  // Listener adjunto que levanta y sustituye el DOM "Solo Ver" para brindar el input de Edición si ocurre click en Editar
  const funcionModalEditar = async () => {

    // Extrae los miembros familiares de nuevo, a lo mejor el plan ha sido modificado y se removieron parientes
    const members = await api.get(`members/familyPlan/select/${familyPlanId}`);

    const editExplicacionDiv = document.createElement("div");
    editExplicacionDiv.classList.add("explicacion", "modal");

    const editTituloP = document.createElement("p");
    editTituloP.classList.add("explicacion__titulo");
    editTituloP.textContent = "Editar Acción";
    editExplicacionDiv.appendChild(editTituloP);

    const editFormDiv = document.createElement("div");
    editFormDiv.classList.add("form");

    const editMemberBoxDiv = document.createElement("div");
    editMemberBoxDiv.classList.add("form__inputBox");

    const editUserIcon = document.createElement("i");
    editUserIcon.classList.add("ri-user-line");

    const editMemberSelect = document.createElement("select");
    editMemberSelect.classList.add("form__input", "form__member");

    members.forEach(member => {
      const opt = document.createElement("option");
      opt.value = member.id;
      opt.textContent = member.full_name;
      if (member.id == datos.member_id) {
        opt.selected = true;
      }
      editMemberSelect.appendChild(opt);
    });

    editMemberBoxDiv.append(editUserIcon, editMemberSelect);
    editFormDiv.appendChild(editMemberBoxDiv);

    const editDescBoxDiv = document.createElement("div");
    editDescBoxDiv.classList.add("form__inputBox", "modal-50");

    const editFileIcon = document.createElement("i");
    editFileIcon.classList.add("ri-file-text-line");

    const editDescInput = document.createElement("input");
    editDescInput.type = "text";
    editDescInput.classList.add("form__input", "form__description");
    editDescInput.value = datos.description;

    editDescBoxDiv.append(editFileIcon, editDescInput);
    editFormDiv.appendChild(editDescBoxDiv);

    const editContainer = document.createElement("div");
    editContainer.append(editExplicacionDiv, editFormDiv);

    // Confirma guardado y modificaciones enviando a la API
    const guardar = async () => {

      // Extrae la mutación de los selects text del template recién procesado HTML en pantalla
      const updateData = {
        member_id: document.querySelector(".form__member").value,
        description: document.querySelector(".form__description").value
      };

      try {
        // Enlaza la API en verbo PATCH para parchear recursos de un ID puntual (Actualizar solo lo descrito)
        const response = await api.patch(`actionPlanActions/${id}`, updateData);

        if (response.success) {
          await alerta.alertaOK(response.message);
          // Refresca listado padre desde la página Main
          await recargarContainer();
        } else {
          alerta.alertaWarning(response.message, response.errors);
        }

      } catch (error) {
        alerta.alertaError(error.errors);
      }
    };

    // Abre modal form para sobreescribir la tarea actual
    alerta.Crear(editContainer, guardar);
  };

  // Función atada al botón Trash/Eliminar del SweetAlert general (Ver modal)
  const funcionModalEliminar = async () => {

    // Mini modal de confirmación antes de la ejecución permanente a nube
    const confirmacion = await alerta.alertaQuest(
      "¿Seguro que deseas eliminar esta acción?"
    );

    // Cortocircuito que detiene la ruta si presiona 'Cancel'
    if (!confirmacion.isConfirmed) return;

    // Ejecuta "DELETE" nativo sobre el identificador proporcionado a backend
    const eliminado = await api.delet(`actionPlanActions/${id}`);

    if (eliminado.success) {
      await alerta.alertaOK(eliminado.message);
      await recargarContainer();
    }
  };

  // Levanta sweetalert "ModalVer" nativo permitiendo las operaciones de editar true/eliminar true inyectadas en los parámetros
  alerta.Ver(modalDiv, true, true, funcionModalEditar, funcionModalEliminar, esSupervisor);
};