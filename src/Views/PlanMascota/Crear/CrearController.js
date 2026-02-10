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
        if (confirmacion.isConfirmed) location.href = `#/planMascota/ver/id=${id}`;}
    
    // Inputs de texto
    const nombre = document.querySelector('.input__nombre');
    const raza = document.querySelector('.input__raza');
    const edad = document.querySelector('.input__edad');
    // Selects
    const especie = document.querySelector('.input__especie');
    await adjuntarOpc.adjuntar(especie,"species");
    window.procesoPeticion = false;
    boton.disabled = false;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        window.procesoPeticion = true
        boton.disabled = true;
    
        const datosRegistro = {
            names: nombre.value,
            last_names: raza.value,
            birth_date: edad.value,
            blood_group_id: especie.value,
        };
        try {
            const data = await api.post(`pets/${id}`,datosRegistro);
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