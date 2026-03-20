import historial from "../../../../../componentes/historial/historial";
import * as api from "../../../../../helpers/api";

const historialPreguntas = async () => {
    
    const id = location.hash.split("=")[1];

    const dato_Nombre = await api.get(`vulnerableQuestions/${id}`);
    console.log(id + ". " + dato_Nombre.name);

    const datos = await api.get(`vulnerableQuestions/history/${id}`);
    console.log(datos);


    historial(datos, dato_Nombre);
};

export default historialPreguntas;