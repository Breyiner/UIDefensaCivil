import * as api from "../api";
import * as alerta from "../alertas";

export const crear = async (familyPlanId, actionTypeId, recargarContainer,idPlanAccion) => {

  const members = await api.get(`members/familyPlan/select/${familyPlanId}`);

  let options = `<option value="">Seleccione un miembro</option>`;
  members.forEach(member => {
    options += `<option value="${member.id}">${member.full_name}</option>`;
  });

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

  const funcionModal = async () => {
    const datos = {
      member_id: document.querySelector(".form__member").value,
      description: document.querySelector(".form__description").value,
      action_type_id: actionTypeId,
      action_plan_id: idPlanAccion
    };

    try {
      const data = await api.post("actionPlanActions", datos);

      if (data.success) {
        await alerta.alertaOK(data.message);
        await recargarContainer();
      } else {
        alerta.alertaWarning(data.message, data.errors);
      }

    } catch (error) {
      alerta.alertaError(error.errors);
    }
  };

  alerta.Crear(htmlModal, funcionModal);
};

export const verEditarEliminar = async (id, familyPlanId, recargarContainer) => {
  const datos = await api.get(`actionPlanActions/${id}`);

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

  const funcionModalEditar = async () => {

    const members = await api.get(`members/familyPlan/select/${familyPlanId}`);

    let options = "";
    members.forEach(member => {
      options += `
        <option value="${member.id}"
          ${member.id == datos.member_id ? "selected" : ""}>
          ${member.full_name}
        </option>
      `;
    });

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

    const guardar = async () => {

      const updateData = {
        member_id: document.querySelector(".form__member").value,
        description: document.querySelector(".form__description").value
      };

      try {
        const response = await api.patch(`actionPlanActions/${id}`, updateData);

        if (response.success) {
          await alerta.alertaOK(response.message);
          await recargarContainer();
        } else {
          alerta.alertaWarning(response.message, response.errors);
        }

      } catch (error) {
        alerta.alertaError(error.errors);
      }
    };

    alerta.Crear(htmlEditar, guardar);
  };

  const funcionModalEliminar = async () => {

    const confirmacion = await alerta.alertaQuest(
      "¿Seguro que deseas eliminar esta acción?"
    );

    if (!confirmacion.isConfirmed) return;

    const eliminado = await api.delet(`actionPlanActions/${id}`);

    if (eliminado.success) {
      await alerta.alertaOK(eliminado.message);
      await recargarContainer();
    }
  };

  alerta.Ver(htmlModal, true, true, funcionModalEditar, funcionModalEliminar);
};