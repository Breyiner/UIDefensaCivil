import * as api from "../../../../helpers/api";
import * as alerta from "../../../../helpers/alertas";
import * as cargarDatos from "../../../../helpers/cargarDatos";
import * as adjuntarOpc from "../../../../helpers/adjuntarOpciones";
import * as modalIntegrante from "../../../../helpers/modales/integrante";
import acordeon from "../../../../helpers/acordeon";

export default async () => {
  const botonBack = document.getElementById("botonBack");
  const botonGuardar = document.getElementById("botonGuardar");
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
    location.href = `#/voluntario-planIntegrante/ver/id=${planId}`;
  };

  const nombres = document.getElementById('nombres');
  const apellidos = document.getElementById('apellidos');
  const numDocumento = document.getElementById('numeroDocumento');
  const eps = document.getElementById('eps');
  const celularPersonal = document.getElementById('celularPersonal');
  const nacimiento = document.getElementById('nacimiento');

  const tipoDocumento = document.getElementById('tiposDocumento');
  const genero = document.getElementById('generos');
  const parentesco = document.getElementById('parentescos');
  const grupoSanguineo = document.getElementById('grupoSanguineos');
  const nacionalidad = document.getElementById('nacionalidades');

  await adjuntarOpc.adjuntar(tipoDocumento, "documentTypes");
  await adjuntarOpc.adjuntarNoValida(genero, "genders");
  await adjuntarOpc.adjuntarNoValida(parentesco, "kinships");
  await adjuntarOpc.adjuntarNoValida(grupoSanguineo, "bloodGroups");
  await adjuntarOpc.adjuntarNoValida(nacionalidad, "nationalities");
  await cargarDatos.cargarDatos(`members/${integranteId}`,
    [nombres, apellidos, numDocumento, eps, celularPersonal, nacimiento, tipoDocumento, genero, parentesco, grupoSanguineo, nacionalidad,],
    ["names", "last_names", "document_number", "eps", "phone", "birth_date", "document_type_id", "gender_id", "kinship_id", "blood_group_id", "nationality_id",],
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
  botonGuardar.disabled = false;

  botonAñadir.addEventListener("click", async () => {
    modalIntegrante.crear(integranteId, cargarAfecciones);
  });

  contenedorAfecciones.addEventListener("click", async (e) => {
    const id = e.target.closest(".gestionarAfecciones__afeccion").dataset.id;
    modalIntegrante.verEditarEliminar(id, integranteId, cargarAfecciones);
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
    botonGuardar.disabled = false;
    window.procesoPeticion = false;
  });
};
