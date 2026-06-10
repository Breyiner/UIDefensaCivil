import historial from "@/componentes/historial/historial";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { api } from "@/helpers/index.js";

const historialEspecies = async () => {
    
    const id = location.hash.split("=")[1];

    const datoMaestro = await api.get(`species/${id}`);

    const endpoint = `species/${id}/history/`;

    historial(endpoint, null);
};

export default historialEspecies;