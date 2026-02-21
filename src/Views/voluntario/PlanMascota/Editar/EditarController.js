import * as api from "../../../../Helpers/api";
import * as alerta from "../../../../Helpers/alertas";
import * as cargarDatos from "../../../../Helpers/cargarDatos";
import * as adjuntarOpc from "../../../../Helpers/adjuntarOpciones";
import * as modalMascota from "../../../../Helpers/modales/mascota";
import acordeon from "../../../../Helpers/acordeon";

export default async () => {
  const botonBack = document.getElementById("boton-back");
  const boton = document.querySelector(".form__boton");
  const form = document.querySelector(".form");
  const id = location.hash.split("=")[1];
  const planId = id.split(",")[0];
  const mascotaId = id.split(",")[1];
  const contenedorAfecciones = document.querySelector(".gestionarAfecciones__lista");
  const botonAñadir = document.querySelector(".gestionarAfecciones__boton");
  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = true;
  }
  window.procesoPeticion = true;

  botonBack.onclick = async () => {
    if (window.procesoPeticion) return;
    location.href = `#/voluntario-planMascota/ver/id=${planId}`;
  };

  // Inputs de texto
  const nombre = document.querySelector('.input__nombre');
  const raza = document.querySelector('.input__raza');
  const edad = document.querySelector('.input__edad');
      // Selects
  const especie = document.querySelector('.input__especie');
  const genero = document.querySelector('.input__genero');
  await adjuntarOpc.adjuntar(especie,"species");
  await adjuntarOpc.adjuntar(genero,"animalGenders");
  await cargarDatos.cargarDatos(`pets/${mascotaId}`,[nombre,raza,edad,especie,genero,],["name","breed","age","species_id","animal_gender_id",],);

  const cargarAfecciones = async () => {
    const afecciones = await api.get(`petVaccines/pet/${mascotaId}`);
    contenedorAfecciones.innerHTML = "";

    afecciones.forEach((item) => {
      const boton = document.createElement("button");
      boton.className = "gestionarAfecciones__afeccion";
      boton.dataset.id = item.id;
      boton.innerHTML = `
                <span class="gestionarAfecciones__tipoNombre">
                    <i class="ri-eye-fill"></i> ${item.name} - ${item.date}
                </span>`;
      contenedorAfecciones.appendChild(boton);
    });
  };

  acordeon()
  cargarAfecciones();

  window.procesoPeticion = false;
  boton.disabled = false;

  botonAñadir.addEventListener("click", async () => {
    modalMascota.crearVacunas(mascotaId,cargarAfecciones);
  });

  contenedorAfecciones.addEventListener("click", async (e) => {
    const id = e.target.closest(".gestionarAfecciones__afeccion").dataset.id;
    modalMascota.verEditarEliminar(id,mascotaId,cargarAfecciones);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    window.procesoPeticion = true;
    boton.disabled = true;

    const datosRegistro = {
      name: nombre.value,
      breed: raza.value,
      age: edad.value,
      species_id: especie.value,
      animal_gender_id: genero.value,
    };
    try {
      const data = await api.patch(`pets/${mascotaId}`, datosRegistro);
      if (data.success) {
        await alerta.alertaOK(data.message);
      } else alerta.alertaWarning(data.message, data.errors);
    } catch (error) {
      alerta.alertaError(error.errors);
    }
    boton.disabled = false;
    window.procesoPeticion = false;
  });
};
