import historial from "../../../../../componentes/historial/historial";
import * as api from "../../../../../helpers/api";

const historialVivienda = async () => {
    
    const id = location.hash.split("=")[1];

    const datoMaestro = await api.get(`housingQualities/${id}`);
    // console.log(id + ". " + datoMaestro.name);

    const datosHistorial = await api.get(`housingQualities/history/${id}`);
    // console.log(datosHistorial);


    historial(datosHistorial, datoMaestro, null, "name", null);
};

export default historialVivienda;