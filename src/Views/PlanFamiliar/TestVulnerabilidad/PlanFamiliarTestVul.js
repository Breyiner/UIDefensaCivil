import * as alerta from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";

export default async () => {
  const paginado = document.querySelector(".paginado");
  const preguntas = document.querySelector(".preguntas");
  const siguiente = document.querySelector(".botonera__siguiente");
  const atras = document.querySelector(".botonera__atras");
  const paginas = await api.get("vulnerableQuestions/paginate");
  const cantidad = paginas.last_page;

  if (window.procesoPeticion === undefined) {
  window.procesoPeticion = true;
  }

  let paginaActual = 1;

  for (let i = 1; i <= cantidad; i++) {
    const p = document.createElement("p");
    p.textContent = i;
    p.classList.add("paginado__numero");
    p.id = i;
    i == paginaActual ? p.classList.add("paginado__numero--activo") : "";
    paginado.appendChild(p);
  }
  await cargarPagina();
  window.procesoPeticion = false;

  async function cargarPagina() {
    window.procesoPeticion = true;
    preguntas.innerHTML = "";
    const pagina = await api.get(`vulnerableQuestions/paginate?page=${paginaActual}`);
    let cont;
    paginaActual == 1 ? cont = 1 : cont = ((paginaActual - 1)*3)+1;

    pagina.data.forEach((opcion) => {
      let contenedor = document.createElement("div");
      opcion.question_caution == true ? contenedor.classList.add("preguntas__contenedor","preguntas__contendor--precaucion") : contenedor.classList.add("preguntas__contenedor");
      contenedor.innerHTML = `
        <p class="test__numero">${cont}</p>
        <p class="test__texto">${opcion.description}</p>
          <div class="test__opciones">
          <input type="radio" class="invisible" name="opcion-${opcion.id}" id="opcion-si-${opcion.id}" value="true">
          <label  class="test__opcion" for="opcion-si-${opcion.id}">SI</label>
          <input type="radio" class="invisible" name="opcion-${opcion.id}" id="opcion-no-${opcion.id}" value="false">
          <label  class="test__opcion" for="opcion-no-${opcion.id}">NO</label>
          </div>
        `
      preguntas.appendChild(contenedor); 
      cont++;
    });

    if (paginaActual != 1)
    {
      atras.id = Number(paginaActual)-1;
      atras.disabled = false;
    }
    else atras.disabled = true;
    if (paginaActual != cantidad){
      siguiente.id = Number(paginaActual)+1;
      siguiente.textContent = "Siguiente";
    }
    else {
      siguiente.id = "fin";
      siguiente.textContent = "Evaluar";
    }
    window.procesoPeticion = false;
  }

  window.addEventListener("click", async (e) => {
    if (e.target.matches(".header__botonBack") && !window.procesoPeticion) {
      const pregunta = await alerta.alertaQuest('¿Seguro que quieres volver, perderas tu progreso?');
      if (pregunta.isConfirmed)
      {
        window.location.href = '#/home';
      }
    }
    if (e.target.matches(".paginado__numero") && !window.procesoPeticion) {
      if (paginaActual == e.target.id) {return}
      let numerito = document.getElementById(paginaActual);
      numerito.classList.remove("paginado__numero--activo")
      paginaActual = e.target.id
      let numeritoActual = document.getElementById(e.target.id);
      numeritoActual.classList.add("paginado__numero--activo")
      cargarPagina();
    }
    if (e.target.matches("#fin") && !window.procesoPeticion){
      const verPreguntas = await api.get('vulnerableQuestions');
      let cont = 0;
      let contPreguntas = 0;
      verPreguntas.forEach(preguntas => {
        if(!preguntas.is_active) return
        cont++;
        let dato = localStorage.getItem(`opcion-${preguntas.id}`);
        if (!dato && dato) contPreguntas++;
      });
      if (contPreguntas < cont) await alerta.alertaWarning('No a respondido todas las preguntas '+contPreguntas+"/"+cont);  
      return
    }
    if (e.target.matches(".botonera") && !window.procesoPeticion){
      let numerito = document.getElementById(paginaActual);
      numerito.classList.remove("paginado__numero--activo")
      paginaActual = e.target.id
      let numeritoActual = document.getElementById(e.target.id);
      numeritoActual.classList.add("paginado__numero--activo")
      cargarPagina();
    }
    if (e.target.matches('input[type="radio"]'))
    {
      localStorage.setItem(e.target.name,e.target.value);
    }
  });
};