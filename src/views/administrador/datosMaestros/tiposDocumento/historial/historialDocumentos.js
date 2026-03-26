import historial from "../../../../../componentes/historial/historial";
import * as api from "../../../../../helpers/api";

const historialDocumentos = async () => {
    
    const id = location.hash.split("=")[1];

    const datoMaestro = await api.get(`documentTypes/${id}`);
    console.log(id + ". " + datoMaestro.name);

    const datosHistorial = await api.get(`documentTypes/history/${id}`);
    console.log(datosHistorial);

    historial(datosHistorial, datoMaestro, "Acrónimo", "name", datoMaestro.acronym);
};

export default historialDocumentos;