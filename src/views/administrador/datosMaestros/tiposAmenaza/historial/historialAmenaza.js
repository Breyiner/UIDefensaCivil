import historial from "@/componentes/historial/historial";
import { api } from "@/helpers";

const historialAmenaza = async () => {
    
    const id = location.hash.split("=")[1];

    const datoMaestro = await api.get(`threatTypes/${id}`);

    const datosHistorial = await api.get(`threatTypes/${id}/history`);


    historial(datosHistorial, datoMaestro, null, "name", null);
};

export default historialAmenaza;