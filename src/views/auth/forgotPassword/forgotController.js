/**
 * Controlador: Recuperar Contraseña (forgotController.js)
 * Gestiona la vista donde el usuario solicita restablecer su contraseña.
 * Valida el correo electrónico y previene múltiples envíos simultáneos.
 */
import * as alerta from "../../../helpers/alertas";
import * as api from "../../../helpers/api";
import * as validacion from "../../../helpers/validacionInputs";

// Exportación por defecto de la lógica de recuperación de contraseña
export default async () => {
  // Referencias al DOM (Atrapar nodos de la vista HTML)
  const form = document.querySelector(".form"); // Formulario principal
  const corrElectronico = document.getElementById("correoElectronico"); // Campo de recolección de correo
  const boton = document.querySelector(".form__boton"); // El botón disparador "Recuperar"
  
  // Flag global para evitar dobles clics o peticiones paralelas al servidor
  let procesoPeticion = false;

  // Iniciar la librería custom de validación pasiva sobre todos los input de este 'form'
  validacion.validadorAutomatico.init(form);

  // Escuchando el evento Submit principal (Apretando enter o clic en botón submit)
  form.addEventListener("submit", async (e) => {
    // Evita recargar completamente la página SPA
    e.preventDefault();

    // Invoca método global de validación devolviendo un Boolean global si todo fue llenado bien
    const booleanValidacion = validacion.validadorAutomatico.validarTodo(form);
    
    // Ruta corta si falto información vital o incorrecta
    if (!booleanValidacion)
    {
      window.procesoPeticion = false // Abre exclusa para re-intento
      boton.disabled = false; // Rehabilita botón
      return // Escapa de la función temprana
    }

    // Configura el cuerpo Payload de la petición JSON
    const datosUsuario = {
      email: corrElectronico.value,
    };

    // Imprime rastro debugueo en la consola temporal 
    console.log(datosUsuario);
    
    // Blindar boton e interbloquear el script frente al usuario ansioso
    boton.disabled = true;
    procesoPeticion = true;

    // TODO: Falta implementación desde Backend
    // Actualmente solo avisa que la ruta no existe (Dummy Warning)
    await alerta.alertaWarning(
      "Recuperar Contraseña",
      "Metodo no realizado en el backend",
    );

    // Devuelve control de interfaces finalizada la simulación del 'envió'
    boton.disabled = false;
    procesoPeticion = false;
  });

  // Delegación de eventos escuchador genérico Mouse Click sobre la ventana SPA
  window.addEventListener("click", async (e) => {
    // Si usuario hace clic en el enlace 'volver' y no está enclavado el sistema cargando:
    if (e.target.matches("#volver") && !procesoPeticion)
      window.location.href = "#/login"; // Lo dirige físicamente al módulo principal router
  });
};
