/**
 * Controlador: Panel principal del Voluntario (homeController.js)
 * Maneja la pantalla inicial del rol Voluntario. Muestra un saludo
 * personalizado y provee botones de acceso rápido para la creación
 * de nuevos Planes Familiares o la consulta de planes existentes.
 */
import * as alerta from "../../../helpers/alertas";
import * as api from "../../../helpers/api"

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
      window.location.href = '#/voluntario-planFamiliar/crear'; // Redirige a la pantalla para crear un nuevo plan familiar
      // alerta.alertaSuscripcionPremium();
    }
    // Si toca el botón con el identificador 'verPlan'
    if (e.target.matches("#verPlan")) {
      window.location.href = '#/voluntario-verPlanFamiliar'; // Redirige a la pantalla para ver el listado de planes
    }

  });
}