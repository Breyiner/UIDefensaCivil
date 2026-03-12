/**
 * Controlador: Revisión de Plan Familiar (RevisionPlanController.js)
 * Facilita las acciones críticas para un Supervisor al evaluar un Plan Familiar.
 * Gestiona botones asíncronos para Aprobar, Rechazar (Definitivo/Cambios) y Ver PDF.
 */
import * as alerta from "../../../../helpers/alertas";
import * as api from "../../../../helpers/api";

export default async () => {
  // Referencias al DOM para los paneles de acción (Botonera)
  const verPDF = document.getElementById("verPDF"); // Acción descargar constancia
  const aprobar = document.getElementById("aprobar"); // Botón Verde - Dar fe al documento
  const rechazarDefinitivo = document.getElementById("rechazarDefinitivo"); // Botón Rojo - Inviable
  const rechazarCambios = document.getElementById("rechazarCambios"); // Botón Naranja - Incompleto, corregir
  
  // Extrae el ID lógico inyectado en la HashURL (Ej: #/supervisor-planFamiliar/revision?id=45)
  const id = location.hash.split("=")[1];

  // Callback del botón 'Aprobar'
  aprobar.addEventListener("click", async () => {
    try {
      // Impacta directamente al ID de estado del Plan 7 (Probablemente "Aprobado")
      const data = await api.patch(`familyPlans/status/${id}`, {
        status_plan_id: 7,
      });
      // Condominio de respuesta
      if (data.success) {
        await alerta.alertaOK(data.message); // Banner verde Confirmación
        window.location.href = `#/supervisor-planFamiliar`; // Expulsa devuelta a la lista principal
      } else alerta.alertaWarning(data.message, data.errors);
    } catch (error) {
      // Previene caídas totales
      alerta.alertaError(error.errors);
    }
  });
  
  // Callback del botón de negación y cierre
  rechazarDefinitivo.addEventListener("click", async () => {
    try {
      // Estado 6 (Rechazo absoluto o sin posibilidad de appeal momentáneo)
      const data = await api.patch(`familyPlans/status/${id}`, {
        status_plan_id: 6,
      });
      // Branching
      if (data.success) {
        await alerta.alertaOK(data.message);
        window.location.href = `#/supervisor-planFamiliar`; // Retorno lista
      } else alerta.alertaWarning(data.message, data.errors);
    } catch (error) {
      alerta.alertaError(error.errors);
    }
  });
  
  // Callback del botón de Requiere Observaciones (Feedback workflow)
  rechazarCambios.addEventListener("click", async () => {
    // Delega el flujo visual y de API a un helper complejo en alertas.js que pide la razón del rechazo
    const cambios = await alerta.rechazarCambios(id);
    
    // Confirmación post-interacción con el popup de SweetAlert text
    if (cambios.isConfirmed) {
        window.location.href = `#/supervisor-planFamiliar`; // Volver
    }
  });

  // Enganche Visor pasivo
  verPDF.addEventListener("click", () => {
    // Abre el PDF en otra pestaña consumiendo un binario mediante helper subyacente dedicado PDF
    api.getPdf(`familyPlans/pdf/${id}`, `plan_${id}.pdf`);
  });
};
