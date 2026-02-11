import * as api from "../../../Helpers/api";
import * as alerta from "../../../Helpers/alertas";
import * as cargarDatos from "../../../Helpers/cargarDatos";
import * as adjuntarOpc from "../../../Helpers/adjuntarOpciones";

export default async () => {
  const botonBack = document.getElementById("boton-back");
  const boton = document.querySelector(".form__boton");
  const form = document.querySelector(".form");
  const id = location.hash.split("=")[1];
  const planId = id.split(",")[0];
  const mascotaId = id.split(",")[1];
  const contenedorAfeccioness = document.querySelector(
    ".gestionarAfecciones__lista",
  );
  const botonAñadir = document.querySelector(".gestionarAfecciones__boton");
  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = true;
  }
  window.procesoPeticion = true;

  botonBack.onclick = async () => {
    if (window.procesoPeticion) return;
    location.href = `#/planMascota/ver/id=${planId}`;
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
  await cargarDatos.cargarDatos(
    `pets/${mascotaId}`,
    [
      nombre,
      raza,
      edad,
      especie,
      genero,
    ],
    [
      "name",
      "breed",
      "age",
      "species_id",
      "animal_gender_id",
    ],
  );

  window.procesoPeticion = false;
  boton.disabled = false;

  const cargarAfecciones = async () => {
    const afecciones = await api.get(`petVaccines/pet/${mascotaId}`);
    contenedorAfeccioness.innerHTML = "";

    afecciones.forEach((item) => {
      const boton = document.createElement("button");
      boton.className = "gestionarAfecciones__afeccion";
      boton.dataset.id = item.id;
      boton.innerHTML = `
                <span class="gestionarAfecciones__tipoNombre">
                    <i class="ri-eye-fill"></i> ${item.name} - ${item.date}
                </span>`;
      contenedorAfeccioness.appendChild(boton);
    });
  };

  cargarAfecciones();

  //Query para alcanzar varios con una misma clase
  document.querySelectorAll(".acordeon__nombre").forEach((boton) => {
    boton.addEventListener("click", () => {
      const acordeonContenido = boton.nextElementSibling; //devuelve el siguiente

      if (acordeonContenido.classList.contains("acordeon__contenido--oculto")) {
        acordeonContenido.className = "acordeon__contenido";
      } else if (acordeonContenido.classList.contains("acordeon__contenido")) {
        acordeonContenido.className = "acordeon__contenido--oculto";
      }
    });
  });

  botonAñadir.addEventListener("click", async () => {
    const htmlModal = `
            <div class="explicacion modal">
                <p class="explicacion__titulo">Agregar Vacunas</p>
            </div>
            <div class="form">
                <div class="form__inputBox modal-50">
                    <i class="ri-syringe-fill"></i>
                    <input type="text" class="form__input form__nombre" placeholder="Nombre de la vacuna" autocomplete="off">
                </div>
                <div class="form__inputBox">
                    <i class="ri-calendar-fill"></i>
                    <input type="date" class="form__input form__fecha">
                </div>
            </div>`;

    const funcionModal = async () => {
      const nombreVacuna = document.querySelector(".form__nombre").value;
      const fechaVacuna = document.querySelector(".form__fecha").value;

      const datos = {
        name: nombreVacuna,
        date: fechaVacuna,
        pet_id: mascotaId,
      };

      try {
        const data = await api.post("petVaccines", datos);
        if (data.success) {
          await alerta.alertaOK(data.message);
          await cargarAfecciones();
        } else alerta.alertaWarning(data.message, data.errors);
      } catch (error) {
        console.log(error);
        alerta.alertaError(error.errors);
      }
    };
    alerta.Crear(htmlModal, funcionModal);
  });

  contenedorAfeccioness.addEventListener("click", async (e) => {
    const id = e.target.closest(".gestionarAfecciones__afeccion").dataset.id;
    const datos = await api.get(`petVaccines/${id}`);
    const htmlModal = `
            <div class="modalVer modal">
                <div class="modalVer__dato">
                    <i class="ri-syringe-line modalVer__icono"></i>
                    <div class="modalVer__titulo">Nombre</div>
                    <div class="modalVer__texto">${datos.name}</div>
                </div>

                <div class="modalVer__dato">
                    <i class="ri-calendar-line modalVer__icono"></i>
                    <div class="modalVer__titulo">Fecha de Vacuna</div>
                    <div class="modalVer__texto">${datos.date}</div>
                </div>
            </div>`;
    const funcionModalEditar = async () => {
      const info = await api.get(`petVaccines/${id}`);
    const htmlModal = `
      <div class="explicacion modal">
        <p class="explicacion__titulo">Editar Vacuna</p>
      </div>
      <div class="form">
        <div class="form__inputBox modal-50">
          <i class="ri-syringe-fill"></i>
          <input type="text" class="form__input form__nombre" placeholder="Nombre de la vacuna" autocomplete="off" value="${info.name}">
        </div>
        <div class="form__inputBox">
          <i class="ri-calendar-fill"></i>
          <input type="date" class="form__input form__fecha" value="${info.date}">
        </div>
      </div>`;
    const funcionModal = async () => {
      const nombreVacuna = document.querySelector(".form__nombre").value;
      const fechaVacuna = document.querySelector(".form__fecha").value;

      const datos = {
        name: nombreVacuna,
        date: fechaVacuna,
        pet_id: mascotaId,
      };

      try {
        const data = await api.patch(`petVaccines/${id}`, datos);
        if (data.success) {
          await alerta.alertaOK(data.message);
          await cargarAfecciones();
        } else alerta.alertaWarning(data.message, data.errors);
      } catch (error) {
        console.log(error);
        alerta.alertaError(error.errors);
      }
    };
    alerta.Crear(htmlModal, funcionModal);
    };
    const funcionModalEliminar = async () => {
      const confirmacion = await alerta.alertaQuest(
        "¿Seguro que deseas eliminar esta vacuna de la mascota?",
      );
      if (!confirmacion.isConfirmed) return;
      const eliminado = await api.delet(`petVaccines/${id}`);
      if (eliminado.success) {
        await alerta.alertaOK(eliminado.message);
        await cargarAfecciones();
      }
    };

    alerta.Ver(htmlModal, true, true, funcionModalEditar, funcionModalEliminar);
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
