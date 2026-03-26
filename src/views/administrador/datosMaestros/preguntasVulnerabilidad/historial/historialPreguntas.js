import historial from "../../../../../componentes/historial/historial";
import * as api from "../../../../../helpers/api";

const historialPreguntas = async () => {
    
    const id = location.hash.split("=")[1];

    const datoMaestro = await api.get(`vulnerableQuestions/${id}`);
    console.log(id + ". " + datoMaestro.description);

    const datosHistorial = await api.get(`vulnerableQuestions/${id}/history`);
    console.log(datosHistorial);

    let precaucion = null;

    if (datoMaestro.question_caution==0) {

        precaucion = "No";

    } else {

        precaucion = "Si";
    }


    historial(datosHistorial, datoMaestro, "Precaución", "description", precaucion);
};

export default historialPreguntas;