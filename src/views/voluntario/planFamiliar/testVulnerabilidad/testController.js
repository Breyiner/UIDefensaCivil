/**
 * Controlador: Evaluador Test de Vulnerabilidad (testController.js)
 * El corazón del módulo. Genera dinámicamente cuadros de preguntas 
 * informales o formales (con botones SI/NO) pidiéndoselas al servidor.
 * Aprovecha la memoria temporal del navegador para llevar el conteo
 * de puntos ganados y perdidos en el mismo teléfono, sin depender 
 * de una conexión lenta.
 * Al concluír, califica la encuesta y decide si el Plan Familiar se aprueba o se expulsa.
 */
import * as alerta from "../../../../helpers/alertas";
import * as api from "../../../../helpers/api";

export default async () => {
  // Clave o Identificación de la familia en progreso
  const id = location.hash.split("=")[1];
  const botonBack = document.getElementById("botonBack");

  // Contenedores responsables de dibujar las preguntas en la pantalla
  const paginado = document.querySelector(".paginado"); // Sección visual para ver los numeritos inferiores (1 2 3 4)
  const preguntas = document.querySelector(".preguntas"); // Zona en blanco central para que caigan las preguntas
  const siguiente = document.querySelector(".botonera__siguiente"); // Botón Inferior: 'Siguiente' / 'Evaluar'
  const atras = document.querySelector(".botonera__atras"); // Botón inferior para retroceder

  // Prevención de comportamiento desbocado si las conexiones están lentas
  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = true;
  }
  window.procesoPeticion = true;

  //Se crea un objeto que almacena los puntajes, repuestas y cuenta aquellas cuya opcion marque "SI" = true de forma temporal ----------------------------------------- Nuevo
  const testRespuestas = {
    respuesta:{},
    puntaje:{},
    contador:0
  }

  // Lógica del Botón Volver (Flecha blanca superior)
  botonBack.onclick = async () => {
    if (window.procesoPeticion) return;
    const confirmacion = await alerta.alertaQuest(
      "¿Seguro que quieres volver?, perderás tu progreso",
    );
    if (confirmacion.isConfirmed) location.href = "#/voluntario/plan_familiar";
  };

  // Referencia interna sobre en que parte de la encuesta nos encontramos
  let paginaActual = 1;

  // Acción Silenciosa 1: Avisa al servidor e indaga cuántas preguntas existen. 
  // (Si hay 20 preguntas y por pantalla caen 3, nos reporta que habrán 7 páginas).
  const paginas = await api.getPaginacion("vulnerableQuestions/paginate");
  const cantidad = paginas.paginate.last_page; // Retorna esa exactitud

  // Bucle automático encargado de dibujar los cuadros con números indicadores en la sección de abajo
  for (let i = 1; i <= cantidad; i++) {
    const p = document.createElement("p");
    p.textContent = i;
    p.classList.add("paginado__numero"); // Las decora según nuestras reglas
    p.dataset.page = i; // Les adhiere la responsabilidad silenciosa de informar cuál número son

    // Si coincide con la actual, marca visualmente esta pequeña gragea
    if (i === paginaActual) {
      p.classList.add("paginado__numero--activo");
    }

    paginado.appendChild(p); // Colocar este nuevo número creado en pantalla
  }

  // Activa todo el motor que empieza a solicitarle ya mismo el texto exacto de dichas preguntas de la DB
  await cargarPagina();

  /**
   * Rutina Central: Dibuja las preguntas de Vulnerabilidad pertinentes
   * de esta sola página obteniéndolas del servidor.
   */
  async function cargarPagina() {
    window.procesoPeticion = true; // Bloquea clicks desesperados durante este suceso
    preguntas.innerHTML = ""; // Limpia el pizarrón actual para traer textos limpios

    // Solicita verdaderamente el texto explicativo de cada pregunta de ESTA etapa específica 
    const pagina = await api.get(
      `vulnerableQuestions/paginate?page=${paginaActual}`,
    );
    
    // Truco visual para que la enumeración total tenga lógica.
    // Ej: Página 2 -> Empieza en la pregunta #4. Página 3 -> Pregunta #7.
    let cont = paginaActual === 1 ? 1 : (paginaActual - 1) * 3 + 1;
    
    // Insertar en la pantalla pregunta por pregunta usando un modelo repetitivo
    pagina.forEach((opcion) => {
      const contenedor = document.createElement("div");

      // Comprobador Crítico: Si la advertencia es "De sumo riesgo" o de "Precaución", inyecta un color Alarma de peligro (Usualmente fondo Naranja)
      contenedor.className = opcion.question_caution
        ? "preguntas__contenedor preguntas__contendor--precaucion"
        : "preguntas__contenedor";

      // Plantilla Estructural Ciega: Esconde elementos funcionales debajo de letreros llamativos.
      // ESTRATEGIA: La opción elegida anteriormente es deducida gracias a la Memoria, así al volver las cosas marcadas seguirán tal cual se dejaron.
      contenedor.innerHTML = `
        <p class="test__numero">${cont}</p>
        <p class="test__texto">${opcion.description}</p>
        <div class="test__opciones">
          <input type="radio" class="invisible" name="opcion-${opcion.id}" id="si-${opcion.id}" value="true"
            ${testRespuestas.respuesta[`opcion-${opcion.id}`] === "true" ? "checked" : ""}>
          <label class="test__opcion test__opcion--si" for="si-${opcion.id}">SI</label>

          <input type="radio" class="invisible" name="opcion-${opcion.id}" id="no-${opcion.id}" value="false"
            ${testRespuestas.respuesta[`opcion-${opcion.id}`] === "false" ? "checked" : ""}>
          <label class="test__opcion test__opcion--no" for="no-${opcion.id}">NO</label>
        </div>
      `;

      preguntas.appendChild(contenedor); // Lanzarlo dentro del contenedor visual masivo
      cont++; // Sube y repite pero con un número textual más grande
    });

    // Control Matemático para los botones laterales enormes
    atras.disabled = paginaActual === 1; // Apaga el botón de regresar evidentemente si recién comenzaste
    atras.dataset.page = paginaActual - 1;

    // Cambia el texto del botón al transicionar. Cuando falte poco para acabar, este mutará a gritar "Evaluar!" en vez de "Siguiente"
    siguiente.textContent = paginaActual === cantidad ? "Evaluar" : "Siguiente";
    siguiente.dataset.page =
      paginaActual === cantidad ? "fin" : paginaActual + 1; // Etiqueta oculta finalizadora de sesión

    window.procesoPeticion = false; // Devuelve el control del sistema de regreso
  }

  /**
   * Rutina para avanzar de golpe o por toques al resto de las páginas
   */
  function cambiarPagina(nuevaPagina) {
    if (nuevaPagina === paginaActual) return; // Si la oprime 2 veces nada pasa

    // Apaga estéticamente el brillo del tab pasado 
    document
      .querySelector(`[data-page="${paginaActual}"]`)
      ?.classList.remove("paginado__numero--activo");

    paginaActual = Number(nuevaPagina); // Lo pasa a número real 

    // Otorga el brillo especial de "lugar activo" sobre el númerito recientemente oprimido o activado.
    document
      .querySelector(`[data-page="${paginaActual}"]`)
      ?.classList.add("paginado__numero--activo");

    // Envía orden final llamando al pintor de cajas (Rutina Central anterior)
    cargarPagina();
  }

  // Detecta el toque o clic del paciente encima de cualquier bolita numérica (1, 2, 3...)
  paginado.addEventListener("click", (e) => {
    const page = e.target.dataset.page;
    if (page && !window.procesoPeticion) cambiarPagina(page);
  });

  // Vigila todo el toque maestro del bloque Inferior que abriga a los botones Previos y Siguientes de tamaño gigante
  document.querySelector(".botonera").addEventListener("click", async (e) => {
    // Escenario 1: Tocó el botón grande justo en el final (La etiqueta final le dicta a la nave terminar y evaluar)
    if (e.target.dataset.page === "fin" && !window.procesoPeticion) {
      await evaluarTest(); // Detonador supremo calificador
      return;
    }

    // Escenario 2: Rutina repetitiva y ordinaria, manda a saltar a la página que toca.
    if (e.target.dataset.page) {
      cambiarPagina(e.target.dataset.page);
    }
  });

  // Guardador Inteligente Maestro. Localiza cualquier click dado sobre una Pregunta (SI / NO)
  preguntas.addEventListener("change", (e) => {
    if (e.target.type !== "radio") return; // Impedimento para prevenir engaños del click.

    // Recordatorio instantáneo en Memoria RAM del teléfono/Móvil. Ejem ("Opcion pregunta 2, dijo: CIERTO/SI")
    // localStorage.setItem(e.target.name, e.target.value);

    testRespuestas.respuesta[e.target.name] = e.target.value; //Se integra la logica del objeto

    // Matemáticas dinámicas para dar puntaje interno.
    // Solo Otorga 1 Punto a su favor, SI NO posee peligrosidad extrema y al mismo tiempo SÍ contestó favorablemente con un TRUE / SI.
    if (!e.target.closest(".preguntas__contendor--precaucion") && e.target.value == "true") {

      // localStorage.setItem(`puntaje-${e.target.name}`, e.target.value); // Crea token interno llamado Puntaje para rastreo

      testRespuestas.puntaje[`puntaje-${e.target.name}`] = true;
      console.log(`puntaje-${e.target.name}, ${e.target.value}`);
    } 

    // Por ende Restador Definitivo: Si antes pulsó que SÍ, pero ahora recapacitó por un trágico NO... Destruimos el puntaje y se lo restamos al global
    else if (e.target.value == "false") {
      // localStorage.removeItem(`puntaje-${e.target.name}`);

      delete testRespuestas.puntaje[`puntaje-${e.target.name}`]
      console.log(`puntaje-${e.target.name}, ${e.target.value}`);
    }

    testRespuestas.contador = Object.keys(testRespuestas.puntaje).length; // El contador toma datos numericos del puntaje con .length, el puntaje solo tomara los datos existentes "= true", ya que los datos "= false" son eliminados
    console.log(`Respuesta SI: ${testRespuestas.contador}`); // visualizar en consola cuantas respuestas "SI" fueron marcadas

  });


  /**
   * Evaluador Final: Culmina recogiendo uno por uno cada Token respondido de la RAM y revisando los "SI/NO",
   * luego los comunica 1 por 1 al Servidor y emite una condena de Si esta o no Aptada para ingresar a la plataforma.
   */
  async function evaluarTest()
   {
    const preguntaContinuar = await alerta.alertaQuest("¿Seguro que deseas enviar el test de vulnerabilidad?",);
    if (!preguntaContinuar.isConfirmed) return // Anular si la respuesta fue un simple No de cancelación
    
    siguiente.disabled = true;
    window.procesoPeticion = true
    
    // Chequeo Masivo Exigido a Servidor: Lista de nuevo TODA la biblia de preguntas inamovibles
    const verPreguntas = await api.get("vulnerableQuestions");

    // Registro o Inventario Contable del rendimiento
    let total = 0; // Preguntas que existían en verdad obligatoriamente
    let respondidas = 0; // Lo que el usuario intentó llenar
    let puntos = 0; // Calificación Oficial lograda en Puntos de Salvación

    // Revisión Pregunta x Pregunta usando un Bucle sobre aquello resuelto
    verPreguntas.forEach((p) => {
      // Ignora posibles preguntas Basura que el Director allá decidió "Apagar o Esconder", evitando colapsar al que llenó la planilla
      if (!p.is_active) {
        window.procesoPeticion = false
        siguiente.disabled = false;
        return;
      }
      total++; // +1 Pregunta legal y contable a calificar
      
      // const respuesta = localStorage.getItem(`opcion-${p.id}`); // Búsqueda de la solución en su memoria Móvil

      const respuesta = testRespuestas.respuesta[`opcion-${p.id}`];
      
      if (respuesta !== null) respondidas++; // Sumatoria informando de que al menos fue llena
      
      // Regla Contable: Solo se gana el punto deseado sí no es una advertencia mortal (Caution) 
      // y sumado a eso, el servidor logra hallar que sí poseía el famoso Token guardador en RAM de "Puntaje"
      if (
        !p.question_caution &&
        // localStorage.getItem(`puntaje-opcion-${p.id}`)
        testRespuestas.puntaje[`puntaje-opcion-${p.id}`]
        
      ) {

        puntos++;
      }

      // Todo aqui funciona correctamente, respuesta tienen como trabajo asegurarse de la cantidad de respuestas almacenadas en la propiedad respuesta lo que aumentara el contador de "respondidas"
      // Los datos almacenados en la propiedad de puntaje en el objeto solo guarda respuestas = true, por lo que los puntos seran iguales a la cantidad de opciones = true que hayan
      // Esto servira para la creacion de comparaciones y convalidaciones antes de enviar los puntos del test
    });

    // VEREDICTO DE TRAMPA/ERROR: El Voluntario no rellenó la cantidad adecuada (Se comió y saltó alguna pregunta)
    if (respondidas < total) {
      // Advertencia en color Rojo/Amarillo
      await alerta.alertaWarning(`No ha respondido todas (${respondidas}/${total})`);
      window.procesoPeticion = false
      siguiente.disabled = false;
      return;  // Se aborta y no se envía nada
    }

    // Animación Circular pesada de Espera pues está al lado de confirmarse todo
    alerta.alertaLoading();
    
    // Serie Síncrona pesada de Guardado. Envía paquete de información de cada respueta 1 x 1 de regreso al origen general
    for (const p of verPreguntas) {
      if (!p.is_active) {
        window.procesoPeticion = false;
        siguiente.disabled = false;
        // return;
        continue; // Si la pregunta no estaba activa, no la envía pero sigue con la siguiente sin abortar todo el proceso
      }
      // Trasteando el mapa relacional estricto con sus ID correspondientes 
      const datos = {
        vulnerable_question_id: p.id,
        family_plan_id: id,
        // answer: localStorage.getItem(`opcion-${p.id}`) === "true", // Conversión exacta de lenguaje
        answer: testRespuestas.respuesta[`opcion-${p.id}`]==='true',
      }
      
      // Emitir este objeto directamente
      await api.post("vulnerableTest", datos);

      // Limpiador Apto: Acabar los archivos de chatarra que ya no sirven del dispositivo personal (RAM limpia en celular)
      // localStorage.removeItem(`opcion-${p.id}`);
      // localStorage.removeItem(`puntaje-opcion-${p.id}`);
      // No se necesita remover el localstorage si est ya no existe en una primera instancia, el objeto de borra por si solo una vez se cambia de vista
    }

    // Fin Proceso de limpieza y cierre
    alerta.alertaLoadingCerrar();
    
    // RESULTADO CUALITATIVO REPROBADO: MÍNIMO INCLUYENTE PUNTOS < 5!
    if (puntos < 5) {
      // Advertencia: La familia tiene grandes grietas y no rige bajo ciertos planes deseados.
      await alerta.alertaWarning("El plan familiar presentado no cumple con los requisitos y lineamientos establecidos para su aprobación, se redigira a la vista home",);
      try {
        // Enlaza por detrás al status base con la palabra del rechazo numérico absoluto tipo 2.
        const data = await api.patch(`familyPlans/status/${id}`, {
          status_plan_id: 2, // 2 = RECHAZADO
        });
        
        if (data.success) {
          window.location.href = `#/voluntario/`; // Deportado inevitablemente a su Dashboard
        } else alerta.alertaWarning(data.message, data.errors);
      } catch (error) {
        alerta.alertaError(error.errors);
      }
      
      window.procesoPeticion = false;
      siguiente.disabled = false;
      return; // SE CORTA EL BLOQUE COMPLETO
    }

    // VEREDICTO FINAL DE APROBACIÓN (Mayor O Igual a 5 puntos pasables)
    try {
      // Emite una orden cambiando el estado para que deje la familia de ser borrador y pase a En Desarrollo.
      const data = await api.patch(`familyPlans/${id}/change-status`, {
        status_plan_id: 3, // 3 = EN DESARROLLO / APROBADO BÁSICO
      });
      if (data.success) {
        // Ejecución Completada sin hacer mucho ruido.
      } else alerta.alertaWarning(data.message, data.errors);
    } catch (error) {
      alerta.alertaError(error.errors);
    }
    
    // Alerta Verde Bonita Éxito
    await alerta.alertaOK("Test evaluado con éxito");
    // Dirige al Voluntario al ÚLTIMO paso legal y obligatorio, con el controlador que averigua la dirección exacta (Identificación final)
    location.href = `#/voluntario/plan_familiar/identificacion?id=${id}`;
  }
};
