import * as alerta from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";

export default async () => {
    const id = ((location.hash).split('='))[1];
    const form = document.querySelector('.form');
    const boton = document.querySelector('.form__boton');

    const input = document.getElementById('imagenInput');
    const preview = document.getElementById('preview');
    
    if (window.procesoPeticion === undefined) {
    window.procesoPeticion = false;
    }

    const existe = await api.getExiste(`housingInfo/${id}`);
    if (existe)
    {
        const url = await api.getImagen(`housingInfo/${id}`);
        preview.src = await url;
        preview.style.display = 'block';
    }

    input.addEventListener('change',() => {
        const file = input.files[0];
        if (!file) return;

        preview.src = URL.createObjectURL(file);
        preview.style.display = 'block';

        const formData = new FormData();
        formData.append('imagen', file);
        boton.disabled = false;
    });

    form.addEventListener('submit', async (e) => {
        const file = input.files[0];
        if (!file) return alerta.alertaWarning("Selecciona un archivo primero");

        e.preventDefault();
        window.procesoPeticion = true
        boton.disabled = true;
        const formData = new FormData();
        formData.append('path', file);
        formData.append('family_plan_id', id);

    try{
        if (existe) await api.destroy(`housingInfo/${id}`);
        
        const data = await api.postImagen(`housingInfo`,formData);
        if (data.success) {
            await alerta.alertaOK(data.message);
            window.location.href = `#/planFamiliar/identificacion/id=${id}`;
        } else {
            alerta.alertaWarning(data.message, data.errors);
        }
    } catch (error) {
        console.log(error);
        alerta.alertaError(error.errors);
    }
        boton.disabled = false;
        window.procesoPeticion = false;
    });

    window.addEventListener("click", async (e) => {
    if (e.target.matches(".header__botonBack") && !window.procesoPeticion) 
        {
        const pregunta = await alerta.alertaQuest('¿Seguro que quieres volver?');
        if (pregunta.isConfirmed)
        {
            window.location.href = `#/planFamiliar/identificacion/id=${id}`;
        }
        }
    });
}