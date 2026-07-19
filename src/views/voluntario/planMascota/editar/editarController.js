/**
 * Controlador: Editar Datos Mascota y Gestión de Historial de Vacunación (planMascota/editarController.js)
 * Carga el perfil actual de la mascota y sus vacunas registradas en la base de datos.
 * Orquesta todos los eventos de actualización de perfil, creación de vacunas en tiempo real,
 * edición y eliminación con doble confirmación, y gestiona las redirecciones basadas en el rol.
 * Sigue la estructura de tarjeta_gestion donde el componente visual retorna el elemento DOM.
 * 
 * @module editarController
 */
import { api } from "@/helpers/index.js";
import { alertas as alerta } from "@/helpers/index.js";
import { VistaMascotas, VacunaModal, crearVacunaTag } from "@/componentes/mascotas/index.js";
import { validacionInputs as validacion, fechas } from "@/helpers/index.js";

/**
 * Inicializa el controlador de edición de mascota
 */
export default async () => {
  const esSupervisor = location.hash.includes("/supervisor/");
  const hashQuery = location.hash.split("?")[1] ?? "";
  const params = new URLSearchParams(hashQuery);

  const planId = params.get("familia_id");
  const mascotaId = params.get("mascota_id");

  /** @type {Array} Estado local mutable del listado de vacunas sincronizado con la BD */
  let vaccines = [];

  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = true;
  }
  window.procesoPeticion = false;

  // Lógica Botón Atrás
  const botonBack = document.getElementById("botonBack");
  botonBack.onclick = () => {
    if (esSupervisor) {
      location.href = `#/supervisor/plan_familiar/revision?familia_id=${planId}`;
      return;
    }
    location.href = `#/voluntario/plan_familiar/mascotas?familia_id=${planId}`;
  };

  // Carga inicial del perfil de mascota y sus vacunas desde el servidor
  let petData = null;
  if (mascotaId) {
    petData = await api.get(`pets/${mascotaId}`);
    vaccines = await api.get(`petVaccines/pet/${mascotaId}`) || [];
  }

  // Instancia el componente visual de mascotas (retorna el nodo del formulario)
  const form = await VistaMascotas({
    petData: petData,
    esSupervisor: esSupervisor
  });

  const contenedorMascota = document.getElementById("contenedor-mascota");
  if (contenedorMascota) {
    contenedorMascota.innerHTML = ""; // Limpiar
    contenedorMascota.appendChild(form);

    // Inicializar calendarios AirDatepicker
    fechas.initFechas();
  }

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

  // Helper local para renderizar las vacunas
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
        esSupervisor,
        () => {
          // Callback al editar vacuna (en base de datos directamente)
          VacunaModal({
            initialData: vacuna,
            birthDate: edadInput.value,
            onSave: async (vaccineData) => {
              try {
                const res = await api.patch(`petVaccines/${vacuna.id}`, vaccineData);
                if (res && res.success) {
                  // Refresca la lista desde la API
                  vaccines = await api.get(`petVaccines/pet/${mascotaId}`) || [];
                  renderVaccines(vaccines);
                  return { success: true, message: res.message };
                } else if (res) {
                  alerta.alertaWarning(res.message, res.errors);
                }
              } catch (err) {
                alerta.alertaError(err.errors || err.message);
              }
              return { success: false };
            }
          });
        },
        async () => {
          // Callback al eliminar vacuna (en base de datos directamente)
          const confirmacion = await alerta.alertaQuest(
            "¿Seguro que deseas eliminar esta vacuna de la mascota?"
          );
          if (!confirmacion.isConfirmed) return;

          try {
            const res = await api.delet(`petVaccines/${vacuna.id}`);
            if (res && res.success) {
              await alerta.alertaOK(res.message);
              // Refresca la lista local
              vaccines = await api.get(`petVaccines/pet/${mascotaId}`) || [];
              renderVaccines(vaccines);
            } else if (res) {
              alerta.alertaError(res.message);
            }
          } catch (err) {
            alerta.alertaError(err.errors || err.message);
          }
        }
      );
      listaDiv.appendChild(tag);
    });
  };

  // Manejar click en agregar vacuna
  if (!esSupervisor) {
    btnAgregarVacuna.addEventListener("click", () => {
      VacunaModal({
        birthDate: edadInput.value,
        onSave: async (vaccineData) => {
          try {
            const res = await api.post("petVaccines", {
              ...vaccineData,
              pet_id: mascotaId
            });
            if (res && res.success) {
              // Refresca la lista desde la API
              vaccines = await api.get(`petVaccines/pet/${mascotaId}`) || [];
              renderVaccines(vaccines);
              return { success: true, message: res.message };
            } else if (res) {
              alerta.alertaWarning(res.message, res.errors);
            }
          } catch (err) {
            alerta.alertaError(err.errors || err.message);
          }
          return { success: false };
        }
      });
    });
  }

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
      // Ejecuta la actualización parcial del perfil
      const data = await api.patch(`pets/${mascotaId}`, datosRegistro);
      if (data && data.success) {
        await alerta.alertaOK(data.message);
        // Redirección según rol de usuario
        if (esSupervisor) {
          location.href = `#/supervisor/plan_familiar/revision?familia_id=${planId}`;
        } else {
          location.href = `#/voluntario/plan_familiar/mascotas?familia_id=${planId}`;
        }
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
