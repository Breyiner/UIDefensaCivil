import historial from "@/componentes/historial/historial";
import { api } from "@/helpers";

const historialNacionalidades = async () => {
    
    const id = location.hash.split("=")[1];

    const datoMaestro = await api.get(`nationalities/${id}`);

    const datosHistorial = await api.get(`nationalities/${id}/history`);

    historial(datosHistorial, datoMaestro, null, "name", null);
};

export default historialNacionalidades;