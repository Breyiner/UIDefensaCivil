/**
 * Controlador: Fase de Identificación del Plan (identificacionController.js)
 * Tercera etapa de la creación inicial (después de agregar la foto).
 * Recolecta apartados descriptivos del domicilio de la familia, sector, 
 * telefonía y detalles estructurales de la casa.
 * Si el usuario pulsa "Subir Foto" se salva en la memoria del navegador 
 * lo que tiene escrito por ahora para no perder su tiempo una vez vuelva de dicha pantalla.
 */
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { adjuntarOpciones as adjuntarOpc } from "@/helpers/index.js";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { alertas as alerta } from "@/helpers/index.js";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { api } from "@/helpers/index.js";
import { cargarDatos } from "@/helpers/cargarDatos";
import * as localStorage from "@/helpers/localStorage";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { validacionInputs as validacion } from "@/helpers/index.js";

export default async () => {
  // Encontrar en la dirección actual el número identificador de esta familia específica
  const id = location.hash.split("=")[1];
  const botonBack = document.getElementById("botonBack");

  // Botones y contenedores clave de la interfaz
  const form = document.querySelector(".form");
  const botonSiguiente = document.getElementById("botonSiguiente");

  // Elementos individuales del formulario de la vivienda
  const familia = document.getElementById("familiaId");
  const tipoFamilia = document.getElementById("tipoFamilia");
  const apellidos = document.getElementById("apellidos");
  const dirrecion = document.getElementById("dirrecion"); // Calle / Carrera
  const sector = document.getElementById("sectores");
  const sectorNombre = document.getElementById("sectorNombre"); // Aclaración textual de ubicación
  const telefono = document.getElementById("telefonoFijo");
  const calidad = document.getElementById("calidadesVivienda");

  // Bloqueo de seguridad para que el usuario no envíe dos veces las peticiones si oprimen muy rápido
  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = true;
  }
  window.procesoPeticion = true;

  // Acción al oprimir volver (Salir directamente advirtiendo pérdida)
  botonBack.onclick = async () => {
    if (window.procesoPeticion) return;
    const confirmacion = await alerta.alertaQuest(
      "¿Seguro que quieres volver? perderás tu progreso",
    );
    if (confirmacion.isConfirmed) location.href = "#/voluntario"; // Abandona devolviendo a la pantalla principal
  };

  // Primera consulta: Traer la información básica que este mismo voluntario guardó en el Paso 1
  cargarDatos(`familyPlans/${id}`, [familia, apellidos, tipoFamilia], ["id", "last_names", "family_type"]);
  
  // Llenar las listas desplegables utilizando datos concretos del servidor
  await adjuntarOpc.adjuntarNoValida(sector, "sectors");
  await adjuntarOpc.adjuntarNoValida(calidad, "housingQualities");
  
  // Adornar el título de la familia para el deleite visual 
  familia.value = `Familia segura N.${familia.value}`;

  tipoFamilia.value = `Tipo de familia: ${tipoFamilia.value}`;
  
  // TRUCO TEMPORAL: Si el usuario había abandonado esta pantalla para ir a subir la fotografía,
  // el sistema automáticamente recupera todo lo que este hubiese escrito para no obligarlo a digitar nuevamente
  localStorage.importacionLocalStorage("identificacion");

  // Habilitar la interacción general una vez que la pantalla termina de cargar lo básico
  botonSiguiente.disabled = false;
  window.procesoPeticion = false;

  validacion.validadorAutomatico.init(form);

  // Lógica principal de actualización hacia el servidor permanente
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const booleanValidacion = validacion.validadorAutomatico.validarTodo(form);
    
    // Si algún proceso falló (Regex o Identidad)
    if (!booleanValidacion)
    {
      window.procesoPeticion = false // Abre exclusa de bugs
      botonSiguiente.disabled = false; // Suelta boton
      return // Corta
    }

    // Bloquear Interfaz
    botonSiguiente.disabled = true;
    window.procesoPeticion = true;
      
      // Colección exacta de elementos a viajar al servidor
      const datosRegistro = {
        last_names: apellidos.value,
        address: dirrecion.value,
        sector_id: sector.value,
        sector_name: sectorNombre.value,
        landline_phone: telefono.value,
        housing_quality_id: calidad.value,
      };

      try {
        // Enviar esta porción de información indicándole al servidor que solo actualice estos campos específicos 
        const data = await api.patch(
          `familyPlans/${id}/identify`,
          datosRegistro,
        );
        if (data.success) {
          
          await alerta.alertaOK(data.message);
          
          // Verificar al final, a modo de advertencia, si el Voluntario se le olvidó adjuntar la foto!
          // const geo = await api.getExiste(`housingInfo/${id}`);
          // !geo
          //   ? await alerta.alertaWarning("Se puede agregar la Georeferenciacion despues...",: "";
            
          // Tras terminar esta fase, direcciona definitivamente al Voluntario al menú o escritorio principal de esta nueva familia
          location.href= `#/voluntario/plan_familiar/familia?id=${id}`;
        } else alerta.alertaWarning(data.message, data.errors);
      } catch (error) {
        alerta.alertaError(error.errors); // Muestra falla rotunda de red
      }
    
    // Al finalizar vuelve a habilitar su uso por si ocurrio algún rechazo de datos
    botonSiguiente.disabled = false;
    window.procesoPeticion = false;
  });

  // MAGIA TEMPORAL: Evento generado al tocar el botón de "Agregar Fotografía / Geoferencia"
  // botonGeo.addEventListener("click", (e) => {
  //   if (window.procesoPeticion) return;
  //   e.preventDefault();
    
  //   // Almacena de manera invisible o temporal los datos en la Memoria RAM del navegador de todo lo escrito
  //   localStorage.envioLocalStorage([
  //     dirrecion,
  //     sector,
  //     sectorNombre,
  //     telefono,
  //     calidad,
  //   ]);
    
  //   // Permite que la aplicación salte a la siguiente pantalla para subir su foto sin temor a perder la información tipeada
  //   location.href = `#/voluntario/plan_familiar/identificacion/georeferenciacion?id=${id}`;
  // });
};
