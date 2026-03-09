import * as api from "../../../../helpers/api";
import * as alerta from "../../../../helpers/alertas";
import * as adjuntarOpc from "../../../../helpers/adjuntarOpciones";

export default async () => {
    const botonBack = document.getElementById("botonBack");
    const botonGuardar = document.getElementById('botonGuardar');
    const form = document.querySelector('.form');
    const id = location.hash.split("=")[1];

    if (window.procesoPeticion === undefined) {window.procesoPeticion = true;} 
    window.procesoPeticion = true;

    botonBack.onclick = async() => {
    if(window.procesoPeticion) return;
    const confirmacion = await alerta.alertaQuest("¿Seguro que quieres volver? perderás tu progreso");
    if (confirmacion.isConfirmed) location.href = `#/voluntario-planIntegrante/ver/id=${id}`;};
    
    const nombres = document.getElementById('nombres');
    const apellidos = document.getElementById('apellidos');
    const numDocumento = document.getElementById('numeroDocumento');
    const eps = document.getElementById('eps');
    const celularPersonal = document.getElementById('celularPersonal');
    const nacimiento = document.getElementById('nacimiento');

    const tipoDocumento = document.getElementById('tiposDocumento');
    const genero = document.getElementById('generos');
    const parentesco = document.getElementById('parentescos');
    const grupoSanguineo = document.getElementById('grupoSanguineos');
    const nacionalidad = document.getElementById('nacionalidades');
    
    await adjuntarOpc.adjuntar(tipoDocumento,"documentTypes");
    await adjuntarOpc.adjuntarNoValida(genero,"genders");
    await adjuntarOpc.adjuntarNoValida(parentesco,"kinships");
    await adjuntarOpc.adjuntarNoValida(grupoSanguineo,"bloodGroups");
    await adjuntarOpc.adjuntarNoValida(nacionalidad,"nationalities");

    window.procesoPeticion = false;
    botonGuardar.disabled = false;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        window.procesoPeticion = true
        botonGuardar.disabled = true;
    
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
            phone: celularPersonal.value,
        };
        try {
            const data = await api.post(`members/${id}`,datosRegistro);
            if (data.success)
                {
                    await alerta.alertaOK(data.message)
                    const pregunta = await alerta.alertaQuest("Deseas agregar las enfermedades/discapacidad/alergias/ de este integrante?")
                    pregunta.isConfirmed ? window.location.href = `#/voluntario-planIntegrante/editar/id=${id},${data.data.id}` : location.href = `#/voluntario-planIntegrante/ver/id=${id}`;
                }
            else alerta.alertaWarning(data.message,data.errors)
        } catch (error) {
            alerta.alertaError(error.errors);
        }
    
        botonGuardar.disabled = false;
        window.procesoPeticion = false;
    });
}