import { estado_planes, getBadgeClase } from "../../helpers/cambioEstado.js";

export const cardPlanFamiliar = (info) => {

    const rolId = parseInt(localStorage.getItem("role_id"));
    const esSupervisor = rolId === 2;
    const esVoluntario = rolId === 3;

    const div = document.createElement("div");
    div.classList.add("tarjeta");

    // INTRODUCCIÓN
    const tarjetaIntroduccion = document.createElement("div");
    tarjetaIntroduccion.classList.add("tarjeta--introduccion_supervisor");

    const introduccionDiv = document.createElement("div");
    introduccionDiv.classList.add("introduccionDiv");

    const imagenIcono = document.createElement("img");
    imagenIcono.src = "../../../../public/icon/familyicon.svg";
    imagenIcono.alt = "iconofamilia";
    imagenIcono.classList.add("imagen--icono");

    const introduccionCont = document.createElement("div");
    introduccionCont.classList.add("tarjeta-contenido");

    const apellidoFamilia = document.createElement("div");
    apellidoFamilia.classList.add("tarjeta__titulo");
    apellidoFamilia.textContent = "Familia " + info.last_names;

    const departamento = document.createElement("div");
    departamento.classList.add("form_autorizacion");
    departamento.innerHTML = `<i class="icono--pequeno ri-map-pin-2-line"></i> ${info.department}`;

    const fechaRecibido = document.createElement("div");
    fechaRecibido.classList.add("form_autorizacion");
    fechaRecibido.innerHTML = `<i class="icono--pequeno ri-calendar-line"></i> Recibido: ${info.date_create}`;

    const nombreVoluntario = document.createElement("div");
    nombreVoluntario.classList.add("form_autorizacion");
    nombreVoluntario.innerHTML = `<i class="icono--pequeno ri-user-line"></i> Voluntario: ${info.responsable}`;

    introduccionCont.append(apellidoFamilia, departamento, fechaRecibido, nombreVoluntario);
    introduccionDiv.append(imagenIcono, introduccionCont);
    tarjetaIntroduccion.append(introduccionDiv);

    // ESTADO Y TIPO
    const estadoTipoCont = document.createElement("div");
    estadoTipoCont.classList.add("verPlan__tipo--estado");

    const estadoClase = getBadgeClase(info.status_id, estado_planes);
    const verEstado = document.createElement("p");
    verEstado.classList = "verPlan__estado " + estadoClase;
    verEstado.textContent = info.status;

    const tipoClase = info.family_type_id == 1 ? "verPlan__tipo--rojo"
        : info.family_type_id == 2 ? "verPlan__tipo--verde"
        : "verPlan__tipo--gris";

    const tipoFamilia = document.createElement("p");
    tipoFamilia.classList.add("verPlan__tipo", tipoClase);
    tipoFamilia.textContent = `Familia ${info.family_type}`;

    estadoTipoCont.append(verEstado, tipoFamilia);
    tarjetaIntroduccion.append(estadoTipoCont);
    div.append(tarjetaIntroduccion);

    // BOTÓN según rol
    const boton = document.createElement("button");
    boton.classList.add("boton", "boton--height");
    boton.textContent = "Revisar Plan";
    div.append(boton);

    if (esVoluntario) {
        if (info.status_id === 4 || info.status_id === 6 || info.status_id === 7) {
            boton.classList.add("oculto");
            const mensaje = document.createElement("div");
            mensaje.classList.add("verPlan__mensaje--estado");
            if (info.status_id === 4) mensaje.textContent = "El plan está siendo revisado por el supervisor.";
            else if (info.status_id === 6) mensaje.textContent = "El plan fue rechazado por el supervisor.";
            else if (info.status_id === 7) mensaje.textContent = "El plan ha sido aprobado por el supervisor.";
            div.append(mensaje);
        }

        boton.addEventListener("click", () => {
            location.href = info.status_id == 1
                ? `#/voluntario/plan_familiar/testVunerabilidad?id=${info.id}`
                : `#/voluntario/plan_familiar/familia?id=${info.id}`;
        });
    }

    if (esSupervisor) {
        if (info.status_id === 1 || info.status_id === 2 || info.status_id === 3) {
            boton.classList.add("oculto");
            const mensaje = document.createElement("div");
            mensaje.classList.add("verPlan__mensaje--estado");
            if (info.status_id === 1 || info.status_id === 2) mensaje.textContent = "El plan está en proceso de revisión inicial.";
            else if (info.status_id === 3) mensaje.textContent = "El plan está siendo creado por el voluntario.";
            div.append(mensaje);
        }

        boton.addEventListener("click", () => {
            location.href = `#/supervisor/plan_familiar/revision?familia_id=${info.id}`;
        });
    }

    return div;
};
