import historial from "@/componentes/historial/historial";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { api } from "@/helpers/index.js";

const historialOrganizacion = async () => {
    
    const datoHistorial = document.querySelector(".dato--historial");

    const id = location.hash.split("=")[1];

    const datoMaestro = await api.get(`organizations/${id}`);

    datoHistorial.textContent = datoMaestro.name;

    const endpoint = `organizations/${id}/history`;
    
    historial(endpoint, "Seccional");
};

export default historialOrganizacion;