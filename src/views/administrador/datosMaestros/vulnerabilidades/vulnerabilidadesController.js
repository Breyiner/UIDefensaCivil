/**
 * Controlador Catálogo: Vulnerabilidades Físicas/Estructurales (vulnerabilidadesController.js)
 * Maneja el catálogo de vulnerabilidades con las que se puede asociar una evaluación
 * de Riesgo. Utiliza los helpers básicos de lista paginada y modal.
 */
import * as vulnerabilidad from "../../../../helpers/modales/vulnerabilidad";
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
// vulnerabilities
    const botonCrear = document.querySelector('#crearVulnerabilidad');

    // Función para recargar la lista
    const recargar = async () => {
        const datos = await api.get("vulnerabilities/");

        
        const contenedor = document.querySelector(".listaDatos");
        contenedor.innerHTML = ""; // limpiar antes de repintar
        
        datos.forEach(dato => {

            const urlHistorial = `#/administrador/datos_maestros/vulnerabilidades/historial?id=${dato.id}`;
            
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

                datoNombre: "Vulnerabilidad",

                urlDato: "vulnerabilities",
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
        vulnerabilidad.crear(recargar);
    });

};
