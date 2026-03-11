/**
 * Controlador: Editar Datos Básicos (PlanDatos/editarController.js)
 * Muestra y administra un formulario extenso lleno de cuadros de texto, listas
 * desplegables y opciones para llenar toda la información censal e identificatoria
 * del Plan Familiar (como Zonas, Departamentos, Sectores, Calidad de Vivienda).
 */
import * as adjuntarOpc from "../../../../helpers/adjuntarOpciones";
import * as alerta from "../../../../helpers/alertas";
import * as api from "../../../../helpers/api";
import { cargarDatos } from "../../../../helpers/cargarDatos";

import * as validacion from "../../../../helpers/validacionInputs";

export default async () => {
  // Extraer el código único o número identificador del plan desde la dirección del navegador web
  const id = location.hash.split("=")[1];
  
  // Elementos principales de la pantalla 
  const botonBack = document.getElementById("botonBack"); // Botón para regresar
  const form = document.querySelector(".form"); // El formulario que agrupa todo
  const botonGuardar = document.getElementById("boton_guardar"); // Botón para guardar cambios
  
  // Elementos individuales del formulario inmenso que el usuario llenará
  const zonas = document.getElementById("zonas"); // Lista desplegable de áreas macro
  const departamentos = document.getElementById("departamentos"); // Lista desplegable de departamentos del país
  const ciudades = document.getElementById("ciudades"); // Lista desplegable de municipios
  const familia = document.getElementById("familiaId"); // Cuadro de texto de solo lectura con el número del plan
  const apellidos = document.getElementById("apellidos"); // Cuadro de texto para los apellidos (Paterno y Materno)
  const dirrecion = document.getElementById("dirrecion"); // Cuadro de texto para escribir la dirección exacta
  const sectores = document.getElementById("sectores"); // Lista desplegable con localidades o tipos de recintos
  const sectorNombre = document.getElementById("sectorNombre"); // Cuadro de texto libre por si el sector no está en la lista
  const telefono = document.getElementById("telefonoFijo"); // Número de contacto telefónico
  const calidadesVivienda = document.getElementById("calidadesVivienda"); // Lista desplegable de calidades o materiales

  // Mecanismo de bloqueo para evitar que el usuario presione botones mientras el sistema está cargando
  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = true;
  }
  window.procesoPeticion = true;

  // Comportamiento del botón superior para ir de vuelta al menú central
  botonBack.onclick = async () => {
    if (window.procesoPeticion) return; // Se previene si aún está procesando algo
    location.href = `#/voluntario-verPlanFamiliar/menu/id=${id}`;
  };

  // Rutina que solicita múltiples listas al servidor al mismo tiempo para llenar las opciones desplegables
  // Se usa una versión que no marca inmediatamente los campos en rojo como erróneos al cargar por primera vez
  await adjuntarOpc.adjuntarNoValida(zonas, "zones");
  await adjuntarOpc.adjuntarNoValida(departamentos, "departments");
  await adjuntarOpc.adjuntarNoValida(ciudades, "cities"); // Puede volver vacío si aún no elige un departamento
  await adjuntarOpc.adjuntarNoValida(sectores, "sectors");
  await adjuntarOpc.adjuntarNoValida(calidadesVivienda, "housingQualities");
  
  // Rellena automáticamente todo este gran formulario pidiendo al servidor los datos que la familia ya tenía guardados
  await cargarDatos(`familyPlans/${id}`,
  [familia,apellidos,zonas,departamentos,ciudades,dirrecion,sectores,sectorNombre,telefono,calidadesVivienda,],
  ["id","last_names","zone_id","department_id","city_id","address","sector_id","sector_name","landline_phone","housing_quality_id",],);
  
  // Modificación cosmética del cuadro número de familia para que siempre diga "Familia segura N. [numero]"
  familia.value = `Familia segura N.${familia.value}`;

  // Termina el proceso de cargar información inicial y desbloquea el botón de guardar
  botonGuardar.disabled = false;
  window.procesoPeticion = false;

  // Lógica para vigilar cada tecla que el usuario presiona, impidiendo que escriba más de la cuenta o use caracteres prohibidos
  apellidos.addEventListener("keydown", (e) => {
    validacion.limiteCaracteres(e, 75); // Restringir a máximo 75 letras
    validacion.textoConEspacios(e); // Impedir el tipeo de símbolos especiales o números en los apellidos
  });
  dirrecion.addEventListener("keydown", (e) => {
    validacion.limiteCaracteres(e, 100);
  });
  sectorNombre.addEventListener("keydown", (e) => {
    validacion.limiteCaracteres(e, 50);
  });
  telefono.addEventListener("keydown", (e) => {
    validacion.limiteCaracteres(e, 15);
    validacion.soloNumeros(e);  // Bloquear texto, permitiendo únicamente números
  });

  // Eventos que se disparan cuando el usuario hace clic fuera de un campo (pierde el foco)
  // Quitan la advertencia de color rojo si el usuario decidió saltar de un campo a otro
  apellidos.addEventListener("blur", (e) => {
    validacion.limpiarError(e.target);
  });
  dirrecion.addEventListener("blur", (e) => {
    validacion.limpiarError(e.target);
  });
  sectores.addEventListener("change", async (e) => {
    validacion.limpiarError(e.target);
  });
  sectorNombre.addEventListener("blur", (e) => {
    validacion.limpiarError(e.target);
  });
  telefono.addEventListener("blur", (e) => {
    validacion.limpiarError(e.target);
  });
  calidadesVivienda.addEventListener("change", async (e) => {
    validacion.limpiarError(e.target);
  });

  // Acción principal que envía toda esta nueva información al servidor
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evitar la recarga violenta de la página web
    botonGuardar.disabled = true; // Bloquea el uso del botón
    window.procesoPeticion = true; // Marca en el sistema que se está procesando algo

    // Ejecuta una rutina de validación casilla por casilla, verificando mínimos, selecciones vacías, etc.
    let validarApellidos = validacion.validarMinimo(apellidos, 3);
    let validarZona = validacion.validarSelect(zonas);
    let validarApartamento = validacion.validarSelect(departamentos);
    let validarCiudad = validacion.validarSelect(ciudades);
    let validarDirrecion = validacion.validarMinimo(dirrecion, 10);
    let validarSector = validacion.validarSelect(sectores);
    let validarSectorNombre = validacion.validarMinimo(sectorNombre, 3);
    let validarTelefono = validacion.validarSiExiste(telefono, 3); // Opcional, pero si el usuario escribe algo, exige mínimo 3 números
    let validarCalidad = validacion.validarSelect(calidadesVivienda);

    // Condicional gigante que exige que TODAS las validaciones sin excepción sean aprobadas
    if (
      validarApellidos &&
      validarZona &&
      validarApartamento &&
      validarCiudad &&
      validarDirrecion &&
      validarSector &&
      validarSectorNombre &&
      validarTelefono &&
      validarCalidad
    ) {
      
      // Empacar todos los datos en una estructura ordenada lista para viajar al servidor
      const datosRegistro = {
        last_names: apellidos.value,
        address: dirrecion.value,
        sector_id: sectores.value,
        sector_name: sectorNombre.value,
        landline_phone: telefono.value,
        housing_quality_id: calidadesVivienda.value,
        // (Nota interna: Algunas propiedades como 'zone_id', 'city_id' y 'department_id' 
        // no se están enviando, puede que el servidor no las necesite o estén segmentadas en otra parte).
      };

      try {
        // Ejecutar la comunicación con el servidor enviando solo las partes que necesitan actualización
        const data = await api.patch(
          `familyPlans/identify/${id}`,
          datosRegistro,
        );
        if (data.success) {
          await alerta.alertaOK(data.message); // Muestra barra verde confirmando que los datos se guardaron
        } else alerta.alertaWarning(data.message, data.errors);
      } catch (error) {
        alerta.alertaError(error.errors); // Muestra el mensaje si la conexión falló
      }
    }
    
    // Libera la restricción para que el usuario pueda volver a corregir cosas o seguir interactuando
    botonGuardar.disabled = false;
    window.procesoPeticion = false;
  });
  
  // Comportamiento de dependencia: Cuando el usuario elige un nuevo Departamento de la lista,
  // el sistema automáticamente borra y rellena la lista de 'Ciudades' con aquellas que correspondan al departamento elegido.
  departamentos.addEventListener("change", async () => {
    await adjuntarOpc.adjuntarReseteoNoValida(ciudades,`cities/department/${departamentos.value}`);
  });
};
