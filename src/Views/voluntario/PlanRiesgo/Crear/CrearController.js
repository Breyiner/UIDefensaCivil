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
            if (confirmacion.isConfirmed) location.href = `#/voluntario-planRiesgo/ver/id=${id}`;
        };
        
        // Inputs de texto
        const descripcion = document.querySelector('.input__descripcion');
        const distancia = document.querySelector('.input__distancia');
        const ubicacion = document.querySelector('.input__ubicacion');
        // Selects
        const amenaza = document.querySelector('.input__tipoAmenaza');
        await adjuntarOpc.adjuntar(amenaza,"threatTypes");
            
        window.procesoPeticion = false;
        boton.disabled = false;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            window.procesoPeticion = true
            boton.disabled = true;
        
            const datosRegistro = {
                threat_type_id: amenaza.value,
                description: descripcion.value,
                ubication: ubicacion.value,
                distance: distancia.value,
                family_plan_id: id
            };
            try {
                const data = await api.post(`riskFactors`,datosRegistro);
                if (data.success)
                    {   
                        await alerta.alertaOK(data.message)
                        window.location.href = `#/voluntario-planRiesgo/ver/id=${id}`;
                    }
                else alerta.alertaWarning(data.message,data.errors)
            } catch (error) {
                alerta.alertaError(error.errors);
            }
        
            boton.disabled = false;
            window.procesoPeticion = false;
        });
    }