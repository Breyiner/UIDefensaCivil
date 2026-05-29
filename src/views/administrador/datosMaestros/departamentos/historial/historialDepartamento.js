import historial from "@/componentes/historial/historial";
import { api } from "@/helpers";

const historialDepartamento = async () => {
    
    const id = location.hash.split("=")[1];

    const datoMaestro = await api.get(`departments/${id}`);

    const datosHistorial = await api.get(`departments/${id}/history/`);

    historial(datosHistorial, datoMaestro, null, "name", null);
};

export default historialDepartamento;