import * as api from "../../helpers/api";

const recursosVentana = async (recurso, info) => {

    const typeResource = await api.get(`resources/${recurso.resource_id}`);

    const overlay = document.createElement("div");
    overlay.classList.add("overlay_verEstado");

    const ventana = document.createElement("div");
    ventana.classList.add("ventana");

    const btnEditar = document.createElement("button");
    btnEditar.classList.add("btn-editar");
    btnEditar.textContent = "Editar";

    const btnCerrar = document.createElement("button");
    btnCerrar.classList.add("ri-close-line", "btn-cerrar-Estado");
    btnCerrar.onclick = () => overlay.remove();


    const nombreCont = document.createElement("div");
    nombreCont.classList.add("form_autorizacion");

    const nombreTitulo = document.createElement("p");
    nombreTitulo.classList.add("form__texto");
    const nombreIcono = document.createElement("i");
    nombreIcono.classList.add("icono--pequeno", "ri-hand-coin-line");
    nombreTitulo.append(nombreIcono, " Recurso");

    const nombre = document.createElement("p");
    nombre.classList.add("form_autorizacion");
    nombre.textContent = typeResource.name;

    nombreCont.append(nombreTitulo, nombre);


    const servicioCont = document.createElement("div");
    servicioCont.classList.add("form_autorizacion");

    const servicioTitulo = document.createElement("p");
    servicioTitulo.classList.add("form__texto");
    const servicioIcono = document.createElement("i");
    servicioIcono.classList.add("icono--pequeno", "ri-service-line");
    servicioTitulo.append(servicioIcono, " Servicio");

    const servicio = document.createElement("p");
    servicio.classList.add("form_autorizacion");
    servicio.textContent = typeResource.service;

    servicioCont.append(servicioTitulo, servicio);


    const telefonoCont = document.createElement("div");
    telefonoCont.classList.add("form_autorizacion");

    const telefonoTitulo = document.createElement("p");
    telefonoTitulo.classList.add("form__texto");
    const telefonoIcono = document.createElement("i");
    telefonoIcono.classList.add("icono--pequeno", "ri-phone-line");
    telefonoTitulo.append(telefonoIcono, " Teléfono de contacto");

    const telefono = document.createElement("p");
    telefono.classList.add("form_autorizacion");
    telefono.textContent = recurso.phone ?? "Sin teléfono registrado";

    telefonoCont.append(telefonoTitulo, telefono);


    const descripcionCont = document.createElement("div");
    descripcionCont.classList.add("form_autorizacion");

    const descripcionTitulo = document.createElement("p");
    descripcionTitulo.classList.add("form__texto");
    const descripcionIcono = document.createElement("i");
    descripcionIcono.classList.add("icono--pequeno", "ri-file-text-line");
    descripcionTitulo.append(descripcionIcono, " Descripción");

    const descripcion = document.createElement("p");
    descripcion.classList.add("form_autorizacion");
    descripcion.textContent = recurso.description ?? "Sin descripción registrada";

    descripcionCont.append(descripcionTitulo, descripcion);


    const distanciaCont = document.createElement("div");
    distanciaCont.classList.add("form_autorizacion");

    const distanciaTitulo = document.createElement("p");
    distanciaTitulo.classList.add("form__texto");
    const distanciaIcono = document.createElement("i");
    distanciaIcono.classList.add("icono--pequeno", "ri-roadster-line");
    distanciaTitulo.append(distanciaIcono, " Distancia");

    const distancia = document.createElement("p");
    distancia.classList.add("form_autorizacion");
    distancia.textContent = `${recurso.distance} metros`;

    distanciaCont.append(distanciaTitulo, distancia);

    ventana.append(btnCerrar, nombreCont, servicioCont, telefonoCont, descripcionCont, distanciaCont, btnEditar);

    overlay.append(ventana);

    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    };

    btnEditar.addEventListener("click", () => {
        location.href = `#/supervisor/plan_familiar/recursos/editar?familia_id=${info.id}&recurso_id=${recurso.id}`;
        overlay.remove();
    });

    document.body.appendChild(overlay);
}

export default recursosVentana;