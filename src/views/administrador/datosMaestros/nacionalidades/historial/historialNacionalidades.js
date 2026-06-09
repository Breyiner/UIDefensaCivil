import historial from "@/componentes/historial/historial";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { api } from "@/helpers/index.js";

const historialNacionalidades = async () => {
    
    const id = location.hash.split("=")[1];

    const datoMaestro = await api.get(`nationalities/${id}`);

    const datosHistorial = await api.get(`nationalities/${id}/history`);

    historial(datosHistorial, null, datoMaestro);
};

export default historialNacionalidades;