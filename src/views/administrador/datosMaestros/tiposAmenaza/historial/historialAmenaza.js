import historial from "@/componentes/historial/historial";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { api } from "@/helpers/index.js";

const historialAmenaza = async () => {
    
    const id = location.hash.split("=")[1];

    const datoMaestro = await api.get(`threatTypes/${id}`);

    const datosHistorial = await api.get(`threatTypes/${id}/history`);


    historial(datosHistorial, null, datoMaestro);
};

export default historialAmenaza;