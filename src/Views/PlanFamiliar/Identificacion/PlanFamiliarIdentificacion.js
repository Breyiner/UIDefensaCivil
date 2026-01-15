import * as adjuntarOpc from "../../../Helpers/adjuntarOpciones"
import * as alerta from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import {cargarDatos} from "../../../Helpers/cargarDatos";

export const PlanIdentificacionController = () => {
    const id = ((location.hash).split('='))[1];
    const form = document.querySelector('.form');
    const boton = document.querySelector('.form__boton');
    const familia = document.querySelector('.input__familia')
    const apellidos = document.querySelector('.input__apellidos');
    const dirrecion = document.querySelector('.input__dirrecion');
    const sector = document.querySelector('.input__sector');
    const sectorNombre = document.querySelector('.input__sectorNombre');
    const telefono = document.querySelector('.input__telefono');
    const calidad = document.querySelector('.input__calidad');
    
    if (window.procesoPeticion === undefined) {
    window.procesoPeticion = false;
    }

    cargarDatos(`familyPlans/${id}`,[familia,apellidos],['id','last_names']);
    adjuntarOpc.adjuntarNoValida(sector,"sectors");
    adjuntarOpc.adjuntarNoValida(calidad,"housingQualities");

    form.addEventListener('submit', async (e) => {
            window.procesoPeticion = true
            e.preventDefault();
            boton.disabled = true;
            checkbox.disabled = true;
            const datosRegistro = {
              last_names: apellidos.value,
              address: dirrecion.value,
              sector_id: sector.value,
              sector_name: sectorNombre.value,
              landline_phone: telefono.value,
              housing_quality_id: calidad.value
            };
            console.log(datosRegistro);
            try {
                const data = await api.postPublic(`familyPlans/identify/id=${id}`,datosRegistro);
                if (data.success)
                    {
                        console.log(data);
                        await alerta.alertaOK(data.message)
                        window.location.href = `#/home`;
                    }
                else alerta.alertaWarning(data.message,data.errors)
            } catch (error) {
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
                    window.location.href = '#/home';
                }
            }
    });
}