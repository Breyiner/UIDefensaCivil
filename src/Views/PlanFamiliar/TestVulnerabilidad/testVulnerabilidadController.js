import * as alerta from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";

export default async () => {
  const id = location.hash.split("=")[1];
  const botonBack = document.getElementById("boton-back");
  
  const paginado = document.querySelector(".paginado");
  const preguntas = document.querySelector(".preguntas");
  const siguiente = document.querySelector(".botonera__siguiente");
  const atras = document.querySelector(".botonera__atras");

  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = true;
  }

  let paginaActual = 1;

  const paginas = await api.get("vulnerableQuestions/paginate");
  const cantidad = paginas.last_page;

  /* ===== PAGINADO ===== */
  for (let i = 1; i <= cantidad; i++) {
    const p = document.createElement("p");
    p.textContent = i;
    p.classList.add("paginado__numero");
    p.dataset.page = i;

    if (i === paginaActual) {
      p.classList.add("paginado__numero--activo");
    }

    paginado.appendChild(p);
  }

  await cargarPagina();

  /* ===== FUNCIONES ===== */

  async function cargarPagina() {
    window.procesoPeticion = true;
    preguntas.innerHTML = "";

    const pagina = await api.get(`vulnerableQuestions/paginate?page=${paginaActual}`);
    let cont = paginaActual === 1 ? 1 : (paginaActual - 1) * 3 + 1;

    pagina.data.forEach((opcion) => {
      const contenedor = document.createElement("div");

      contenedor.className = opcion.question_caution
        ? "preguntas__contenedor preguntas__contendor--precaucion"
        : "preguntas__contenedor";

      contenedor.innerHTML = `
        <p class="test__numero">${cont}</p>
        <p class="test__texto">${opcion.description}</p>
        <div class="test__opciones">
          <input type="radio" class="invisible" name="opcion-${opcion.id}" id="si-${opcion.id}" value="true"
            ${localStorage.getItem(`opcion-${opcion.id}`) === "true" ? "checked" : ""}>
          <label class="test__opcion test__opcion--si" for="si-${opcion.id}">SI</label>

          <input type="radio" class="invisible" name="opcion-${opcion.id}" id="no-${opcion.id}" value="false"
            ${localStorage.getItem(`opcion-${opcion.id}`) === "false" ? "checked" : ""}>
          <label class="test__opcion test__opcion--no" for="no-${opcion.id}">NO</label>
        </div>
      `;

      preguntas.appendChild(contenedor);
      cont++;
    });

    atras.disabled = paginaActual === 1;
    atras.dataset.page = paginaActual - 1;

    siguiente.textContent = paginaActual === cantidad ? "Evaluar" : "Siguiente";
    siguiente.dataset.page = paginaActual === cantidad ? "fin" : paginaActual + 1;

    window.procesoPeticion = false;
  }

  function cambiarPagina(nuevaPagina) {
    if (nuevaPagina === paginaActual) return;

    document
      .querySelector(`[data-page="${paginaActual}"]`)
      ?.classList.remove("paginado__numero--activo");

    paginaActual = Number(nuevaPagina);

    document
      .querySelector(`[data-page="${paginaActual}"]`)
      ?.classList.add("paginado__numero--activo");

    cargarPagina();
  }

  /* ===== EVENTOS ===== */

  paginado.addEventListener("click", (e) => {
    const page = e.target.dataset.page;
    if (page && !window.procesoPeticion) cambiarPagina(page);
  });

  document.querySelector(".botonera").addEventListener("click", async (e) => {
    if (e.target.dataset.page === "fin" && !window.procesoPeticion) {
      await evaluarTest();
      return;
    }

    if (e.target.dataset.page) {
      cambiarPagina(e.target.dataset.page);
    }
  });

  preguntas.addEventListener("change", (e) => {
    if (e.target.type !== "radio") return;

    localStorage.setItem(e.target.name, e.target.value);

    if (!e.target.closest(".preguntas__contendor--precaucion") && e.target.value == "true")
    {
      localStorage.setItem(`puntaje-${e.target.name}`, e.target.value);
    }
    else if(e.target.value == "false") localStorage.removeItem(`puntaje-${e.target.name}`);
  });

  botonBack.addEventListener("click", async () => {
    if(!window.procesoPeticion)
    {
      const confirmacion = await alerta.alertaQuest("¿Seguro que quieres volver? perderás tu progreso");
      if (confirmacion.isConfirmed) location.href = "#/home";
    }
    });

  async function evaluarTest() {
    siguiente.disabled = true;
    window.procesoPeticion =  true
    const verPreguntas = await api.get("vulnerableQuestions");

    let total = 0;
    let respondidas = 0;
    let puntos = 0;

    verPreguntas.forEach((p) => {
      if (!p.is_active)
        {
          window.procesoPeticion =  false
          siguiente.disabled = false;
          return;
        }
      total++;
      const respuesta = localStorage.getItem(`opcion-${p.id}`);
      if (respuesta !== null) respondidas++;

      if (!p.question_caution && localStorage.getItem(`puntaje-opcion-${p.id}`)) {
        puntos++;
      }
    });

    if (respondidas < total) {
      await alerta.alertaWarning(`No ha respondido todas (${respondidas}/${total})`);
      window.procesoPeticion =  false
      siguiente.disabled = false;
      return;
    }

    if (puntos < 5) {
      await alerta.alertaWarning("No cumple con los requisitos");
      window.procesoPeticion =  false
      siguiente.disabled = false;
      return;
    }
    alerta.alertaLoading();
    for (const p of verPreguntas) {
      if (!p.is_active)
        {
          window.procesoPeticion =  false
          siguiente.disabled = false;
          return;
        }
        const datos = {
        vulnerable_question_id: p.id,
        family_plan_id: id,
        answer: localStorage.getItem(`opcion-${p.id}`) === "true",
      }
      await api.post("vulnerableTest",datos);
      
      localStorage.removeItem(`opcion-${p.id}`);
      localStorage.removeItem(`puntaje-opcion-${p.id}`);
    }
    alerta.alertaLoadingCerrar();
    await alerta.alertaOK("Test evaluado con éxito");
    location.replace(`#/planFamiliar/identificacion/id=${id}`);
  }
};
