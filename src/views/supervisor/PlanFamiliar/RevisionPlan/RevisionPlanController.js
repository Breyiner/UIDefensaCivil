import * as alerta from "../../../../helpers/alertas";
import * as api from "../../../../helpers/api";

export default async () => {
  const verPDF = document.getElementById("verPDF");
  const aprobar = document.getElementById("aprobar");
  const rechazarDefinitivo = document.getElementById("rechazarDefinitivo");
  const rechazarCambios = document.getElementById("rechazarCambios");
  const id = location.hash.split("=")[1];

  aprobar.addEventListener("click", async () => {
    try {
      const data = await api.patch(`familyPlans/status/${id}`, {
        status_plan_id: 7,
      });
      if (data.success) {
        await alerta.alertaOK(data.message);
        window.location.href = `#/supervisor-planFamiliar`;
      } else alerta.alertaWarning(data.message, data.errors);
    } catch (error) {
      alerta.alertaError(error.errors);
    }
  });
  rechazarDefinitivo.addEventListener("click", async () => {
    try {
      const data = await api.patch(`familyPlans/status/${id}`, {
        status_plan_id: 6,
      });
      if (data.success) {
        await alerta.alertaOK(data.message);
        window.location.href = `#/supervisor-planFamiliar`;
      } else alerta.alertaWarning(data.message, data.errors);
    } catch (error) {
      alerta.alertaError(error.errors);
    }
  });
  rechazarCambios.addEventListener("click", async () => {
    const cambios = await alerta.rechazarCambios(id);
    if (cambios.isConfirmed) {
        window.location.href = `#/supervisor-planFamiliar`;
    }
  });
  verPDF.addEventListener("click", () => {
    // Abre el PDF en otra pestaña
    api.getPdf(`familyPlans/pdf/${id}`, `plan_${id}.pdf`);
  });
};
