import historial from "@/componentes/historial/historial";
import { api } from "@/helpers";

const historialSeccional = async () => {
    
    const id = location.hash.split("=")[1];

    const datoMaestro = await api.get(`sectionals/${id}`);

    const datosHistorial = await api.get(`sectionals/${id}/history/`);


    historial(datosHistorial, datoMaestro, null, "name", null);
};

export default historialSeccional;