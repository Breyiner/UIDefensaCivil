import historial from "@/componentes/historial/historial";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { api } from "@/helpers/index.js";

const historialUsuario = async () => {
    
    const id = location.hash.split("=")[1];

    const datoMaestro = await api.get(`users/${id}`);

    const datosHistorial = await api.get(`users/${id}/history/`);

    console.log(datosHistorial);

    const endpoint = `users/${id}/history/`;

    historial(endpoint, null);
};

export default historialUsuario;