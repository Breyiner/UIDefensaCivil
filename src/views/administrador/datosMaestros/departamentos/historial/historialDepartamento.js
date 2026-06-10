import historial from "@/componentes/historial/historial";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { api } from "@/helpers/index.js";

const historialDepartamento = async () => {
    
    const id = location.hash.split("=")[1];

    const datoMaestro = await api.get(`departments/${id}`);

    const endpoint = `departments/${id}/history/`;

    historial(endpoint, null);
};

export default historialDepartamento;