import historial from "../../../../../componentes/historial/historial";
import * as api from "../../../../../helpers/api";

const historialSectores = async () => {
    
    const id = location.hash.split("=")[1];

    const datoMaestro = await api.get(`sectors/${id}`);
    console.log(id + ". " + datoMaestro.name);

    const datosHistorial = await api.get(`sectors/${id}/history`);
    console.log(datosHistorial);


    historial(datosHistorial, datoMaestro, null, "name", null);
};

export default historialSectores;