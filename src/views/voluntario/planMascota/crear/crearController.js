import * as api from "../../../../helpers/api";
import * as alerta from "../../../../helpers/alertas";
import * as adjuntarOpc from "../../../../helpers/adjuntarOpciones";

export default async () => {
    const botonBack = document.getElementById("botonBack");
    const botonGuardar = document.querySelector('.form__boton');
    const form = document.querySelector('.form');
    const id = location.hash.split("=")[1];

    if (window.procesoPeticion === undefined) { window.procesoPeticion = true; }
    window.procesoPeticion = true;

    botonBack.onclick = async () => {
        if (window.procesoPeticion) return;
        const confirmacion = await alerta.alertaQuest("¿Seguro que quieres volver? perderás tu progreso");
        if (confirmacion.isConfirmed) location.href = `#/voluntario-planMascota/ver/id=${id}`;
    };

    // Inputs de texto
    const nombre = document.getElementById('nombre');
    const raza = document.getElementById('raza');
    const edad = document.getElementById('edad');
    // Selects
    const especies = document.getElementById('especies');
    const generos = document.getElementById('generos');
    await adjuntarOpc.adjuntar(especies, "species");
    await adjuntarOpc.adjuntarNoValida(generos, "animalGenders");

    window.procesoPeticion = false;
    botonGuardar.disabled = false;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        window.procesoPeticion = true
        botonGuardar.disabled = true;

        const datosRegistro = {
            name: nombre.value,
            breed: raza.value,
            age: edad.value,
            species_id: especies.value,
            animal_gender_id: generos.value,
            family_plan_id: id
        };
        try {
            const data = await api.post(`pets`, datosRegistro);
            if (data.success) {
                await alerta.alertaOK(data.message)
                const pregunta = await alerta.alertaQuest("Deseas agregar las vacunas de esta mascota?")
                pregunta.isConfirmed ? window.location.href = `#/voluntario-planMascota/editar/id=${id},${data.data.id}` : location.href = `#/voluntario-planMascota/ver/id=${id}`;
            }
            else alerta.alertaWarning(data.message, data.errors)
        } catch (error) {
            alerta.alertaError(error.errors);
        }

        botonGuardar.disabled = false;
        window.procesoPeticion = false;
    });
}