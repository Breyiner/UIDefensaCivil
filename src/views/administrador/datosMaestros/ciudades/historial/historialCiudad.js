import historial from "@/componentes/historial/historial";

import { api } from "@/helpers/index.js";

const historialCiudad = async () => {

    const datoHistorial = document.querySelector(".dato--historial");
    
    const id = location.hash.split("=")[1];
    
    const datoMaestro = await api.get(`cities/${id}`);

    datoHistorial.textContent = datoMaestro.name;

    const endpoint = `cities/${id}/history`;
    
    historial(endpoint, "Departamento");
};

export default historialCiudad;