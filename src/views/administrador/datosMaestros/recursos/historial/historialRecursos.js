import historial from "@/componentes/historial/historial";
import { api } from "@/helpers";

const historialRecursos = async () => {
    
    const id = location.hash.split("=")[1];

    const datoMaestro = await api.get(`resources/${id}`);

    const datosHistorial = await api.get(`resources/${id}/history`);

    historial(datosHistorial, datoMaestro, "Servicio", "name", datoMaestro.service);
};

export default historialRecursos;