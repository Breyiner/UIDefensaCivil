import * as api from "../../../../helpers/api";
import * as alerta from "../../../../helpers/alertas";
import * as cargarDatos from "../../../../helpers/cargarDatos";
import * as adjuntarOpc from "../../../../helpers/adjuntarOpciones";
import * as modalMascota from "../../../../helpers/modales/mascota";
import acordeon from "../../../../helpers/acordeon";

export default async () => {
  const botonBack = document.getElementById("botonBack");
  const botonGuardar = document.getElementById("botonGuardar");
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
  const nombre = document.getElementById('nombre');
  const raza = document.getElementById('raza');
  const edad = document.getElementById('edad');
  const especies = document.getElementById('especies');
  const generos = document.getElementById('generos');
  
  await adjuntarOpc.adjuntar(especies, "species");
  await adjuntarOpc.adjuntarNoValida(generos, "animalGenders");
  await cargarDatos.cargarDatos(`pets/${mascotaId}`, [nombre, raza, edad, especies, generos,], ["name", "breed", "age", "species_id", "animal_gender_id",],);

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
  botonGuardar.disabled = false;

  botonAñadir.addEventListener("click", async () => {
    modalMascota.crearVacunas(mascotaId, cargarAfecciones);
  });

  contenedorAfecciones.addEventListener("click", async (e) => {
    const id = e.target.closest(".gestionarAfecciones__afeccion").dataset.id;
    modalMascota.verEditarEliminar(id, mascotaId, cargarAfecciones);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    window.procesoPeticion = true;
    botonGuardar.disabled = true;

    const datosRegistro = {
      name: nombre.value,
      breed: raza.value,
      age: edad.value,
      species_id: especies.value,
      animal_gender_id: generos.value,
    };
    try {
      const data = await api.patch(`pets/${mascotaId}`, datosRegistro);
      if (data.success) {
        await alerta.alertaOK(data.message);
      } else alerta.alertaWarning(data.message, data.errors);
    } catch (error) {
      alerta.alertaError(error.errors);
    }
    botonGuardar.disabled = false;
    window.procesoPeticion = false;
  });
};
