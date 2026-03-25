import historial from "../../../../../componentes/historial/historial";
import * as api from "../../../../../helpers/api";

const historialOrganizacion = async () => {
    
    const id = location.hash.split("=")[1];

    const dato_Nombre = await api.get(`organizations/${id}`);
    console.log(id + ". " + dato_Nombre.name);

    const datos = await api.get(`organizations/history/${id}`);
    console.log(datos);

    

    historial(datos, dato_Nombre);
};

export default historialOrganizacion;