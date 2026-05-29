import historial from "@/componentes/historial/historial";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { api } from "@/helpers/index.js";

const historialRecursos = async () => {
    
    const id = location.hash.split("=")[1];

    const datoMaestro = await api.get(`resources/${id}`);

    const datosHistorial = await api.get(`resources/${id}/history`);

    historial(datosHistorial, datoMaestro, "Servicio", "name", datoMaestro.service);
};

export default historialRecursos;