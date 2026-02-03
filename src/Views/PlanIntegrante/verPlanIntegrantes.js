import * as api from "../../Helpers/api";
import * as alerta from "../../Helpers/alertas";

export default async () => {
    const botonBack = document.getElementById("boton-back");
    const crear = document.getElementById("crear");
    const id = location.hash.split("=")[1];
    const container = document.querySelector(".container__verIntegrante");
    const containerPaginador = document.querySelector(".container__paginador");

    if (window.procesoPeticion === undefined) {
    window.procesoPeticion = true;
}
    let paginaActual = 1;

    const paginas = await api.get(`members/familyPlan/${id}`);
    const cantidad = paginas.last_page;
    
    const evaluacion = await evaluarDatos();

    if (!evaluacion)
    {
        await paginacion();
        await cargarPagina();
        window.procesoPeticion = false
    }
    else{
        container.innerHTML = `<div class="noPlan">No tienes ningun miembro de la familia.</div>`
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

        const datos = await api.get(`members/familyPlan/${id}?page=${paginaActual}`);
        const integrantes = datos.data;

        for (const index in integrantes) {
            const info = integrantes[index];
            const cartaInfo = document.createElement('div');
            cartaInfo.classList.add('verIntegrante');
            cartaInfo.innerHTML = `
                <div class="verIntegrante__nombre">${info.full_name}</div>
                <div class="verIntegrante__sangre">${info.blood_group}</div>
                <div class="verIntegrante__documento"><i class="ri-passport-line"></i>${info.document_number}</div>
                <div class="verIntegrante__telefono"><i class="ri-phone-line"></i>${info.phone}</div>
                <div class="verIntegrante__parentesco"><i class="ri-parent-line"></i>${info.kinship}</div>
                <div class="verIntegrante__edad"><i class="ri-cake-2-line"></i>${info.birth_date}</div>
                <button class="boton boton--azul boton__editar" data-id="${info.id}">Editar</button>
                <button class="boton boton--azul boton__eliminar" data-id="${info.id}">Eliminar</button>
                <button class="boton boton__vermas" data-id="${info.id}">Ver más</button>
            `;
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

    container.addEventListener('click',async (e) => {
    if (e.target.classList.contains('boton__editar')) {
        window.location.href = `#/planIntegrante/editar/id=${id},${e.target.dataset.id}`;
    }

    if (e.target.classList.contains('boton__eliminar')) {
        const confirmacion = await alerta.alertaQuest("¿Seguro que deseas eliminar este miembro de la familia?");
        if (!confirmacion.isConfirmed) return;
        const eliminado = await api.delet(`members/${id}/${e.target.dataset.id}`);
        if (eliminado.success) {
            await alerta.alertaOK(eliminado.message);
            await cargarPagina();
        }
        else alerta.alertaError(eliminado.message);
    }

    if (e.target.classList.contains('boton__vermas')) {
        console.log('Ver más ID:', e.target.dataset.id);
    }});
    
    botonBack.addEventListener("click", async () => {
        const confirmacion = await alerta.alertaQuest("¿Seguro que quieres volver? perderás tu progreso");
        if (confirmacion.isConfirmed) location.href = `#/verPlanFamiliar/menu/id=${id}`;
    });

    crear.addEventListener("click", async () => {
        location.href = `#/planIntegrante/crear/id=${id}`;
    });

}