import historial from "../../../../../componentes/historial/historial";
import * as api from "../../../../../helpers/api";

const historialRecursos = async () => {
    
    const id = location.hash.split("=")[1];

    const datoMaestro = await api.get(`resources/${id}`);
    console.log(id + ". " + datoMaestro.name);

    const datosHistorial = await api.get(`resources/history/${id}`);
    console.log(datosHistorial);

    historial(datosHistorial, datoMaestro, "Servicio", "name", datoMaestro.service);
};

export default historialRecursos;