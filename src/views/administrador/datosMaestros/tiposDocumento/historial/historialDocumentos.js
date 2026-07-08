import historial from "@/componentes/historial/historial";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { api } from "@/helpers/index.js";

const historialDocumentos = async () => {
    
    const datoHistorial = document.querySelector(".dato--historial");
    
    const id = location.hash.split("=")[1];
    
    const datoMaestro = await api.get(`documentTypes/${id}`);
    
    const datosHistorial = await api.get(`documentTypes/${id}/history`);
    
    datoHistorial.textContent = datoMaestro.name;
    
    const endpoint = `documentTypes/${id}/history`;

    historial(endpoint, "Acrónimo");
};

export default historialDocumentos;