import * as api from "../../../Helpers/api";
import * as alerta from "../../../Helpers/alertas";
import * as adjuntarOpc from "../../../Helpers/adjuntarOpciones";

export default async () => {
    const botonBack = document.getElementById("boton-back");
    const boton = document.querySelector('.form__boton');
    const form = document.querySelector('.form');
    const id = location.hash.split("=")[1];

    if (window.procesoPeticion === undefined) {window.procesoPeticion = true;} 
    window.procesoPeticion = true;

    botonBack.onclick = async() => {
    if(window.procesoPeticion) return;
    const confirmacion = await alerta.alertaQuest("¿Seguro que quieres volver? perderás tu progreso");
    if (confirmacion.isConfirmed) location.href = `#/planIntegrante/ver/id=${id}`;}
    
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
    
    await adjuntarOpc.adjuntar(tipoDocumento,"documentTypes");
    await adjuntarOpc.adjuntarNoValida(genero,"genders");
    await adjuntarOpc.adjuntarNoValida(parentesco,"kinships");
    await adjuntarOpc.adjuntarNoValida(grupoSanguineo,"bloodGroups");
    await adjuntarOpc.adjuntarNoValida(nacionalidad,"nationalities");

    window.procesoPeticion = false;
    boton.disabled = false;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        window.procesoPeticion = true
        boton.disabled = true;
    
        const datosRegistro = {
            names: nombres.value,
            last_names: apellidos.value,
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
                    console.log(data);
                    await alerta.alertaOK(data.message)
                    const pregunta = await alerta.alertaQuest("Deseas agregar las enfermedades/discapacidad/alergias/ de este integrante?")
                    pregunta.isConfirmed ? window.location.href = `#/planIntegrante/editar/id=${id},${data.data.id}` : location.href = `#/planIntegrante/ver/id=${id}`;
                }
            else alerta.alertaWarning(data.message,data.errors)
        } catch (error) {
            alerta.alertaError(error.errors);
        }
    
        boton.disabled = false;
        window.procesoPeticion = false;
    });
}