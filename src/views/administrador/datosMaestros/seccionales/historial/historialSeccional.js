import historial from "@/componentes/historial/historial";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { api } from "@/helpers/index.js";

const historialSeccional = async () => {
    
    const datoHistorial = document.querySelector(".dato--historial");

    const id = location.hash.split("=")[1];

    const datoMaestro = await api.get(`sectionals/${id}`);
    
    datoHistorial.textContent = datoMaestro.name;

    const endpoint = `sectionals/${id}/history/`;

    historial(endpoint, null);
};

export default historialSeccional;