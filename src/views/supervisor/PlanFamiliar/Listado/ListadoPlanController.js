/**
 * Controlador: Revisión de Plan Familiar (RevisionPlanController.js)
 * Facilita las acciones críticas para un Supervisor al evaluar un Plan Familiar.
 * Gestiona botones asíncronos para Aprobar, Rechazar (Definitivo/Cambios) y Ver PDF.
 */
import * as alerta from "../../../../helpers/alertas";
import * as api from "../../../../helpers/api";
import paginacion from "../../../../helpers/paginacion";

const ListadoPlanController = async () => {

    const id = location.hash.split("=")[1];

    const statusPlans = await api.get(`statusPlans/`);

    const profiles = await api.get(`profiles/`);

    console.log(profiles);
    
    
    const botonBack = document.getElementById("botonBack");
    const contenedor = document.querySelector(".container__paginas");

    const mensajeVacio = "No tienes ningun plan familiar realizado.";

    const carta = async (info) => {

        const div = document.createElement("div");
        div.classList.add( "tarjeta");
        console.log(info);
        

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

        const nombreVoluntario = document.createElement("div");
        nombreVoluntario.classList.add("form_autorizacion");
        const voluntarioIcono = document.createElement("i");
        voluntarioIcono.classList.add("icono--pequeno", "ri-user-line");

        

        nombreVoluntario.append(voluntarioIcono, " Voluntario: " + info.volunteer_name);

        introduccionCont.append(apellidoFamilia, departamento, fechaRecibido);

        introduccionDiv.append(imagenIcono, introduccionCont);

        
        const EstadoPlan = statusPlans.filter(status => {
            return status.id == info.status_id;
        });

        
        
        tarjetaIntroduccion.append(introduccionDiv);
        
        EstadoPlan.forEach(estado => {

            const verEstado = document.createElement("p");
            verEstado.textContent = estado.name;
            tarjetaIntroduccion.append(verEstado);
        });
        
        // console.log("info completo: ", info);
        // console.log("ID: " +info.id);
        // console.log("info: ", info.status_id);
        // console.log("estado: " , statusPlans);
        // console.log("ESTADO: " , EstadoPlan);
        

    //CONTENIDO DE LA TARJETA _____________________________________________________________________________________

        //Abrir y cerrar botonera toggle
        // const checkboxContainer = document.createElement("div");
        // checkboxContainer.classList.add("checkbox-container_botones");

        // const checkboxLabel = document.createElement("label");
        // checkboxLabel.classList.add("toggle__label");
        // checkboxLabel.setAttribute("for", `toggleBotones${info.id}`);

        // const labelText = document.createElement("p");
        // labelText.classList.add("form_autorizacion--checkbox");
        // labelText.textContent = "Acciones del Supervisor";

        // const toggleIconCont = document.createElement("div");
        // toggleIconCont.classList.add("toggle--cont__icon");

        // const iconDown = document.createElement("i");
        // iconDown.classList.add("ri-arrow-down-s-line", "toggle--icon");

        // const iconUp = document.createElement("i");
        // iconUp.classList.add("ri-arrow-up-s-line", "toggle--icon");

        // toggleIconCont.append(iconDown, iconUp);

        // checkboxLabel.append(labelText, toggleIconCont);

        // const checkbox = document.createElement("input");
        // checkbox.type = "checkbox";
        // checkbox.id = `toggleBotones${info.id}`;
        // checkbox.classList.add("toggle--hidden");

        // checkboxContainer.append(checkboxLabel, checkbox);


        //BOTONES DE ACCION _____________________________________________________________________________________
        const resvisarPlan = document.createElement("button");
        resvisarPlan.classList.add("boton", "boton--height");
        resvisarPlan.textContent = "Revisar Plan";

        const botonesContenedor = document.createElement("div");
        botonesContenedor.classList.add("tarjeta--botones");
        botonesContenedor.append(resvisarPlan);

        div.append(tarjetaIntroduccion, botonesContenedor);

        resvisarPlan.addEventListener("click", () => {
            location.href = `#/supervisor/plan_familiar/revision?familia_id=${info.id}`;
        });

        return div; // Retorna la carta completa para ser inyectada en el DOM por el helper de paginación
    }

    const recargarContainer = async () => {
        contenedor.innerHTML = "";
        await paginacion("familyPlans", mensajeVacio, carta);
    };


    await recargarContainer();

};

export default ListadoPlanController;