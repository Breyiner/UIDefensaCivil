import * as api from "../../Helpers/api";
import * as alerta from "../../Helpers/alertas";

export default async () => {
    const container = document.querySelector(".container__verPlan");
    const containerPaginador = document.querySelector(".container__paginador");
    const botonBack = document.getElementById("boton-back");

    if (window.procesoPeticion === undefined) {
    window.procesoPeticion = true;
    }
    
    botonBack.onclick = () => {location.href = `#/home`;}

    let paginaActual = 1;

    const paginas = await api.get("histories/voluntario");
    const cantidad = paginas.last_page;
    
    const evaluacion = await evaluarDatos();

    if (!evaluacion)
    {
        await paginacion();
        await cargarPagina();
        window.procesoPeticion = false
    }
    else{
        container.innerHTML = `<div class="noCantidad">No tienes ningun plan familiar realizado.</div>`
        window.procesoPeticion = false;
    }

    containerPaginador.addEventListener("click", async (e) => {   
        if (e.target.classList.contains("paginador__numero") && !window.procesoPeticion)
        {
            if (paginaActual == e.target.id) return;
            paginaActual = e.target.id;
            paginacion();
            cargarPagina();
        }});
    container.addEventListener("click", async (e) => {
        if (e.target.classList.contains("verPlan__boton") && !window.procesoPeticion) 
        {
            location.href = `#/verPlanFamiliar/menu/id=${e.target.id}`;
        }
    })
  
    async function paginacion() {
        containerPaginador.innerHTML = "";
        if (cantidad <= 10)
        {
            for (let cont = 1; cont <= cantidad; cont++){
                const contenedor = document.createElement("button");
                contenedor.classList.add("paginador__numero");
                cont == paginaActual ? contenedor.classList.add("paginador__numero--activo") : "";
                contenedor.id = cont;
                contenedor.textContent = cont;
                containerPaginador.appendChild(contenedor);
            }
        }
        else{
            const botonAtras = document.createElement("button");
            botonAtras.classList.add("paginador__numero");
            botonAtras.id = paginaActual != 1 ? Number(paginaActual)-1 : paginaActual;
            botonAtras.innerHTML = `<i class="ri-arrow-left-wide-line"></i>`
            containerPaginador.appendChild(botonAtras);
            let numeroCasillas = 0;
            let numeroEmpieza = 0
            if (paginaActual != 1)
            {
                numeroEmpieza = paginaActual;
                numeroCasillas = Number(numeroEmpieza) + 9;
                if (numeroCasillas > cantidad)
                {
                    numeroCasillas = cantidad;
                    numeroEmpieza = Number(cantidad)-9 
                }
            }
            else{
                numeroCasillas = 10;
                numeroEmpieza = 1;
            }
            for (numeroEmpieza; numeroEmpieza <= numeroCasillas; numeroEmpieza++){
                const contenedor = document.createElement("button");
                contenedor.classList.add("paginador__numero");
                numeroEmpieza == paginaActual ? contenedor.classList.add("paginador__numero--activo") : "";
                contenedor.id = numeroEmpieza;
                contenedor.textContent = numeroEmpieza;
                containerPaginador.appendChild(contenedor);
            }
            const botonSiguiente = document.createElement("button");
            botonSiguiente.classList.add("paginador__numero");
            botonSiguiente.id = (Number(paginaActual)+1) > cantidad ? cantidad : Number(paginaActual)+1;
            botonSiguiente.innerHTML = `<i class="ri-arrow-right-wide-line"></i>`;
            containerPaginador.appendChild(botonSiguiente);
        }
    }

    async function cargarPagina() {
        container.innerHTML = "";
        const datos = await api.get(`histories/voluntario?page=${paginaActual}`);
        const planes = datos.data
        for (const plan in planes)
        {
                let info = planes[plan];
                let cartaInfo = document.createElement('div');
                cartaInfo.innerHTML = `
                    <div class="verPlan__icono"><i class="ri-parent-fill"></i></div>
                    <div class="verPlan__apellidos">${info.family_plan.last_names}</div>
                    <div class="verPlan__estado verPlan__estado--naranja">${info.action.name}</div>
                    <div class="verPlan__detalles--ubicacion">
                        <i class="ri-map-pin-line"></i>${info.family_plan.city.apartment.name} - ${info.family_plan.city.name}
                    </div>
                    <div class="verPlan__detalles--fecha">
                        <i class="ri-calendar-event-fill"></i>Ultima Edicion: ${info.date}
                    </div>
                    <button class="verPlan__boton boton" id=${info.family_plan.id}>Revisar Plan</button>`;
                cartaInfo.classList.add('verPlan');
                container.appendChild(cartaInfo);
        }
    }

    async function evaluarDatos()
    {
        if (paginas.data.length == 0)
        {
            return true
        }

        return false;           
    }
}