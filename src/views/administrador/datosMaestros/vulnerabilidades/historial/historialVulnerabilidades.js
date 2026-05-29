import historial from "@/componentes/historial/historial";
import { api } from "@/helpers";

const historialVulnerabilidades = async () => {
    
    const id = location.hash.split("=")[1];

    const datoMaestro = await api.get(`vulnerabilities/${id}`);

    const datosHistorial = await api.get(`vulnerabilities/${id}/history`);

    historial(datosHistorial, datoMaestro, null, "name", null);
};

export default historialVulnerabilidades;