import historial from "@/componentes/historial/historial";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { api } from "@/helpers/index.js";

const historialPreguntas = async () => {
    
    const id = location.hash.split("=")[1];

    const datoMaestro = await api.get(`vulnerableQuestions/${id}`);

    const datosHistorial = await api.get(`vulnerableQuestions/${id}/history`);

    let precaucion = null;

    if (datoMaestro.question_caution==0) {

        precaucion = "No";

    } else {

        precaucion = "Si";
    }


    historial(datosHistorial, datoMaestro, "Precaución", "description", precaucion);
};

export default historialPreguntas;