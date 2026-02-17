import * as api from "../../../../Helpers/api";
import * as alerta from "../../../../Helpers/alertas";
import * as cargarDatos from "../../../../Helpers/cargarDatos";
import * as adjuntarOpc from "../../../../Helpers/adjuntarOpciones";
import * as modalIntegrante from "../../../../Helpers/modales/integrante";
import acordeon from "../../../../Helpers/acordeon";

export default async () => {
  const botonBack = document.getElementById("boton-back");
  const boton = document.querySelector(".form__boton");
  const form = document.querySelector(".form");
  const id = location.hash.split("=")[1];
  const planId = id.split(",")[0];
  const integranteId = id.split(",")[1];
  const contenedorAfecciones = document.querySelector(".gestionarAfecciones__lista",);
  const botonAñadir = document.querySelector(".gestionarAfecciones__boton");
  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = true;
  }
  window.procesoPeticion = true;

  botonBack.onclick = async () => {
    if (window.procesoPeticion) return;
    location.href = `#/planIntegrante/ver/id=${planId}`;
  };

  // Inputs de texto
  const nombres = document.querySelector(".input__nombres");
  const apellidos = document.querySelector(".input__apellidos");
  const numDocumento = document.querySelector(".input__numDocumento");
  const eps = document.querySelector(".input__eps");
  const celular = document.querySelector(".input__celular");
  const nacimiento = document.querySelector(".input__nacimiento");
// Selects
  const tipoDocumento = document.querySelector(".input__tipoDocumento");
  const genero = document.querySelector(".input__genero");
  const parentesco = document.querySelector(".input__parentesco");
  const grupoSanguineo = document.querySelector(".input__grupoSanguineo");
  const nacionalidad = document.querySelector(".input__nacionalidad");

  await adjuntarOpc.adjuntar(tipoDocumento, "documentTypes");
  await adjuntarOpc.adjuntarNoValida(genero, "genders");
  await adjuntarOpc.adjuntarNoValida(parentesco, "kinships");
  await adjuntarOpc.adjuntarNoValida(grupoSanguineo, "bloodGroups");
  await adjuntarOpc.adjuntarNoValida(nacionalidad, "nationalities");
  await cargarDatos.cargarDatos(`members/${integranteId}`,
    [nombres,apellidos,numDocumento,eps,celular,nacimiento,tipoDocumento,genero,parentesco,grupoSanguineo,nacionalidad,],
    ["names","last_names","document_number","eps","phone","birth_date","document_type_id","gender_id","kinship_id","blood_group_id","nationality_id",],
  );

  const cargarAfecciones = async () => {
    const afecciones = await api.get(`conditionMembers/member/${integranteId}`);
    contenedorAfecciones.innerHTML = "";
  
    afecciones.forEach((item) => {
      const boton = document.createElement("button");
      boton.className = "gestionarAfecciones__afeccion";
      boton.dataset.id = item.id;
      boton.innerHTML = `
        <span class="gestionarAfecciones__tipoNombre">
                    <i class="ri-eye-fill"></i> ${item.condition_type.name} - ${item.name}
        </span>`;
      contenedorAfecciones.appendChild(boton);
      });
  };

  acordeon()
  cargarAfecciones();

  window.procesoPeticion = false;
  boton.disabled = false;

  botonAñadir.addEventListener("click", async () => {
    modalIntegrante.crear(integranteId,cargarAfecciones);
  });

  contenedorAfecciones.addEventListener("click", async (e) => {
    const id = e.target.closest(".gestionarAfecciones__afeccion").dataset.id;
    modalIntegrante.verEditarEliminar(id,integranteId,cargarAfecciones);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    window.procesoPeticion = true;
    boton.disabled = true;

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
      phone: celular.value,
    };
    try {
      const data = await api.put(`members/${integranteId}`, datosRegistro);
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
