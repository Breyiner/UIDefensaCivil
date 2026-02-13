import * as api from "../../Helpers/api";
import * as alerta from "../../Helpers/alertas";

export default async () => {
  const botonBack = document.getElementById("boton-back");
  const crear = document.getElementById("crear");
  const id = location.hash.split("=")[1];
  const container = document.querySelector(".container__verRiesgo");
  const containerPaginador = document.querySelector(".container__paginador");

  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = true;
  }
  botonBack.onclick = () => {
    if (window.procesoPeticion) return;
    location.href = `#/verPlanFamiliar/menu/id=${id}`;
  };

  let paginaActual = 1;

  const paginas = await api.get(`riskFactors/familyPlan/${id}`);
  const cantidad = paginas.last_page;

  const evaluacion = await evaluarDatos();

  if (!evaluacion) {
    await paginacion();
    await cargarPagina();
    window.procesoPeticion = false;
  } else {
    container.innerHTML = `<div class="noCantidad">No tienes ningun factor de riesgo en la familia.</div>`;
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

    const datos = await api.get(`riskFactors/familyPlan/${id}?page=${paginaActual}`,
    );
    const riesgos = datos.data;
    for (const index in riesgos) {
        const info = riesgos[index];
        const cartaInfo = document.createElement("div");
        cartaInfo.classList.add("verRiesgos");
        console.log(info);
        cartaInfo.innerHTML = `
            <div class="verRiesgos__tipoRiesgo">
                <i class="ri-error-warning-line"></i>${info.threat_type.name}</div>
            <div class="verRiesgos__ubicacion">
                <i class="ri-map-2-line"></i>${info.ubication}</div>
            <div class="verRiesgos__distancia">
                <i class="ri-map-pin-line"></i>${info.distance} m</div>
            <div class="verRiesgos__descripcion">
                <p>Descripción:</p>${info.description}
            </div>
            <button class="boton boton--azul verRiesgos__boton--editar" data-id="${info.id}">Editar</button>
            <button class="boton boton--azul verRiesgos__boton--eliminar" data-id="${info.id}">Eliminar</button>
            <button class="boton verRiesgos__boton--verMas" data-id="${info.id}">Ver más</button>
        `;
        container.appendChild(cartaInfo);
    }
  }


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
      const datos = await api.get(`pets/${id}`);
      const condiciones = await api.get(`petVaccines/pet/${id}`);

      let condicionVacunas = ""
      let contadorCondicionVacunas = 0

      condiciones.forEach(condicion =>
      {
        contadorCondicionVacunas > 0 ? condicionVacunas += ","+condicion.name : condicionVacunas += condicion.name;
        contadorCondicionVacunas++;
        contadorCondicionVacunas == 0 ? condicionVacunas = "ninguna" : "";
      });

      if (condiciones.length == 0){
        condicionVacunas = "ninguna";
      }
      
      const htmlModal = `
        <div class="modalVer modal">
            <div class="modalVer__dato">
                <i class="ri-coupon-line"></i>
                <div class="modalVer__titulo">Nombre</div>
                <div class="modalVer__texto">${datos.name}</div>
            </div>
            <div class="modalVer__dato">
                <i class="ri-dna-line"></i>
                <div class="modalVer__titulo">Raza</div>
                <div class="modalVer__texto">${datos.breed}</div>
            </div>
            <div class="modalVer__dato">
                <i class="ri-cake-2-line"></i>
                <div class="modalVer__titulo">Edad</div>
                <div class="modalVer__texto">${datos.age}</div>
            </div>
            <div class="modalVer__dato">
                <i class="ri-bell-line"></i>
                <div class="modalVer__titulo">Especie</div>
                <div class="modalVer__texto">${datos.species.name}</div>
            </div>
            <div class="modalVer__dato modalVer__dato--largo">
                <i class="ri-syringe-line"></i>
                <div class="modalVer__titulo">Vacunas</div>
                <div class="modalVer__texto">${condicionVacunas}</div>
            </div>
        </div>`;
      alerta.Ver(htmlModal, false, false, null, null);
    }
  });

  crear.addEventListener("click", async () => {
    location.href = `#/planRiesgo/crear/id=${id}`;
  });
};
