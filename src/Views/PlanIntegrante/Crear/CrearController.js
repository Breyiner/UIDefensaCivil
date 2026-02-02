import * as api from "../../../Helpers/api";
import * as alerta from "../../../Helpers/alertas";
import * as adjuntarOpc from "../../../Helpers/adjuntarOpciones";

export default async () => {
    const botonBack = document.getElementById("boton-back");
    const boton = document.querySelector('.form__boton');
    const form = document.querySelector('.form');
    const id = location.hash.split("=")[1];

    // Inputs de texto
    const nombresApellidos = document.querySelector('.input__nombresApellidos');
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

    if (window.procesoPeticion === undefined) {
        window.procesoPeticion = false;
    }  
    await adjuntarOpc.adjuntar(tipoDocumento,"documentTypes");
    await adjuntarOpc.adjuntarNoValida(genero,"genders");
    await adjuntarOpc.adjuntarNoValida(parentesco,"kinships");
    await adjuntarOpc.adjuntarNoValida(grupoSanguineo,"bloodGroups");
    await adjuntarOpc.adjuntarNoValida(nacionalidad,"nationalities");

    boton.disabled = false;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        window.procesoPeticion = true
        boton.disabled = true;
    
        const datosRegistro = {
            names: nombresApellidos.value,
            last_names: nombresApellidos.value,
            birth_date: nacimiento.value,
            blood_group_id: grupoSanguineo.value,
            document_type_id: tipoDocumento.value,
            document_number: numDocumento.value,
            nationality_id: nacionalidad.value,
            gender_id: genero.value,
            kinship_id: parentesco.value,
            eps: eps.value,
            phone: celular.value,
        };
        try {
            const data = await api.post(`members/${id}`,datosRegistro);
            if (data.success)
                {
                    await alerta.alertaOK(data.message)
                    window.location.href = `#/planIntegrante/ver/id=${id}`;
                }
            else alerta.alertaWarning(data.message,data.errors)
        } catch (error) {
            alerta.alertaError(error.errors);
        }
    
        boton.disabled = false;
        window.procesoPeticion = false;
    });

    botonBack.addEventListener("click", async () => {
        const confirmacion = await alerta.alertaQuest("¿Seguro que quieres volver? perderás tu progreso");
        if (confirmacion.isConfirmed) location.href = `#/planIntegrante/ver/id=${id}`;
    });
}