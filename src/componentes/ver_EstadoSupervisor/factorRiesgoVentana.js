import * as api from "../../helpers/api";
import * as alerta from "../../helpers/alertas";

const factorRiesgoVentana = async (factor, miembrosFamilia, info) => {

    const threatTypes = await api.get(`threatTypes/${factor.threat_type_id}`);
    const riskReduction = await api.get(`riskReductionActions/riskFactor/${factor.id}`);

    const overlay = document.createElement("div");
    overlay.classList.add("overlay_verEstado");

    const ventana = document.createElement("div");
    ventana.classList.add("ventana");

    const btnEditar = document.createElement("button");
    btnEditar.classList.add("btn-editar");
    btnEditar.textContent = "Editar";

    const btnCerrar = document.createElement("button");
    btnCerrar.classList.add("ri-close-line", "btn-cerrar-Estado");


    const tipoAmenazaCont = document.createElement("div");
    tipoAmenazaCont.classList.add("form_autorizacion");

    const tipoAmenazaTitulo = document.createElement("p");
    tipoAmenazaTitulo.classList.add("form__texto");
    const amenazaIcono = document.createElement("i");
    amenazaIcono.classList.add("icono--pequeno", "ri-alert-line");
    tipoAmenazaTitulo.append(amenazaIcono, " Tipo de Amenaza");

    const tipoAmenaza = document.createElement("p");
    tipoAmenaza.classList.add("form_autorizacion");
    tipoAmenaza.textContent = threatTypes.name;

    tipoAmenazaCont.append(tipoAmenazaTitulo, tipoAmenaza);

    const descripcionCont = document.createElement("div");
    descripcionCont.classList.add("form_autorizacion");

    const descripcionTitulo = document.createElement("p");
    descripcionTitulo.classList.add("form__texto");
    const descripcionIcono = document.createElement("i");
    descripcionIcono.classList.add("icono--pequeno", "ri-file-text-line");
    descripcionTitulo.append(descripcionIcono, " Descripción");

    const descripcion = document.createElement("p");
    descripcion.classList.add("form_autorizacion");
    descripcion.textContent = factor.description;

    descripcionCont.append(descripcionTitulo, descripcion);

    const ubicacionDistanciaCont = document.createElement("div");
    ubicacionDistanciaCont.classList.add("form_autorizacion");

    const ubicacionConst = document.createElement("div");
    ubicacionConst.classList.add("form_autorizacion");

    const ubicacionTitulo = document.createElement("p");
    ubicacionTitulo.classList.add("form__texto");
    const ubicacionIcono = document.createElement("i");
    ubicacionIcono.classList.add("icono--pequeno", "ri-map-pin-2-line");
    ubicacionTitulo.append(ubicacionIcono, "Ubicación: ");

    const ubicacion = document.createElement("p");
    ubicacion.classList.add("form_autorizacion");
    ubicacion.textContent = factor.ubication;

    ubicacionConst.append(ubicacionTitulo, ubicacion);

    // const distanciaIcono = document.createElement("i");
    // distanciaIcono.classList.add("icono--pequeno", "ri-roadster-line");
    const distanciaCont = document.createElement("p");
    distanciaCont.classList.add("form_autorizacion");


    const distanciaTitulo = document.createElement("p");
    distanciaTitulo.classList.add("form__texto");
    distanciaTitulo.textContent = "Distancia: ";
    const distancia = document.createElement("p");
    distancia.classList.add("form_autorizacion");
    distancia.textContent = `${factor.distance} metros`;

    distanciaCont.append(distanciaTitulo, distancia);

    ubicacionDistanciaCont.append(ubicacionConst, distanciaCont);

    const accionesReduccionCont = document.createElement("div");
    accionesReduccionCont.classList.add("form_autorizacion");

    const accionesReduccionTitulo = document.createElement("p");
    accionesReduccionTitulo.classList.add("form__texto");
    const accionesReduccionIcono = document.createElement("i");
    accionesReduccionIcono.classList.add("icono--pequeno", "ri-shield-check-line");
    accionesReduccionTitulo.append(accionesReduccionIcono, " Acciones de reducción de riesgo");

    accionesReduccionCont.append(accionesReduccionTitulo);

    if (riskReduction.length === 0) {
        const sinAcciones = document.createElement("p");
        sinAcciones.classList.add("form_autorizacion");
        sinAcciones.textContent = "Sin acciones registradas";
        accionesReduccionCont.append(sinAcciones);
    } else {

        riskReduction.forEach(async accion => {

            const accionCont = document.createElement("div");
            accionCont.classList.add("form_autorizacion");

            const accionRealizada = document.createElement("p");
            accionRealizada.classList.add("form_autorizacion");
            accionRealizada.textContent = `• Acción: ${accion.action}`;

            const encargado = document.createElement("p");
            encargado.classList.add("form_autorizacion");
            
            const nombreEncargado = miembrosFamilia.find(m => { 
                return m.member_id == accion.member_id
            });

            const miembro = await api.get(`members/${nombreEncargado.member_id}`);
            encargado.textContent = `• Encargado: ${miembro.names} ${miembro.last_names}`;

            const fechaInicio = document.createElement("p");
            fechaInicio.classList.add("form_autorizacion");
            fechaInicio.textContent = `• Fecha inicio: ${accion.created_at.split("T")[0]}`;

            const fechaFinal = document.createElement("p");
            fechaFinal.classList.add("form_autorizacion");
            fechaFinal.textContent = `• Fecha final: ${accion.end_date}`;

            accionCont.append(accionRealizada, encargado, fechaInicio, fechaFinal);
            accionesReduccionCont.append(accionCont);
        });
    }


    ventana.append(btnCerrar, tipoAmenazaCont, descripcionCont, ubicacionDistanciaCont, accionesReduccionCont, btnEditar);

    overlay.appendChild(ventana);

    overlay.onclick = (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    };

    document.body.appendChild(overlay);

    btnCerrar.onclick = () => {
        document.body.removeChild(overlay);
    };

    btnEditar.addEventListener("click", ()=>{
        location.href = `#/supervisor/plan_familiar/factores_de_riesgo/editar?familia_id=${info.id}&riesgo_id=${factor.id}`;
        overlay.remove();
    });

}

export default factorRiesgoVentana;