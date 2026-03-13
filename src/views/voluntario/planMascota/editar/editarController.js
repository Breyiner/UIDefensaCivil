/**
 * Controlador: Editar Datos Mascota y Gestión de Historial de Vacunación (planMascota/editarController.js)
 * Actualizar Datos Base Animal (Raza, Edad..).
 * Integra en Layout Abajo un Wrapper Acordeón Especial donde puedes Añadir N Vacunas usando Modales Externos Interconectados.
 */
import * as api from "../../../../helpers/api";
import * as alerta from "../../../../helpers/alertas";
import * as cargarDatos from "../../../../helpers/cargarDatos";
import * as adjuntarOpc from "../../../../helpers/adjuntarOpciones";
import * as modalMascota from "../../../../helpers/modales/mascota"; // Modulo SweetAlert Vacunas
import acordeon from "../../../../helpers/acordeon"; // UI Expander JS

export default async () => {
  // UI Nav elements
  const botonBack = document.getElementById("botonBack");
  const botonGuardar = document.getElementById("botonGuardar"); // Submit update Base Form
  const form = document.querySelector(".form");
  
  // PARSER URL DUAL CSV
  const id = location.hash.split("=")[1]; // id=12,50
  const planId = id.split(",")[0]; // Target Return UI Familia General
  const mascotaId = id.split(",")[1]; // Target API Update DB Endpoint Pet Entity ID
  
  // Selector Contenedores para Modulo Sub-Lista Vacunas Inferior (Relacion 1 -> N Mascotas a Vacunas)
  const contenedorAfecciones = document.querySelector(".gestionarAfecciones__lista"); 
  const botonAñadir = document.querySelector(".gestionarAfecciones__boton"); // Lanzador Modal de Vacuna
  
  // Bloqueo Inicial Interfaz pre-cargas
  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = true;
  }
  window.procesoPeticion = true;

  // Lógica Botón Atrás Muro listado Animalitos Familia
  botonBack.onclick = async () => {
    if (window.procesoPeticion) return;
    location.href = `#/voluntario-planMascota/ver/id=${planId}`;
  };

  // Inputs de texto Básicos Identidad Perro/Gato HTML
  const nombre = document.getElementById('nombre');
  const raza = document.getElementById('raza');
  const edad = document.getElementById('edad');
  const especies = document.getElementById('especies');
  const generos = document.getElementById('generos');

  // Auto-llenado Diccionarios Select <option> Frontend
  await adjuntarOpc.adjuntar(especies, "species");
  await adjuntarOpc.adjuntarNoValida(generos, "animalGenders");
  
  // AUTO-BINDEO HELPER GLOBAL: Hace el GET /pets/$mascotaId y le inyecta solito la variable a cada HTML Input Text 
  // Ej: nombre.value = response.name de una !!. Sin codigos manuales.
  await cargarDatos.cargarDatos(`pets/${mascotaId}`, [nombre, raza, edad, especies, generos,], ["name", "breed", "age", "species_id", "animal_gender_id",],);

  /**
   * Rutina Hija Aslida Fetching Vacunas Actuales
   * Pinta la Lista debajo del Formulario Base para mostrar "Rabia, ParvoVirus" del mes.
   */
  
  const cargarAfecciones = async () => {
    const afecciones = await api.get(`petVaccines/pet/${mascotaId}`); // Api Call Relacional /petVaccines
    contenedorAfecciones.innerHTML = ""; // Clear Layout
    
    // Bucle Rende Botones Rectangulares Custom list View
    afecciones.forEach((item) => {
      const boton = document.createElement("button");
      boton.className = "gestionarAfecciones__afeccion"; // Design Helper "Afeccion" reciclado (Mismo CSS Layout q Integrante Condiciones Medicas en Front!)
      boton.dataset.id = item.id; // PK_petVaccine Id for Update/Delete
      
      // Label "Nombre Vacuna - Fecha Aplicacion!"
      boton.innerHTML = `
                <span class="gestionarAfecciones__tipoNombre">
                    <i class="ri-eye-fill"></i> ${item.name} - ${item.date} 
                </span>`;
      contenedorAfecciones.appendChild(boton); // Attach Dom
    });
  };

  // Bind CSS Toggle Display Height 0-100 Menu Oculto
  acordeon()
  
  // Primer Trigger Load Data List Views Vaccine
  cargarAfecciones();

  window.procesoPeticion = false; // Libre de clicks User Final
  botonGuardar.disabled = false;

  // Accion: Boton Pulsar "Añadir Nueva Vacuna" (Burbuja Inferior)
  botonAñadir.addEventListener("click", async () => {
    // LLama Submodulo Sweet Alert con Form Inputs Inyectados Pasando el Parametro ID Padre (Para el POST Relacional) y la funcion Actualizar para re render local
    modalMascota.crearVacunas(mascotaId, cargarAfecciones);
  });

  // Accion: Escuchador Muro Delegacion Burbujeo Elemento Especifico Lista Vacuna (Si pulsan "Parvovirus 2023...")
  contenedorAfecciones.addEventListener("click", async (e) => {
    const id = e.target.closest(".gestionarAfecciones__afeccion").dataset.id; // Extractor UUID PK
    // Manda al helper a Pop-Up Vista Resumen Vacuna especifica
    modalMascota.verEditarEliminar(id, mascotaId, cargarAfecciones);
  });

  // Listener Submit Form Maestro Superior (Atributos Basicos Raza/Edad/Nombre) PATCH!
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    window.procesoPeticion = true; // Hard Lock Form Block Spams
    botonGuardar.disabled = true;

    // DTO PATCH Update DB Contract Mapping
    const datosRegistro = {
      name: nombre.value,
      breed: raza.value,
      age: edad.value,
      species_id: especies.value,
      animal_gender_id: generos.value,
    };
    
    try {
      // API Partial Resource Update (no toca relacion family plan ni vacunas)
      const data = await api.patch(`pets/${mascotaId}`, datosRegistro);
      if (data.success) {
        await alerta.alertaOK(data.message); // Notificar (NO VUELVE A MURO PRINCIPAL, Se queda en esta page viva UX Editando si quiere...)
      } else alerta.alertaWarning(data.message, data.errors);
    } catch (error) {
      alerta.alertaError(error.errors);
    }
    
    // Unblock Catch
    botonGuardar.disabled = false;
    window.procesoPeticion = false;
  });
};
