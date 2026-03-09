import * as api from "../../../../helpers/api";
import * as alerta from "../../../../helpers/alertas";
import * as adjuntarOpc from "../../../../helpers/adjuntarOpciones";
import * as cargarDatos from "../../../../helpers/cargarDatos";
import * as validacion from "../../../../helpers/validacionInputs";
import * as modalPlanAccion from "../../../../helpers/modales/planAccion";

export default async () => {
  const botonBack = document.getElementById("botonBack");
  const boton = document.getElementById("botonGuardar");
  const form = document.querySelector(".form");
  const id = location.hash.split("=")[1];
  const miembro = document.getElementById("miembro");
  const factorRiesgo = document.getElementById("factorRiesgo");;
  const containerTipoAccion = document.querySelector(".container__gap");
  const botonSiguiente = document.getElementById("siguiente");
  const botonAtras = document.getElementById("atras");

  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = true;
  }
  window.procesoPeticion = true;

  botonBack.onclick = async () => {
    if (window.procesoPeticion) return;
    location.href = `#/voluntario-verPlanFamiliar/menu/id=${id}`;
  };

  await adjuntarOpc.adjuntarMiembros(miembro,`members/familyPlan/select/${id}`,);
  await adjuntarOpc.adjuntarFactorRiesgo(factorRiesgo,`riskFactors/familyPlan/select/${id}`);

  miembro.addEventListener("change", () => {
    validacion.limpiarError(miembro);
  });
  factorRiesgo.addEventListener("change", () => {
    validacion.limpiarError(factorRiesgo);
  });
  window.procesoPeticion = false;
  boton.disabled = false;

  const existePlanAccion = await api.get(
    `actionPlans/familyPlan/boolean/${id}`,
  );
  if (existePlanAccion.boolean) {
    await cargarDatos.cargarDatos(
      `actionPlans/familyPlan/${id}`,
      [miembro, factorRiesgo],
      ["member_id", "risk_factor_id"],
    );
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    window.procesoPeticion = true;
    boton.disabled = true;

    let validarMiembro = validacion.validarSelect(miembro);
    let validarFactorRiesgo = validacion.validarSelect(factorRiesgo);
    if (validarMiembro && validarFactorRiesgo) {
      const datosRegistro = {
        member_id: miembro.value,
        risk_factor_id: factorRiesgo.value,
      };
      try {
        let data;
        if (existePlanAccion.boolean) {
          const idPlanAccion = await api.get(`actionPlans/familyPlan/${id}`);
          data = await api.put(`actionPlans/${idPlanAccion.id}`, datosRegistro);
        } else data = await api.post(`actionPlans`, datosRegistro);
        if (data.success) {
          await alerta.alertaOK(data.message);
          if (!existePlanAccion.boolean) location.reload();
        } else alerta.alertaWarning(data.message, data.errors);
      } catch (error) {
        alerta.alertaError(error.errors);
      }
    }
    boton.disabled = false;
    window.procesoPeticion = false;
  });

  if (existePlanAccion.boolean) {
    botonSiguiente.disabled = true;
    botonAtras.disabled = false;
    const planAccionTitulo = document.getElementById('planAccion__titulo');
    planAccionTitulo.textContent = 'Despues';
    containerTipoAccion.classList.remove("invisible");
    const idPlanAccion = await api.get(`actionPlans/familyPlan/${id}`);
    const contenedorAfecciones = document.querySelector(
      ".gestionarAfecciones__lista",
    );
    const tipoEstado = 3;
    const cargarAfecciones = async () => {
      const afecciones = await api.get(
        `actionPlanActions/actionPlan/${idPlanAccion.id}`,
      );
      contenedorAfecciones.innerHTML = "";
      afecciones.forEach((item) => {
        if (tipoEstado == item.action_type_id) {
          const boton = document.createElement("button");
          boton.className = "gestionarAfecciones__afeccion";
          boton.dataset.id = item.id;
          boton.innerHTML = `
            <span class="gestionarAfecciones__tipoNombre">
                <i class="ri-eye-fill"></i> ${item.member_name} - ${item.description}
            </span>`;
          contenedorAfecciones.appendChild(boton);
        }
      });
    };
    cargarAfecciones();

    window.procesoPeticion = false;
    boton.disabled = false;
    const botonAñadir = document.querySelector(".gestionarAfecciones__boton");
    botonAñadir.addEventListener("click", async () => {
      modalPlanAccion.crear(id, tipoEstado, cargarAfecciones, idPlanAccion.id);
    });

    contenedorAfecciones.addEventListener("click", async (e) => {
      const idAfeccion = e.target.closest(".gestionarAfecciones__afeccion")
        .dataset.id;
      modalPlanAccion.verEditarEliminar(idAfeccion, id, cargarAfecciones);
    });

    botonAtras.addEventListener("click", async () => {
      if (window.procesoPeticion) return;
      location.href = `#/voluntario-planAccion/durante/id=${id}`;
    });
  }
};
