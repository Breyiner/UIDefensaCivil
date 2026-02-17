import * as api from "../../../../Helpers/api";
import * as alerta from "../../../../Helpers/alertas";
import * as adjuntarOpc from "../../../../Helpers/adjuntarOpciones";

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
    const genero = document.querySelector('.input__genero');
    await adjuntarOpc.adjuntar(especie,"species");
    await adjuntarOpc.adjuntar(genero,"animalGenders");

    window.procesoPeticion = false;
    boton.disabled = false;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        window.procesoPeticion = true
        boton.disabled = true;
    
        const datosRegistro = {
            name: nombre.value,
            breed: raza.value,
            age: edad.value,
            species_id: especie.value,
            animal_gender_id: genero.value,
            family_plan_id: id
        };
        try {
            const data = await api.post(`pets`,datosRegistro);
            if (data.success)
                {
                    await alerta.alertaOK(data.message)
                    const pregunta = await alerta.alertaQuest("Deseas agregar las vacunas de esta mascota?")
                    pregunta.isConfirmed ? window.location.href = `#/planMascota/editar/id=${id},${data.data.id}` : location.href = `#/planMascota/ver/id=${id}`;
                }
            else alerta.alertaWarning(data.message,data.errors)
        } catch (error) {
            alerta.alertaError(error.errors);
        }
    
        boton.disabled = false;
        window.procesoPeticion = false;
    });
}