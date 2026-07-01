/**
 * Controlador: Insertar Nueva Mascota (planMascota/crear/crearController.js)
 * Orquesta la creación del perfil del animal y su historial de vacunas en memoria.
 * Pasa los callbacks de interacción al componente visual y gestiona el guardado final en la base de datos.
 * Sigue la estructura de tarjeta_gestion donde el componente visual retorna el elemento DOM.
 * 
 * @module crearController
 */
import { api } from "@/helpers/index.js";
import { alertas as alerta } from "@/helpers/index.js";
import { VistaMascotas, VacunaModal, crearVacunaTag } from "@/componentes/mascotas/index.js";
import { validacionInputs as validacion, fechas } from "@/helpers/index.js";

/**
 * Inicializa el controlador de creación de mascota
 */
export default async () => {
  const id = location.hash.split("=")[1]; // PlanFamiliar FK Root ID
  
  /** @type {Array} Arreglo local en memoria para almacenar las vacunas ingresadas */
  let vaccines = [];

  if (window.procesoPeticion === undefined) { window.procesoPeticion = true; }
  window.procesoPeticion = false;

  // Botón Regresar
  const botonBack = document.getElementById("botonBack");
  botonBack.onclick = () => {
    location.href = `#/voluntario/plan_familiar/mascotas?familia_id=${id}`;
  };

  // Instancia el componente visual de mascotas (retorna el nodo del formulario)
  const form = await VistaMascotas({
    petData: null,
    esSupervisor: false
  });

  const contenedor = document.getElementById("contenedor-mascota");
  contenedor.innerHTML = ""; // Limpiar
  contenedor.appendChild(form);

  // Inicializar calendarios AirDatepicker
  fechas.initFechas();

  // Inicializar validador automático sobre el formulario
  validacion.validadorAutomatico.init(form);

  // Obtener referencias de elementos del DOM internos del formulario
  const nombreInput = form.querySelector("#nombre");
  const razaInput = form.querySelector("#raza");
  const edadInput = form.querySelector("#edad");
  const especiesSelect = form.querySelector("#especies");
  const generosSelect = form.querySelector("#generos");
  const btnAgregarVacuna = form.querySelector("#btnAgregarVacuna");
  const listaDiv = form.querySelector(".gestionarAfecciones__lista");
  const btnGuardar = form.querySelector("#botonGuardar");

  // Helper local para renderizar la lista de vacunas en la vista
  const renderVaccines = (list) => {
    listaDiv.innerHTML = "";

    if (!list || list.length === 0) {
      const emptyMsg = document.createElement("p");
      emptyMsg.className = "gestionarAfecciones__vacio";
      emptyMsg.textContent = "No hay vacunas registradas.";
      listaDiv.appendChild(emptyMsg);
      return;
    }

    list.forEach((vacuna) => {
      const tag = crearVacunaTag(
        vacuna,
        false, // esSupervisor
        () => {
          // Callback al editar
          VacunaModal({
            initialData: vacuna,
            birthDate: edadInput.value,
            onSave: async (data) => {
              const idx = vaccines.findIndex(v => v.tempId === vacuna.tempId);
              if (idx !== -1) {
                vaccines[idx].name = data.name;
                vaccines[idx].date = data.date;
                renderVaccines(vaccines);
                return { success: true };
              }
              return { success: false };
            }
          });
        },
        () => {
          // Callback al eliminar
          vaccines = vaccines.filter(v => v.tempId !== vacuna.tempId);
          renderVaccines(vaccines);
        }
      );
      listaDiv.appendChild(tag);
    });
  };

  // Manejar click en agregar vacuna
  btnAgregarVacuna.addEventListener("click", () => {
    VacunaModal({
      birthDate: edadInput.value,
      onSave: async (data) => {
        const newVac = {
          tempId: Date.now().toString(),
          name: data.name,
          date: data.date
        };
        vaccines.push(newVac);
        renderVaccines(vaccines);
        return { success: true };
      }
    });
  });

  // Manejar el submit del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validar inputs
    const isValid = validacion.validadorAutomatico.validarTodo(form);
    if (!isValid) return;

    // Validar fechas de vacunas
    const birthDate = edadInput.value;
    if (birthDate) {
      const invalidVaccines = vaccines.filter(v => v.date <= birthDate);
      if (invalidVaccines.length > 0) {
        alerta.alertaWarning(
          "Conflicto en vacunas",
          `La fecha de las vacunas debe ser posterior al nacimiento (${birthDate}).`
        );
        return;
      }
    }

    if (window.procesoPeticion) return;
    window.procesoPeticion = true;
    btnGuardar.disabled = true;

    const datosRegistro = {
      name: nombreInput.value,
      breed: razaInput.value,
      birth_date: edadInput.value,
      species_id: especiesSelect.value,
      animal_gender_id: generosSelect.value,
    };

    try {
      // Guarda los datos básicos de la mascota
      const data = await api.post("pets", {
        ...datosRegistro,
        family_plan_id: id
      });
      
      if (data && data.success) {
        // Guarda todas las vacunas registradas en memoria secuencialmente
        for (const vaccine of vaccines) {
          await api.post("petVaccines", {
            name: vaccine.name,
            date: vaccine.date,
            pet_id: data.data.id
          });
        }
        await alerta.alertaOK(data.message);
        location.href = `#/voluntario/plan_familiar/mascotas?familia_id=${id}`;
      } else if (data) {
        alerta.alertaWarning(data.message, data.errors);
      }
    } catch (error) {
      alerta.alertaError(error.errors || error.message);
    }

    btnGuardar.disabled = false;
    window.procesoPeticion = false;
  });

  // Render inicial de vacunas
  renderVaccines(vaccines);
};