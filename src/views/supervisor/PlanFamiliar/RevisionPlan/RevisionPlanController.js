/**
 * Controlador: Revisión de Plan Familiar (RevisionPlanController.js)
 * Facilita las acciones críticas para un Supervisor al evaluar un Plan Familiar.
 * Gestiona botones asíncronos para Aprobar, Rechazar (Definitivo/Cambios) y Ver PDF.
 */
import * as alerta from "../../../../helpers/alertas";
import * as api from "../../../../helpers/api";
import paginacion from "../../../../helpers/paginacion";

const RevisionPlanController = async () => {

    const id = location.hash.split("=")[1];

    const info = await api.get(`familyPlans/${id}`);

    const familyMembers = await api.get(`familyMembers/`);

    const pets = await api.get(`pets/`);

    const riskFactors = await api.get(`riskFactors/`);

    const Resources = await api.get(`availableResources/`);

    // const botonBack = document.getElementById("botonBack");
    const contenedor = document.querySelector(".container__revision");

    const div = document.createElement("div");
    div.classList.add( "tarjeta");

    console.log("members", familyMembers);


    //INTRODUCCION DE LA TARJETA _____________________________________________________________________________________

    const tarjetaIntroduccion = document.createElement("div");
    tarjetaIntroduccion.classList.add("tarjeta--introduccion_supervisor");

    const introduccionCont = document.createElement("div");
    introduccionCont.classList.add("tarjeta-contenido");

    const imagenIcono = document.createElement("img");
    imagenIcono.src = "../../../../public/icon/familyicon.svg";
    imagenIcono.alt = "iconofamilia";
    imagenIcono.classList.add("imagen--icono");

    const apellidoFamilia = document.createElement("div");
    apellidoFamilia.classList.add("tarjeta__titulo");
    apellidoFamilia.textContent = "Familia " + info.last_names;

    const departamento = document.createElement("div");
    departamento.classList.add("form_autorizacion");
    const ubicacionIcono = document.createElement("i");
    ubicacionIcono.classList.add("icono--pequeno", "ri-map-pin-2-line");
    departamento.append(ubicacionIcono, " " + info.department);

    const fechaRecibido = document.createElement("div");
    fechaRecibido.classList.add("form_autorizacion");
    const calendarioIcono = document.createElement("i");
    calendarioIcono.classList.add("icono--pequeno", "ri-calendar-line");
    fechaRecibido.append(calendarioIcono, " Recibido: " + info.date_create);

    const introduccionDiv = document.createElement("div");
    introduccionDiv.classList.add("introduccionDiv");

    introduccionCont.append(apellidoFamilia, departamento, fechaRecibido);

    introduccionDiv.append(imagenIcono, introduccionCont);

    const botonVerPDF = document.createElement("button");
    botonVerPDF.classList.add("boton", "boton--height");
    botonVerPDF.id = "verPDF";
    botonVerPDF.textContent = "Ver PDF";

    tarjetaIntroduccion.append(introduccionDiv, botonVerPDF);

    // Enganche Visor pasivo
    botonVerPDF.addEventListener("click", () => {
        // Abre el PDF en otra pestaña consumiendo un binario mediante helper subyacente dedicado PDF
        api.getPdf(`familyPlans/pdf/${id}`, `plan_${id}.pdf`);
    });

    //CONTENIDO DE LA TARJETA _____________________________________________________________________________________

    const tarjetaContenido = document.createElement("div");
    tarjetaContenido.classList.add("tarjeta--contenido");

    //Integrantes
    const integrantesCont = document.createElement("div");
    integrantesCont.classList.add("tarjeta-contenido_flex");

    const integrantesHumanos = document.createElement("div");
    integrantesHumanos.classList.add("tarjeta-contenido");

    const subtituloIntegrantes = document.createElement("div");
    subtituloIntegrantes.classList.add("form__texto");
    const teamIcono = document.createElement("i");
    teamIcono.classList.add("icono--pequeno", "ri-team-line");
    subtituloIntegrantes.append(teamIcono, " Integrantes");

    integrantesHumanos.append(subtituloIntegrantes);

    const miembrosFamilia = familyMembers.filter(miembros => { 
        return miembros.family_plan_id == info.id
    });

    console.log(miembrosFamilia);

    miembrosFamilia.forEach(async (integrante) => {

        const miembro = await api.get(`members/${integrante.member_id}`);

        const relacion = await api.get(`kinships/${miembro.kinship_id}`);

        const integrante_p= document.createElement("p");
        integrante_p.classList.add("form_autorizacion");
        integrante_p.textContent =`• ${miembro.names} ${miembro.last_names} `;
        integrantesHumanos.append(integrante_p);
        console.log(miembro.names);
        
    });

    const integrantesMascotas = document.createElement("div");
    integrantesMascotas.classList.add("tarjeta-contenido");

    const subtituloMascotas = document.createElement("div");
    subtituloMascotas.classList.add("form__texto");
    const mascotaIcono = document.createElement("i");
    mascotaIcono.classList.add("icono--pequeno", "ri-team-line");
    subtituloMascotas.append(mascotaIcono, " Mascotas");

    integrantesMascotas.append(subtituloMascotas);

    const mascotasFamilia = pets.filter(mascota => {
        return mascota.family_plan_id == info.id
    });


    mascotasFamilia.forEach(async mascota => {

        const especie = await api.get(`species/${mascota.species_id}`);

        const mascota_p = document.createElement("p");
        mascota_p.classList.add("form_autorizacion");
        mascota_p.textContent = `• ${mascota.name} - ${especie.name}`;
        integrantesMascotas.append(mascota_p);

    });

    integrantesCont.append(integrantesHumanos, integrantesMascotas);

    //factores de riesgo

    const FactoresRiesgoCont = document.createElement("div");
    FactoresRiesgoCont.classList.add("tarjeta-contenido");

    const subtituloRiesgo = document.createElement("div");
    subtituloRiesgo.classList.add("form__texto");
    const riesgoIcono = document.createElement("i");
    riesgoIcono.classList.add("icono--pequeno", "ri-alert-line");
    subtituloRiesgo.append(riesgoIcono, " Factores de Riesgo");

    FactoresRiesgoCont.append(subtituloRiesgo);

    const factoresRiesgo = riskFactors.filter(factor => {
        return factor.family_plan_id == info.id
    });

    let contadorRiesgos = 0;

    factoresRiesgo.forEach(async factor => {

        contadorRiesgos++;

        const tiposRiesgo = await api.get(`threatTypes/${factor.threat_type_id}`);

        const factor_p = document.createElement("p");
        factor_p.classList.add("form_autorizacion");
        factor_p.textContent = `${contadorRiesgos}. ${tiposRiesgo.name}`;
        FactoresRiesgoCont.append(factor_p);
    });

    tarjetaContenido.append(integrantesCont, FactoresRiesgoCont);

    //recursos disponibles

    const recursosCont = document.createElement("div");
    recursosCont.classList.add("tarjeta-contenido");

    const subtituloRecursos = document.createElement("div");
    subtituloRecursos.classList.add("form__texto");
    const recursoIcono = document.createElement("i");
    recursoIcono.classList.add("icono--pequeno", "ri-hand-coin-line");
    subtituloRecursos.append(recursoIcono, " Recursos Disponibles");

    recursosCont.append(subtituloRecursos);


    const Recursos = Resources.filter(recurso => {
        return recurso.family_plan_id == info.id
    });

    let contadorRecursos = 0;

    Recursos.forEach(async (recurso) => {

        contadorRecursos++;

        const tiposRecursos = await api.get(`resources/${recurso.family_plan_id}`);

        const recurso_p = document.createElement("p");
        recurso_p.classList.add("form_autorizacion");
        recurso_p.textContent = `${contadorRecursos}. ${tiposRecursos.name} - ${recurso.distance} m`;
        recursosCont.append(recurso_p);
    });

    tarjetaContenido.append(recursosCont);

    //BOTONES DE ACCION _____________________________________________________________________________________

    const editar = document.createElement("button");
    editar.classList.add("boton", "boton--height");
    editar.textContent = "Editar y Revisar";

    const aprobar = document.createElement("button");
    aprobar.classList.add("boton", "boton--height", "boton--verde");
    aprobar.textContent = "Aprobar Plan";

    const rechazarCambios = document.createElement("button");
    rechazarCambios.classList.add("boton", "boton--height", "boton--naranja");
    rechazarCambios.textContent = "Requiere Cambios";

    const rechazarDefinitivo = document.createElement("button");
    rechazarDefinitivo.classList.add("boton", "boton--height", "boton--rojo");
    rechazarDefinitivo.textContent = "Rechazar Definitivamente";

    const botonesContenedor = document.createElement("div");
    botonesContenedor.classList.add("tarjeta--botones");
    botonesContenedor.append( editar, aprobar, rechazarCambios, rechazarDefinitivo);

    div.append(tarjetaIntroduccion, tarjetaContenido, botonesContenedor);


    editar.addEventListener("click", () => {
        location.href = `#/supervisor/plan_familiar/familia?id=${info.id}`;
    });

    // Callback del botón 'Aprobar'
    aprobar.addEventListener("click", async () => {
        try {
            // Impacta directamente al ID de estado del Plan 7 (Probablemente "Aprobado")
            const data = await api.patch(`familyPlans/status/${info.id}`, {
                status_plan_id: 7,
            });
            // Condominio de respuesta
            if (data.success) {
              await alerta.alertaOK(data.message); // Banner verde Confirmación
              window.location.href = `#/supervisor/plan_familiar`; // Expulsa devuelta a la lista principal
            } else alerta.alertaWarning(data.message, data.errors);
        } catch (error) {
            // Previene caídas totales
            alerta.alertaError(error.errors);
        }
    });

    // Callback del botón de negación y cierre
    rechazarDefinitivo.addEventListener("click", async () => {
        try {
            // Estado 6 (Rechazo absoluto o sin posibilidad de appeal momentáneo)
            const data = await api.patch(`familyPlans/status/${info.id}`, {
                status_plan_id: 6,
            });
            // Branching
            if (data.success) {
                await alerta.alertaOK(data.message);
              window.location.href = `#/supervisor/plan_familiar`; // Retorno lista
            } else alerta.alertaWarning(data.message, data.errors);
        } catch (error) {
            alerta.alertaError(error.errors);
        }
    });

    // Callback del botón de Requiere Observaciones (Feedback workflow)
    rechazarCambios.addEventListener("click", async () => {
          // Delega el flujo visual y de API a un helper complejo en alertas.js que pide la razón del rechazo
            const cambios = await alerta.rechazarCambios(info.id);
    
          // Confirmación post-interacción con el popup de SweetAlert text
        if (cambios.isConfirmed) {
            window.location.href = `#/supervisor/plan_familiar`; // Volver
        }
    });

    contenedor.append(div);

};

export default RevisionPlanController;
