import * as api from "../../Helpers/api";
import * as alerta from "../../Helpers/alertas";

export default async () => {
  const botonBack = document.getElementById("boton-back");
  const crear = document.getElementById("crear");
  const id = location.hash.split("=")[1];
  const container = document.querySelector(".container__verMascota");
  const containerPaginador = document.querySelector(".container__paginador");

  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = true;
  }
  botonBack.onclick = () => {
    if (window.procesoPeticion) return;
    location.href = `#/verPlanFamiliar/menu/id=${id}`;
  };

  let paginaActual = 1;

  const paginas = await api.get(`pets/familyPlan/${id}`);
  const cantidad = paginas.last_page;

  const evaluacion = await evaluarDatos();

  if (!evaluacion) {
    await paginacion();
    await cargarPagina();
    window.procesoPeticion = false;
  } else {
    container.innerHTML = `<div class="noCantidad">No tienes ninguna mascota en la familia.</div>`;
    window.procesoPeticion = false;
  }

  containerPaginador.addEventListener("click", async (e) => {
    if (
      e.target.classList.contains("paginador__numero") &&
      !window.procesoPeticion
    ) {
      if (paginaActual == e.target.id) return;
      paginaActual = e.target.id;
      paginacion();
      cargarPagina();
    }
  });

  async function paginacion() {
    containerPaginador.innerHTML = "";
    if (cantidad <= 10) {
      for (let cont = 1; cont <= cantidad; cont++) {
        const contenedor = document.createElement("button");
        contenedor.classList.add("paginador__numero");
        cont == paginaActual
          ? contenedor.classList.add("paginador__numero--activo")
          : "";
        contenedor.id = cont;
        contenedor.textContent = cont;
        containerPaginador.appendChild(contenedor);
      }
    } else {
      const botonAtras = document.createElement("button");
      botonAtras.classList.add("paginador__numero");
      botonAtras.id =
        paginaActual != 1 ? Number(paginaActual) - 1 : paginaActual;
      botonAtras.innerHTML = `<i class="ri-arrow-left-wide-line"></i>`;
      containerPaginador.appendChild(botonAtras);
      let numeroCasillas = 0;
      let numeroEmpieza = 0;
      if (paginaActual != 1) {
        numeroEmpieza = paginaActual;
        numeroCasillas = Number(numeroEmpieza) + 9;
        if (numeroCasillas > cantidad) {
          numeroCasillas = cantidad;
          numeroEmpieza = Number(cantidad) - 9;
        }
      } else {
        numeroCasillas = 10;
        numeroEmpieza = 1;
      }
      for (numeroEmpieza; numeroEmpieza <= numeroCasillas; numeroEmpieza++) {
        const contenedor = document.createElement("button");
        contenedor.classList.add("paginador__numero");
        numeroEmpieza == paginaActual
          ? contenedor.classList.add("paginador__numero--activo")
          : "";
        contenedor.id = numeroEmpieza;
        contenedor.textContent = numeroEmpieza;
        containerPaginador.appendChild(contenedor);
      }
      const botonSiguiente = document.createElement("button");
      botonSiguiente.classList.add("paginador__numero");
      botonSiguiente.id =
        Number(paginaActual) + 1 > cantidad
          ? cantidad
          : Number(paginaActual) + 1;
      botonSiguiente.innerHTML = `<i class="ri-arrow-right-wide-line"></i>`;
      containerPaginador.appendChild(botonSiguiente);
    }
  }

  async function cargarPagina() {
    container.innerHTML = "";

    const datos = await api.get(`pets/familyPlan/${id}?page=${paginaActual}`,
    );
    const mascotas = datos.data;
    for (const index in mascotas) {
      const info = mascotas[index];
      const cartaInfo = document.createElement("div");
      cartaInfo.classList.add("verMascotas");
      cartaInfo.innerHTML = `
            <div class="verMascotas__icono"><img src="icon/${await adaptarIcono(info.species.name)}.svg"></div>
            <div class="verMascotas__nombre">${info.name}</div>
            <div class="verMascotas__datos">${info.species.name} - ${info.breed}</div>
            <div class="verMascotas__edad">${info.age} años</div>
            <div class="verMascotas__generoIcono ${info.animal_gender_id == 1 ? "" : "verMascotas__generoIcono--hembra"}"><i class="ri-${info.animal_gender_id == 1 ? 'men' : 'women'}-line"></i></div>
            <div class="verMascotas__genero"><span>${info.animal_gender.name}</span></div>
            <button class="boton boton--azul verMascotas__boton--editar" data-id="${info.id}">Editar</button>
            <button class="boton boton--azul verMascotas__boton--eliminar" data-id="${info.id}">Eliminar</button>
            <button class="boton verMascotas__boton--verMas">Ver más</button>
            `;
      container.appendChild(cartaInfo);
    }
  }

  async function adaptarIcono (animal) {
    switch (animal) {
        case "Perro":
        return "Perro";
        case "Gato":
        return "Gato";
        case "Conejo":
        return "Conejo";
        case "Ruedor":
        return "Ruedor";
        case "Ave":
        return "Ave";
        case "Insecto":
        return "Insecto";
        case "Pez":
        return "Pez";
        case "Rana":
        return "Rana";
        case "Serpiente":
        return "Serpiente";
        default:
        return "Pata";
    }};

  async function evaluarDatos() {
    if (paginas.data.length == 0) {
      return true;
    }

    return false;
  }

  container.addEventListener("click", async (e) => {
    if (e.target.classList.contains("verMascotas__boton--editar")) {
      window.location.href = `#/planMascota/editar/id=${id},${e.target.dataset.id}`;
    }

    if (e.target.classList.contains("verMascotas__boton--eliminar")) {
      const id = e.target.dataset.id;
      console.log(e.target);
      
      const confirmacion = await alerta.alertaQuest(
        "¿Seguro que deseas eliminar esta mascota de la familia?",
      );
      if (!confirmacion.isConfirmed) return;

      const eliminado = await api.delet(`pets/${id}`);
      if (eliminado.success) {
        await alerta.alertaOK(eliminado.message);
        await cargarPagina();
        await paginacion();
      } else alerta.alertaError(eliminado.message);
    }

    if (e.target.classList.contains("verMascotas__boton--verMas")) {
      const id = e.target.dataset.id;
      const datos = await api.get(`members/${id}`);
      const condiciones = await api.get(`conditionMembers/member/${id}`);

      let condicionNombre = ""
      let condicionMedicina = ""
      let contadorCondicionNombre = 0
      let contadorCondicionMedicina = 0

      condiciones.forEach(condicion =>
      {
        contadorCondicionNombre > 0 ? condicionNombre += ","+condicion.name : condicionNombre += condicion.name;
        contadorCondicionNombre++;
        if (condicion.dose != null)
        {
            contadorCondicionMedicina > 0 ? condicionMedicina += ","+condicion.dose : condicionMedicina += condicion.dose;
            contadorCondicionMedicina++;
        }
        contadorCondicionNombre == 0 ? condicionNombre = "ninguno" : "";
        contadorCondicionMedicina == 0 ? condicionNombre = "ninguno" : "";
      });

      if (condiciones.length == 0){
        condicionNombre = "ninguno";
        condicionMedicina = "ninguno";}
      
      const htmlModal = `
        <div class="modalVer modal">
            <div class="modalVer__dato">
                <i class="ri-user-line"></i>
                <div class="modalVer__titulo">Nombre</div>
                <div class="modalVer__texto">${datos.names}</div>
            </div>
            <div class="modalVer__dato">
                <i class="ri-user-line"></i>
                <div class="modalVer__titulo">Apellidos</div>
                <div class="modalVer__texto">${datos.last_names}</div>
            </div>
            <div class="modalVer__dato">
                <i class="ri-info-card-line"></i>
                <div class="modalVer__titulo">Tip documento </div>
                <div class="modalVer__texto">${datos.document_type.acronym}</div>
            </div>
            <div class="modalVer__dato">
                <i class="ri-id-card-line"></i>
                <div class="modalVer__titulo">Num documento</div>
                <div class="modalVer__texto">${datos.document_number}</div>
            </div>
            <div class="modalVer__dato">
                <i class="ri-calendar-line modalVer__icono"></i>
                <div class="modalVer__titulo">Fecha nacimiento</div>
                <div class="modalVer__texto">${datos.birth_date}</div>
            </div>
            <div class="modalVer__dato">
                <i class="ri-phone-line"></i>
                <div class="modalVer__titulo">Telefono</div>
                <div class="modalVer__texto">${datos.phone}</div>
            </div>
            <div class="modalVer__dato">
                <i class="ri-men-line"></i>
                <div class="modalVer__titulo">Genero</div>
                <div class="modalVer__texto">${datos.gender.name}</div>
            </div>
            <div class="modalVer__dato">
                <i class="ri-flag-line"></i>
                <div class="modalVer__titulo">Parentesco</div>
                <div class="modalVer__texto">${datos.kinship.name}</div>
            </div>
            <div class="modalVer__dato">
                <i class="ri-heart-pulse-line"></i>
                <div class="modalVer__titulo">Grupo Sanguineo</div>
                <div class="modalVer__texto">${datos.blood_group.name}</div>
            </div>
            <div class="modalVer__dato">
                <i class="ri-health-book-line"></i>
                <div class="modalVer__titulo">EPS</div>
                <div class="modalVer__texto">${datos.eps}</div>
            </div>
            <div class="modalVer__dato">
                <i class="ri-flag-line"></i>
                <div class="modalVer__titulo">Nacionalidad</div>
                <div class="modalVer__texto">${datos.nationality.name}</div>
            </div>
            <div class="modalVer__dato modalVer__dato--largo ${datos.novelty == null ? "invisible" : ""}">
                <i class="ri-parent-line"></i>
                <div class="modalVer__titulo">Novedad</div>
                <div class="modalVer__texto">${datos.novelty}</div>
            </div>
            <div class="modalVer__dato modalVer__dato--largo">
                <i class="ri-stethoscope-line"></i>
                <div class="modalVer__titulo">Afecciones</div>
                <div class="modalVer__texto">${condicionNombre}</div>
            </div>
            <div class="modalVer__dato modalVer__dato--largo">
                <i class="ri-capsule-fill"></i>
                <div class="modalVer__titulo">Medicinas o Dosis</div>
                <div class="modalVer__texto">${condicionMedicina}</div>
            </div>
        </div>`;
      alerta.Ver(htmlModal, false, false, null, null);
    }
  });

  crear.addEventListener("click", async () => {
    location.href = `#/planMascota/crear/id=${id}`;
  });
};
