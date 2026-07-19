import historial from "@/componentes/historial/historial";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { api } from "@/helpers/index.js";

const historialPreguntas = async () => {

    const datoHistorial = document.querySelector(".dato--historial");
    
    const id = location.hash.split("=")[1];
    
    const datoMaestro = await api.get(`vulnerableQuestions/${id}`);
    
    datoHistorial.textContent = datoMaestro.description;
    console.log(datoMaestro);
    
    const endpoint = `vulnerableQuestions/${id}/history`;

    let precaucion = null;

    if (datoMaestro.question_caution==0) {

        precaucion = "No";

    } else {

        precaucion = "Si";
    }


    historial(endpoint, "Precaución");
};

export default historialPreguntas;