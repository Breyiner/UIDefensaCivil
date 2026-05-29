/**
 * Controlador: Recuperar Contraseña (forgotController.js)
 * Gestiona la vista donde el usuario solicita restablecer su contraseña.
 * Valida el correo electrónico y previene múltiples envíos simultáneos.
 */
// import { forgotPasswordController } from "..";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { alertas as alerta } from "@/helpers/index.js";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { api } from "@/helpers/index.js";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { validacionInputs as validacion } from "@/helpers/index.js";

// Exportación por defecto de la lógica de recuperación de contraseña
const forgotPasswordController = () => {
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
    
    // Blindar boton e interbloquear el script frente al usuario ansioso
    // boton.disabled = true;
    procesoPeticion = true;

    // await alerta.alertaWarning(
    //   "Recuperar Contraseña",
    //   "Metodo no realizado en el backend",
    // );

    try {

      const respuesta = await api.post("password/forgot", datosUsuario);

      // GUARDAMOS EL EMAIL EN EL CACHÉ DEL NAVEGADOR PARA LOS SIGUIENTES CONTROLADORES
      sessionStorage.setItem("reset_email", datosUsuario.email);

      if (!respuesta.success) {

        await alerta.alertaError("Hubo un problema al procesar el envío del código.");

        return;
      }
      await alerta.alertaOK("Si el correo electrónico coincide con una cuenta activa, recibirás un código de 6 dígitos.")

      window.location.href = "#/verificar_codigo";
      
    } catch (error) {
      console.error(error);
      await alerta.alertaError("No se pudo procesar la solicitud en este momento.");
      
      // Desbloquear solo en caso de error para permitir reintento
      boton.disabled = false;
      procesoPeticion = false;
    }

  });

  // Delegación de eventos escuchador genérico Mouse Click sobre la ventana SPA
  window.addEventListener("click", async (e) => {
    // Si usuario hace clic en el enlace 'volver' y no está enclavado el sistema cargando:
    if (e.target.matches("#volver") && !procesoPeticion)
      window.location.href = "#/login"; // Lo dirige físicamente al módulo principal router
  });
};

export default forgotPasswordController;