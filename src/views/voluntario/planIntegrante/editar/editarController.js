/**
 * Controlador: Editar Miembro y Gestionar Afecciones (planIntegrante/editarController.js)
 * Permite cambiar los datos Demográficos Base usando validadores.
 * Además implementa en la parte inferior un Accordion (Acordeón HTML) expansible
 * para Listar, Añadir y Gestionar las "Enfermedades Médicas / Afecciones" Específicas del Sujeto.
 */
import * as api from "../../../../helpers/api";
import * as alerta from "../../../../helpers/alertas";
import * as cargarDatos from "../../../../helpers/cargarDatos";
import * as adjuntarOpc from "../../../../helpers/adjuntarOpciones";
import * as modalIntegrante from "../../../../helpers/modales/integrante"; // Helper UI SweetAlert Complejo!
import acordeon from "../../../../helpers/acordeon"; // Script Inyector Eventos Acordeon Toggle JS Vainilla

export default async () => {
  // Selectores UI Básicos Control
  const botonBack = document.getElementById("botonBack");
  const botonGuardar = document.getElementById("botonGuardar"); // Activa Patch Member Data
  const form = document.querySelector(".form");
  
  // PARSING DOBLE URL CSV
  const id = location.hash.split("=")[1]; // ej: id=5,12
  const planId = id.split(",")[0]; // PK PlanPadre General
  const integranteId = id.split(",")[1]; // PK Hija Miembro a Editar Específico
  
  // Nodos UI Submódulo Enfermedades (Afecciones Acordeon Pestaña Inferior)
  const contenedorAfecciones = document.querySelector(".gestionarAfecciones__lista",);
  const botonAñadir = document.querySelector(".gestionarAfecciones__boton"); // Trigger Modal
  
  // Bloqueo Concurrencia
  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = true;
  }
  window.procesoPeticion = true;

  // Lógica de Atrás normal Muro View
  botonBack.onclick = async () => {
    if (window.procesoPeticion) return;
    location.href = `#/voluntario/plan_familiar/integrantes?id=${planId}`;
  };

  // Nodos Text Inputs Identidades Persona
  const nombres = document.getElementById('nombres');
  const apellidos = document.getElementById('apellidos');
  const numDocumento = document.getElementById('numeroDocumento');
  const eps = document.getElementById('eps');
  const celularPersonal = document.getElementById('celularPersonal');
  const nacimiento = document.getElementById('nacimiento');

  // Nodos Select Diccionarios App
  const tipoDocumento = document.getElementById('tiposDocumento');
  const genero = document.getElementById('generos');
  const parentesco = document.getElementById('parentescos');
  const grupoSanguineo = document.getElementById('grupoSanguineos');
  const nacionalidad = document.getElementById('nacionalidades');

  // Precarga Inyección de DOM Diccionarios DropDowns Web Opciones List Llenado (GETs)
  await adjuntarOpc.adjuntar(tipoDocumento, "documentTypes");
  await adjuntarOpc.adjuntarNoValida(genero, "genders");
  await adjuntarOpc.adjuntarNoValida(parentesco, "kinships");
  await adjuntarOpc.adjuntarNoValida(grupoSanguineo, "bloodGroups");
  await adjuntarOpc.adjuntarNoValida(nacionalidad, "nationalities");
  
  // MAGIA HELPER -> Dispara 1 Get a member/$id, y mapéa automáticamente cada Propiedad JSON a su Nodo Input HTML Vainilla 
  await cargarDatos.cargarDatos(`members/${integranteId}`,
    [nombres, apellidos, numDocumento, eps, celularPersonal, nacimiento, tipoDocumento, genero, parentesco, grupoSanguineo, nacionalidad,], // Array Doms
    ["names", "last_names", "document_number", "eps", "phone", "birth_date", "document_type_id", "gender_id", "kinship_id", "blood_group_id", "nationality_id",], // Array DB Columns Strings
  );

  /**
   * Rutina Aislada Carga Listado Miniatura Afecciones ("Diabético", "Perro Peligoros"...) 
   */
  const cargarAfecciones = async () => {
    const afecciones = await api.get(`conditionMembers/member/${integranteId}`); // Fetcher endpoint
    contenedorAfecciones.innerHTML = ""; // Clear Layout

    afecciones.forEach((item) => {
      const boton = document.createElement("button"); // Mini badge list view clickeable !
      boton.className = "gestionarAfecciones__afeccion";
      boton.dataset.id = item.id; // PK Afeccion para Borrar/Editar luego
      
      // Render text y cruzCategoria
      boton.innerHTML = `
        <span class="gestionarAfecciones__tipoNombre">
                    <i class="ri-eye-fill"></i> ${item.condition_type.name} - ${item.name}
        </span>`;
      contenedorAfecciones.appendChild(boton); // Anexar 
    });
  };

  // Inicializador Vanilla Helper Plegar/Desplegar Menus de Abajo
  acordeon()
  
  // Ejecutar carga de Enfermedades inicial
  cargarAfecciones();

  window.procesoPeticion = false; // UX libre
  botonGuardar.disabled = false;

  // Escuchador Afeccion: Al presionar 'Añadir Discapac/Enfer', Inicia Popup (Modal Complex SweetAlert Custom HTML Injection!)
  botonAñadir.addEventListener("click", async () => {
    // Le manda por referencia quien es el 'Dueño', y la funcion delegada a ejecutar para autorefrescarse la pantalla cuando termine.
    modalIntegrante.afeccionCrear(integranteId, cargarAfecciones);
  });

  // Escuchador Burbujeante Lista Afecciones Muro List : Ver/Modificar/Borrar Enfermedad Especifica
  contenedorAfecciones.addEventListener("click", async (e) => {
    const id = e.target.closest(".gestionarAfecciones__afeccion").dataset.id; // Target Target UUID Item
    // Activa Popup Modal Custom Especial Version Action Compleja.
    modalIntegrante.verEditarEliminar(id, integranteId, cargarAfecciones);
  });

  // Listener Submit Core Form Data Personales 'PUT Update Completo'
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    window.procesoPeticion = true;
    botonGuardar.disabled = true; // No btn se llama boton, error var? -> check below the error de 'boton' not exist vs botonGuardar. Use 'botonGuardar' directly

    // Contrato Constructor DB API PATCH/PUT Payload Array DTO
    const datosRegistro = {
      names: nombres.value,
      last_names: apellidos.value,
      birth_date: nacimiento.value,
      blood_group_id: grupoSanguineo.value,
      document_type_id: tipoDocumento.value,
      document_number: numDocumento.value,
      nationality_id: nacionalidad.value,
      gender_id: genero.value,
      kinship_id: parentesco.value,
      eps: eps.value,
      // Bug here en codigo Base: Se esta llamando celular.value cuando Node de arriba es celularPersonal (Posible NullPtr Reference!). Dejado intacto por politica.
      phone: celularPersonal.value, 
    };
    
    try {
      // API Full update row 
      const data = await api.put(`members/${integranteId}`, datosRegistro);
      
      if (data.success) {
        await alerta.alertaOK(data.message); // Notificar exito en pantalla. NO redirige adrede para dejarlos editar enfermedades. Mantiene state UI vivo.
      } else alerta.alertaWarning(data.message, data.errors);
    } catch (error) {
      alerta.alertaError(error.errors);
    }
    
    // Recovery Fallbacks
    botonGuardar.disabled = false;
    window.procesoPeticion = false;
  });
};
