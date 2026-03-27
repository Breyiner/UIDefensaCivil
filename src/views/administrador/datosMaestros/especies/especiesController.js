/**
 * Controlador Catálogo: Especies (especiesController.js)
 * Renderiza la lista completa de especies animales soportadas por el sistema.
 * Configura los botones de crear nuevo registro y los inyecta en el DOM interactivo.
 */
import * as especie from "../../../../helpers/modales/especie";
import * as api from "../../../../helpers/api.js";
import { verEstado_input } from "../../../../componentes/ver_Estado/varianteEstados.js";

export default async () => {

    const botonBack = document.getElementById("botonBack");

    if (window.procesoPeticion === undefined) {
        window.procesoPeticion = false;
    }
    window.procesoPeticion = false;

    botonBack.onclick = async () => {
        if (window.procesoPeticion) return;
        location.href = `#/administrador/datos_maestros/`;
    };

    const botonCrear = document.querySelector('#crearEspecie');

    // Función para recargar la lista
    const recargar = async () => {
        const datos = await api.get("species/");

        
        const contenedor = document.querySelector(".listaDatos");
        contenedor.innerHTML = ""; // limpiar antes de repintar
        
        datos.forEach(dato => {

            const urlHistorial = `#/administrador/datos_maestros/especies/historial?id=${dato.id}`;
            
            const boton = document.createElement("button");
            boton.classList.add("listaDatos__valor");
            if (!dato.is_active) boton.classList.add("listaDatos__Inactivo");
            boton.dataset.id = dato.id;

            const span = document.createElement("span");
            span.classList.add("listaDatos__nombre");

            const icono = document.createElement("i");
            icono.classList.add("ri-eye-line");

            const texto = document.createTextNode(
                ` ${dato.name} - ${dato.is_active ? "Activo" : "Inactivo"}`
            );

            span.append(icono, texto);
            boton.append(span);

            const datoText = {

                //Nombres en DB
                nameDB:"name",

                datoNombre: "Especie",

                urlDato: "species",
            }
        

            boton.addEventListener("click", () => {
                verEstado_input(dato, recargar, urlHistorial, datoText);
            });

            contenedor.append(boton);
        });
    };

    // Cargar lista inicial
    await recargar();

    // BOTÓN CREAR  
    botonCrear.addEventListener("click", () => {
        especie.crear(recargar);
    });

};
