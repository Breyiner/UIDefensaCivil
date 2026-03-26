import historial from "../../../../../componentes/historial/historial";
import * as api from "../../../../../helpers/api";

const historialOrganizacion = async () => {
    
    const id = location.hash.split("=")[1];

    const datoMaestro = await api.get(`organizations/${id}`);
    console.log(id + ". " + datoMaestro.name);

    const datosHistorial = await api.get(`organizations/history/${id}`);
    // console.log(datos);

    const SubDatos = await api.get(`sectionals`);

    const seccional = SubDatos.find(s => s.id === datoMaestro.sectional_id);

    console.log(seccional);
    

    historial(datosHistorial, datoMaestro, "Seccional", "name", seccional.name);
};

export default historialOrganizacion;