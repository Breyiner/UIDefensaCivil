import * as api from "../../../Helpers/api";
import * as alerta from "../../../Helpers/alertas";
import * as adjuntarOpc from "../../../Helpers/adjuntarOpciones";

export default async () => {
    const botonBack = document.getElementById("boton-back");
    const botonAcordeon = document.querySelector(".acordeon__nombre");
    const acordeonContenido = document.getElementById("acordeon__container");
    const id = location.hash.split("=")[1];
    const planId = id.split(",")[0];
    const integranteId = id.split(",")[1];
    
    // Inputs de texto
    const nombres = document.querySelector('.input__nombres');
    const apellidos = document.querySelector('.input__apellidos');
    const numDocumento     = document.querySelector('.input__numDocumento');
    const eps              = document.querySelector('.input__eps');
    const celular          = document.querySelector('.input__celular');
    const nacimiento       = document.querySelector('.input__nacimiento');

    // Selects
    const tipoDocumento   = document.querySelector('.input__tipoDocumento');
    const genero          = document.querySelector('.input__genero');
    const parentesco      = document.querySelector('.input__parentesco');
    const grupoSanguineo  = document.querySelector('.input__grupoSanguineo');
    const nacionalidad    = document.querySelector('.input__nacionalidad');

    botonBack.addEventListener("click", async () => {
            const confirmacion = await alerta.alertaQuest("¿Seguro que quieres volver? perderás tu progreso");
            if (confirmacion.isConfirmed) location.href = `#/planIntegrante/ver/id=${planId}`;
    });

    botonAcordeon.addEventListener("click", (e) => {    
        
        if (acordeonContenido.classList.contains("acordeon__contenido--oculto"))
        {
            acordeonContenido.classList = "acordeon__contenido";
        }
        else if (acordeonContenido.classList.contains("acordeon__contenido"))
        {
            acordeonContenido.classList = "acordeon__contenido--oculto";
        }
    });
}