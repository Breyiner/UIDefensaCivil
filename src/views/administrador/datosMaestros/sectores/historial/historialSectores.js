import historial from "@/componentes/historial/historial";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { api } from "@/helpers/index.js";

const historialSectores = async () => {
    
    const id = location.hash.split("=")[1];

    const datoMaestro = await api.get(`sectors/${id}`);

    const endpoint = `sectors/${id}/history`;

    historial(endpoint, null);
};

export default historialSectores;