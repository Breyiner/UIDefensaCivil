import * as adjuntarOpc from "../../../Helpers/adjuntarOpciones"
import * as alerta from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";

export default () => {
    const botonBack = document.getElementById("boton-back");
    const form = document.querySelector('.form');

    const apellidos = document.querySelector('.input__apellidos')
    const zona = document.querySelector('.input__zona');
    const apartamento = document.querySelector('.input__apartamento');
    const ciudad = document.querySelector('.input__ciudad');
    const checkbox = document.getElementById('autorization');
    const boton = document.querySelector('.form__boton');

    if (window.procesoPeticion === undefined) {
    window.procesoPeticion = false;
    }
    adjuntarOpc.adjuntarNoValida(zona,"zones");
    adjuntarOpc.adjuntarNoValida(apartamento,"apartments");

    form.addEventListener('submit', async (e) => {
        window.procesoPeticion = true
        e.preventDefault();

        boton.disabled = true;
        checkbox.disabled = true;

        const datosRegistro = {
          last_names: apellidos.value,
          zone_id: zona.value,
          city_id: ciudad.value,
          sectionals_id: localStorage.getItem('sectional_id')
        };

        try {
            const data = await api.post('familyPlans',datosRegistro);
            if (data.success)
                {
                    await alerta.alertaOK(data.message)
                    window.location.href = `#/planFamiliar/testVunerabilidad/id=${data.data.id}`;
                }
            else alerta.alertaWarning(data.message,data.errors)
        } catch (error) {
            alerta.alertaError(error.errors);
        }

        boton.disabled = false;
        checkbox.disabled = false;
        window.procesoPeticion = false;
    });

    apartamento.addEventListener('change',async () => {
        adjuntarOpc.adjuntarReseteoNoValida(ciudad,`cities/apartment/${apartamento.value}`); }
    );

    checkbox.addEventListener("change", () => {
    checkbox.checked ? boton.disabled = false : boton.disabled = true;
    });

    botonBack.addEventListener("click", async () => {
        const confirmacion = await alerta.alertaQuest("¿Seguro que quieres volver? perderás tu progreso");
        if (confirmacion.isConfirmed) location.href = "#/home";
    });
}