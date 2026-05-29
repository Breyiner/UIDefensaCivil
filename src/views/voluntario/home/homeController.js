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
  // Selecciona el elemento de texto en la pantalla donde se escribirá la bienvenida
  const explicaciontitulo = document.querySelector(".explicacion__titulo");
  
  // Rescata el nombre y género guardados en el almacenamiento del navegador durante el inicio de sesión
  const nombre = localStorage.getItem("full_name");
  const genero = localStorage.getItem("gender_id");

  // Inclusión básica de género (1 = Masculino, otro = Femenino/Otro) para la letra final del saludo
  if (genero == 1) {
    explicaciontitulo.innerHTML += "o " + nombre; // Ejemplo: "Bienvenido Juan"
  } else {
    explicaciontitulo.innerHTML += "a " + nombre; // Ejemplo: "Bienvenida Maria"
  }

  // Escucha los clics en toda la ventana para detectar si tocan algún botón del panel
  window.addEventListener("click", async (e) => {
    // Si toca el botón con el identificador 'nuevoPlan'
    if (e.target.matches("#nuevoPlan")) {
      window.location.href = '#/voluntario/plan_familiar/crear'; // Redirige a la pantalla para crear un nuevo plan familiar
      // alerta.alertaSuscripcionPremium();
    }
    // Si toca el botón con el identificador 'verPlan'
    if (e.target.matches("#verPlan")) {
      window.location.href = '#/voluntario/plan_familiar'; // Redirige a la pantalla para ver el listado de planes
    }

  });
}