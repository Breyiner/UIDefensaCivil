/**
 * Controlador: Inicio de Sesión (loginController.js)
 * Maneja la lógica de autenticación del usuario. Recopila credenciales,
 * realiza la petición POST al backend, almacena el token/datos en localStorage
 * y redirecciona SPA localmente según el Rol asignado (Admin, Supervisor, etc.).
 */
import * as alerta from "../../../helpers/alertas";
import * as api from "../../../helpers/api";
import * as validacion from "../../../helpers/validacionInputs";

// Exportación central de toda la función de vista Login
export default async () => {
  // Referencias al DOM estático o inyectado que compone la página login visual
  const form = document.querySelector(".form"); // Enclosure nativo
  const correo = document.getElementById("correo"); // Caja input email
  const contrasena = document.getElementById("contrasena"); // Caja input pass
  const botonLogin = document.getElementById("botonLogin"); // Actioner

  // if (!form) {
  //   console.error("loginController: formulario de login no encontrado");
  //   return;
  // }

  // if (!botonLogin) {
  //   console.warn("loginController: botón de login no encontrado");
  // }

  console.log(botonLogin)
  // Validadores y pre-flags para evitar la concurrencia de clicks (Race condition bug fix)
  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = false;
  }
  // Se baja incondicionalmente cada vez que la vista se dibuja de nuevio
  window.procesoPeticion = false;

  // Engancha listeners en las cajas de texto de este form particular previniendo malos envíos
  validacion.validadorAutomatico.init(form);

  // Listener para capturar el botón Login o la típica tecla Enter
  form.addEventListener("submit", async (e) => {
    // Evita comportamiento 'Form Action' cláisco relanzando web
    e.preventDefault();

    // Evaluar estado real del formulario mediante helper central visual y lógico
    const booleanValidacion = validacion.validadorAutomatico.validarTodo(form);
    if (!booleanValidacion) {
      // Escape temprano si el backend no apreciará el error front
      window.procesoPeticion = false;
      botonLogin.disabled = false;
      return; 
    }

    // JSON base del payload post rest para login (Contrato esperado: email, password)
    const datosUsuario = {
      email: correo.value,
      password: contrasena.value,
    };

    // Bloqueo total front end hasta aviso contrario api backend
    botonLogin.disabled = true;
    window.procesoPeticion = true;
    
    // Solicita Tokenización o aprobación a servicio
    const data = await api.post("login", datosUsuario);
    
    // Branch exitoso de promesa Fetch nativa
    if (data && data.success) {
      const atributos = data.data; // Extrae JSON profundo de la prop key "data" devuelta
      
      // Persiste atributos básicos de perfilamiento offline localmente para toda la persistencia app
      localStorage.setItem("full_name", atributos.full_name);
      localStorage.setItem("id", atributos.id);
      localStorage.setItem("permissions", atributos.permissions);
      localStorage.setItem("role_id", atributos.role_id);
      localStorage.setItem("sectional_id", atributos.sectional_id);
      localStorage.setItem("gender_id", atributos.gender);
      localStorage.setItem("access_token", atributos.token);
      localStorage.setItem("refresh_token", atributos.refresh_token);
      
      // Presenta mensaje de bienvenida / Éxito dictado por Api
      await alerta.alertaOK(data.message);
      
      // Enrutador cliente "Router" manual leyendo permisos o rol ID local
      if (atributos.role_id == 1) window.location.href = "#/administrador"; // Dashboard Administrador Supremo
      else if (atributos.role_id == 2)
        window.location.href = "#/supervisor"; // Dashboard Supervisor (Tercero)
      else if (atributos.role_id == 3)
        window.location.href = "#/voluntario"; // Dashboard Voluntario 
      else window.location.href = "#/login"; // Contingencia en caso raro
    
    } else {
      // Branch fallido (Ej: Credenciales incorrectas)
      await alerta.alertaError(data.message);
    }
    
    // Rehabilitación del sistema general
    botonLogin.disabled = false;
    window.procesoPeticion = false;
  });

  // Listener global delegado al scope Window para interacciones sobre links secundarios
  window.addEventListener("click", async (e) => {
    // Evento ir al registro (Boton inferior o hipervinculo)
    if (e.target.matches("#crearCuenta") && !window.procesoPeticion)
      window.location.href = "#/register";
  });
  
  window.addEventListener("click", async (e) => {
    // Evento ir al Olvide pass (Link en medio de la pantalla modal)
    if (e.target.matches("#recuperarContrasena") && !window.procesoPeticion)
      window.location.href = "#/forgotPassword";
  });
};
