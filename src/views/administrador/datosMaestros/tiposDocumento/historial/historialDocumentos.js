import historial from "@/componentes/historial/historial";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { api } from "@/helpers/index.js";

const historialDocumentos = async () => {
    
    const id = location.hash.split("=")[1];

    const datoMaestro = await api.get(`documentTypes/${id}`);

    const datosHistorial = await api.get(`documentTypes/${id}/history`);

    historial(datosHistorial, "Acrónimo", datoMaestro);
};

export default historialDocumentos;