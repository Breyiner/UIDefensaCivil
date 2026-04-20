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

  // Inicia la variable del desplegable HTML con opción nula
  let options = `<option value="">Seleccione un miembro</option>`;

  // Recorre el array agregando opciones interactivas con el nombre completo y id de validación
  members.forEach(member => {
    options += `<option value="${member.id}">${member.full_name}</option>`;
  });

  // Modal inyectado a la librería de alertas con los select y inputs necesarios
  const htmlModal = `
    <div class="explicacion modal">
      <p class="explicacion__titulo">Crear Acción</p>
    </div>

    <div class="form">
      <div class="form__inputBox modal-50">
        <i class="ri-user-line"></i>
        <select class="form__input form__member">
          ${options}
        </select>
      </div>

      <div class="form__inputBox">
        <i class="ri-file-text-line"></i>
        <input type="text"
               class="form__input form__description"
               placeholder="Descripción"
               autocomplete="off">
      </div>
    </div>
  `;

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
  alerta.Crear(htmlModal, funcionModal);
};

// Detalle completo y gestión de la acción registrada de un integrante (Editar/Eliminar)
export const verEditarEliminar = async (id, familyPlanId, recargarContainer, esSupervisor) => {
  // Pide al servidor detalles exactos de esa tarea "Acción" específica
  const datos = await api.get(`actionPlanActions/${id}`);

  // Estructura contenedora del listado grid view-only (Solo Ver) para ser renderizado por ver()
  const htmlModal = `
    <div class="modalVer modal">
      <div class="modalVer__dato">
        <i class="ri-user-line modalVer__icono"></i>
        <div class="modalVer__titulo">Miembro</div>
        <div class="modalVer__texto">${datos.member.names} ${datos.member.last_names}</div>
      </div>

      <div class="modalVer__dato modalVer__dato--largo">
        <i class="ri-file-text-line modalVer__icono"></i>
        <div class="modalVer__titulo">Descripción</div>
        <div class="modalVer__texto">${datos.description}</div>
      </div>
    </div>
  `;

  // Listener adjunto que levanta y sustituye el DOM "Solo Ver" para brindar el input de Edición si ocurre click en Editar
  const funcionModalEditar = async () => {

    // Extrae los miembros familiares de nuevo, a lo mejor el plan ha sido modificado y se removieron parientes
    const members = await api.get(`members/familyPlan/select/${familyPlanId}`);

    // Loop similar al crear, pero incrustando directrices de UI "selected" usando operador ternario IF corto
    let options = "";
    members.forEach(member => {
      options += `
        <option value="${member.id}"
          ${member.id == datos.member_id ? "selected" : ""}>
          ${member.full_name}
        </option>
      `;
    });

    // Nuevo código visual form (Modal interactivo)
    const htmlEditar = `
      <div class="explicacion modal">
        <p class="explicacion__titulo">Editar Acción</p>
      </div>

      <div class="form">
        <div class="form__inputBox">
          <i class="ri-user-line"></i>
          <select class="form__input form__member">
            ${options}
          </select>
        </div>

        <div class="form__inputBox modal-50">
          <i class="ri-file-text-line"></i>
          <input type="text"
                 class="form__input form__description"
                 value="${datos.description}">
        </div>
      </div>
    `;

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
    alerta.Crear(htmlEditar, guardar);
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
  alerta.Ver(htmlModal, true, true, funcionModalEditar, funcionModalEliminar, esSupervisor);
};