/**
 * Controlador Catálogo: Seccionales (seccionalesController.js)
 * Gestiona la entidad principal geográfica (Seccional) a la que pertenecen
 * diferentes organizaciones de voluntarios. Renderiza su lista y formulario modal.
 */
import * as seccional from "../../../../helpers/modales/seccional";
import * as api from "../../../../helpers/api";
import { verEstado_ventana } from "../../../../componentes/ver_Estado/verEstado_ventana";

export default async () => {
    // const datos = await api.get("sectionals/");

    const botonBack = document.getElementById("botonBack");
    if (window.procesoPeticion === undefined) {
        window.procesoPeticion = false;
    }
    window.procesoPeticion = false;

    botonBack.onclick = async () => {
        if (window.procesoPeticion) return;
        location.href = `#/administrador-datosMaestros/`;
    };

    const botonCrear = document.querySelector('#crearSeccional');


    const recargar = async () => {
        const datos = await api.get("sectionals/");
    
        const contenedor = document.querySelector(".listaDatos");
        contenedor.innerHTML = ""; // limpiar antes de repintar

        datos.forEach(dato => {

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

            boton.addEventListener("click", () => {
                verEstado_ventana("Seccional",dato,"sectionals",recargar);
            });

            contenedor.append(boton);
        });
    };

    await recargar();

    // BOTÓN CREAR  
    botonCrear.addEventListener("click", () => {
        seccional.crear(recargar);
    });

};
