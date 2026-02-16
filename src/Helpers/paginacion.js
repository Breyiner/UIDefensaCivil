import * as api from "./api";
export default async (peticion,mensajeVacio,carta,funcionBotones) => {
    const container = document.querySelector(".container__paginas");
    const containerPaginador = document.querySelector(".container__paginador")

    let paginaActual = 1;

    const paginas = await api.getPaginacion(peticion);
    const cantidad = paginas.paginate.last_page;
    
    const evaluacion = await evaluarDatos();    
    if (!evaluacion)
    {
        await paginacion();
        await cargarPagina();
        if (paginas.paginate.total <= paginas.paginate.per_page)
        {
            containerPaginador.classList.add("invisible");
        }
        window.procesoPeticion = false
    }
    else{
        container.innerHTML = `<div class="noCantidad">${mensajeVacio}</div>`
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
        await funcionBotones(e);
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
        const datos = await api.get(`${peticion}?page=${paginaActual}`);
        for (const dat in datos)
        {
                let info = datos[dat];
                const cartaInfo = await carta(info);
                container.appendChild(cartaInfo);
        }
    }

    async function evaluarDatos()
    {
        if (paginas.paginate.total == 0)
        {
            return true
        }

        return false; 
    }
}