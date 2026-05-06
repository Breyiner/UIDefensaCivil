/**
 * Controlador: Iniciar Creación de Plan Familiar (crearController.js)
 * Primer paso real del Voluntario. Define la información básica (Apellidos de la Familia)
 * y asigna la ubicación inicial de su residencia.
 * Si esto falla o no sirve, nada de los siguientes módulos existirá.
 */
import * as adjuntarOpc from "../../../../helpers/adjuntarOpciones";
import * as alerta from "../../../../helpers/alertas";
import * as api from "../../../../helpers/api";
import * as validacion from "../../../../helpers/validacionInputs";

export default async () => {
  // Elementos principales de la pantalla
  const botonBack = document.getElementById("botonBack");
  const form = document.querySelector(".form"); // Contenedor que agrupa todo el formulario

  // Cuadros e interactuables que el usuario llenará
  const apellidos = document.getElementById("apellidos");
  const zona = document.getElementById("zonas");
  const apartamento = document.getElementById("departamentos");
  const ciudad = document.getElementById("ciudades");
  
  // Botones para navegar hacia adelante en este proceso
  const botonSiguiente = document.getElementById("boton_siguiente");

  // Bloqueo de seguridad inicial para evitar que el usuario toque cosas antes de tiempo
  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = true;
  }
  window.procesoPeticion = true;

  // Acción del Botón Volver con alerta de prevención ("¿Seguro que deseas salir?")
  botonBack.onclick = async () => {
    if (window.procesoPeticion) return;
    const confirmacion = await alerta.alertaQuest("¿Seguro que quieres volver?, perderás tu progreso",);
    if (confirmacion.isConfirmed) location.href = "#/voluntario"; // Romper el proceso y regresar al inicio
  };

  // Traer las opciones del gobierno (Zona Urbana, Rural / Departamentos macro) desde la base de datos
  await adjuntarOpc.adjuntarNoValida(zona, "zones");
  await adjuntarOpc.adjuntarNoValida(apartamento, "departments");
  
  // Termina la carga inicial y libera los botones
  window.procesoPeticion = false;
  botonSiguiente.disabled = false;
  
  // Evento que se dispara al oprimir "Guardar" y enviar el formulario principal
  form.addEventListener("submit", async (e) => {
    window.procesoPeticion = true;
    e.preventDefault();
    botonSiguiente.disabled = true;
      
      // Armar el paquete de datos que viajará e ingresará a la base central de planes familiares
      const datosRegistro = {
        last_names: apellidos.value,
        zone_id: zona.value,
        city_id: ciudad.value,
        family_type_id: 3, // 3 = Por Definir
        // Cruces críticos extrayendo el perfil del voluntario que está usando la aplicación
        sectional_id: localStorage.getItem("sectional_id"), // Hereda la base de mando (Ej. Seccional Meta) 
        user_id: localStorage.getItem("id"), // Creador Legal del formato (El Voluntario logueado)
      };

      // Alerta de Doble Chequeo obligatoria por requerimientos legales de privacidad de datos
      const autorizacion = await alerta.AutorizacionDatos();
      if (autorizacion.isConfirmed) {
        try {
          // Inserción en el servidor
          const data = await api.post("familyPlans", datosRegistro); // Retorna el número de identificación recién creado
          if (data.success) {
            await alerta.alertaOK(data.message);
            // Salta al siguiente paso forzando el salto a la pantalla de la prueba, adjuntando la nueva identificación en el texto de arriba
            window.location.href = `#/voluntario/plan_familiar/testVunerabilidad?id=${data.data.id}`;
          } else alerta.alertaWarning(data.message, data.errors);
        } catch (error) {
          alerta.alertaError(error.errors); // Mostrar que hubo un fallo grande en el servidor
        }
      }
    
    botonSiguiente.disabled = false;
    window.procesoPeticion = false;
  });

  // Efecto cascada: Cuando elige su departamento (por ejemplo "Meta"), pinta sólo sus ciudades (ej: "Acacias", "Castilla"..)
  apartamento.addEventListener("change", async () => {
    await adjuntarOpc.adjuntarReseteoNoValida(ciudad,`cities/department/${apartamento.value}`,);
  });
};
