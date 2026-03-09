import * as api from "../../../../helpers/api";
import * as alerta from "../../../../helpers/alertas";
import * as adjuntarOpc from "../../../../helpers/adjuntarOpciones";

export default async () => {
    const botonBack = document.getElementById("botonBack");
    const botonSiguiente = document.getElementById('botonSiguiente');
    const form = document.querySelector('.form');
    const id = location.hash.split("=")[1];

    if (window.procesoPeticion === undefined) { window.procesoPeticion = true; }
    window.procesoPeticion = true;

    botonBack.onclick = async () => {
        if (window.procesoPeticion) return;
        const confirmacion = await alerta.alertaQuest("¿Seguro que quieres volver? perderás tu progreso");
        if (confirmacion.isConfirmed) location.href = `#/voluntario-planRiesgo/ver/id=${id}`;
    };

    const descripcion = document.getElementById('descripcion');
    const distancia = document.getElementById('distancia');
    const ubicacion = document.getElementById('ubicacion');
    const amenaza = document.getElementById('tiposAmenaza');
    await adjuntarOpc.adjuntar(amenaza, "threatTypes");

    window.procesoPeticion = false;
    botonSiguiente.disabled = false;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        window.procesoPeticion = true
        botonSiguiente.disabled = true;

        const datosRegistro = {
            threat_type_id: amenaza.value,
            description: descripcion.value,
            ubication: ubicacion.value,
            distance: distancia.value,
            family_plan_id: id
        };
        try {
            const data = await api.post(`riskFactors`, datosRegistro);
            if (data.success) {
                await alerta.alertaOK(data.message)
                window.location.href = `#/voluntario-planRiesgo/ver/id=${id}`;
            }
            else alerta.alertaWarning(data.message, data.errors)
        } catch (error) {
            alerta.alertaError(error.errors);
        }

        botonSiguiente.disabled = false;
        window.procesoPeticion = false;
    });
}