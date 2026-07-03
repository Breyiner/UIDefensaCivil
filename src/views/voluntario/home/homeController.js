/**
 * Controlador: Panel principal del Voluntario (homeController.js)
 * Maneja la pantalla inicial del rol Voluntario. Muestra un saludo
 * personalizado y provee botones de acceso rápido para la creación
 * de nuevos Planes Familiares o la consulta de planes existentes.
 */
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { alertas as alerta } from "@/helpers/index.js";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { api } from "@/helpers/index.js";

export default () => {
  const volunteerName = document.querySelector(".v-volunteer-name");
  const fullName = localStorage.getItem("full_name");

  if (volunteerName) {
    volunteerName.textContent = fullName || "Voluntario";
  }

  window.addEventListener("click", async (e) => {
    if (e.target.matches("#nuevoPlan") || e.target.closest("#nuevoPlan")) {
      window.location.href = '#/voluntario/plan_familiar/crear';
    }
    if (e.target.matches("#verPlan") || e.target.closest("#verPlan")) {
      window.location.href = '#/voluntario/plan_familiar';
    }
  });
}