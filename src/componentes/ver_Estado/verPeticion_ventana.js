import * as api from "@/helpers/api";
import * as alerta from "@/helpers/alertas";
import { adjuntarOpciones as adjuntarOpc } from "@/helpers/index.js";
import { initTomSelectPortatil } from "@/helpers/tomSelectPortatil";

const verPeticionVentana = async (endpoint, recargar, esAdmin) => {

    const peticion = await api.get(endpoint);

    const overlay = document.createElement("div");
    overlay.classList.add("overlay_verEstado");

    const ventana = document.createElement("div");
    ventana.classList.add("ventana", "ventana_usuario");

    const btnCerrarCont = document.createElement("div");
    btnCerrarCont.classList.add("btn-cerrar-Cont");

    const btnCerrar = document.createElement("button");
    btnCerrar.classList.add("ri-close-large-line", "btn-cerrar-Estado");
    btnCerrar.onclick = () => overlay.remove();

    btnCerrarCont.append(btnCerrar);

    // CAMPOS DE INFORMACIÓN DEL USUARIO (solo lectura)
    const usuarioContainer = document.createElement("div");
    usuarioContainer.classList.add("usuario-Cont");

    //nombre ---------------------------------------------------
    const nameCont = document.createElement("div");
    nameCont.classList.add("usuario__nameCont");
    const nameTittle = document.createElement("div");
    nameTittle.classList.add("usuario__nameTittle");
    const nameIcon = document.createElement("i");
    nameIcon.classList.add("ri-user-line");
    const nameText = document.createElement("span");
    nameText.textContent = "Nombre: ";
    nameTittle.append(nameIcon, nameText);
    const nameValue = document.createElement("p");
    nameValue.classList.add("usuario__nameValue");
    nameValue.textContent = peticion.names;
    nameCont.append(nameTittle, nameValue);

    // apellidos ---------------------------------------------------
    const lastNameCont = document.createElement("div");
    lastNameCont.classList.add("usuario__lastNameCont");
    const lastNameTittle = document.createElement("div");
    lastNameTittle.classList.add("usuario__lastNameTittle");
    const lastNameIcon = document.createElement("i");
    lastNameIcon.classList.add("ri-user-line");
    const lastNameText = document.createElement("span");
    lastNameText.textContent = "Apellidos: ";
    lastNameTittle.append(lastNameIcon, lastNameText);
    const lastNameValue = document.createElement("p");
    lastNameValue.classList.add("usuario__lastNameValue");
    lastNameValue.textContent = peticion.last_names;
    lastNameCont.append(lastNameTittle, lastNameValue);

    // correo ---------------------------------------------------
    const emailCont = document.createElement("div");
    emailCont.classList.add("usuario__emailCont");
    const emailTittle = document.createElement("div");
    emailTittle.classList.add("usuario__emailTittle");
    const emailIcon = document.createElement("i");
    emailIcon.classList.add("ri-mail-line");
    const emailText = document.createElement("span");
    emailText.textContent = "Correo: ";
    emailTittle.append(emailIcon, emailText);
    const emailValue = document.createElement("p");
    emailValue.classList.add("usuario__emailValue");
    emailValue.textContent = peticion.email;
    emailCont.append(emailTittle, emailValue);

    // tipo de documento ---------------------------------------------------
    const documentTypeCont = document.createElement("div");
    documentTypeCont.classList.add("usuario__documentTypeCont");
    const documentTypeTittle = document.createElement("div");
    documentTypeTittle.classList.add("usuario__documentTypeTittle");
    const documentTypeIcon = document.createElement("i");
    documentTypeIcon.classList.add("ri-file-text-line");
    const documentTypeText = document.createElement("span");
    documentTypeText.textContent = "Tipo de documento: ";
    documentTypeTittle.append(documentTypeIcon, documentTypeText);
    const documentTypeValue = document.createElement("p");
    documentTypeValue.classList.add("usuario__documentTypeValue");
    documentTypeValue.textContent = peticion.document_type;
    documentTypeCont.append(documentTypeTittle, documentTypeValue);

    // numero de documento ---------------------------------------------------
    const documentNumberCont = document.createElement("div");
    documentNumberCont.classList.add("usuario__documentNumberCont");
    const documentNumberTittle = document.createElement("div");
    documentNumberTittle.classList.add("usuario__documentNumberTittle");
    const documentNumberIcon = document.createElement("i");
    documentNumberIcon.classList.add("ri-file-text-line");
    const documentNumberText = document.createElement("span");
    documentNumberText.textContent = "Número de documento: ";
    documentNumberTittle.append(documentNumberIcon, documentNumberText);
    const documentNumberValue = document.createElement("p");
    documentNumberValue.classList.add("usuario__documentNumberValue");
    documentNumberValue.textContent = peticion.document_number;
    documentNumberCont.append(documentNumberTittle, documentNumberValue);

    // fecha de nacimiento ---------------------------------------------------
    const birthdayCont = document.createElement("div");
    birthdayCont.classList.add("usuario__birthdayCont");
    const birthdayTittle = document.createElement("div");
    birthdayTittle.classList.add("usuario__birthdayTittle");
    const birthdayIcon = document.createElement("i");
    birthdayIcon.classList.add("ri-calendar-line");
    const birthdayText = document.createElement("span");
    birthdayText.textContent = "Fecha de nacimiento: ";
    birthdayTittle.append(birthdayIcon, birthdayText);
    const birthdayValue = document.createElement("p");
    birthdayValue.classList.add("usuario__birthdayValue");
    birthdayValue.textContent = peticion.birth_date;
    birthdayCont.append(birthdayTittle, birthdayValue);

    // genero ---------------------------------------------------
    const genderCont = document.createElement("div");
    genderCont.classList.add("usuario__genderCont");
    const genderTittle = document.createElement("div");
    genderTittle.classList.add("usuario__genderTittle");
    const genderIcon = document.createElement("i");
    genderIcon.classList.add("ri-genderless-line");
    const genderText = document.createElement("span");
    genderText.textContent = "Género: ";
    genderTittle.append(genderIcon, genderText);
    const genderValue = document.createElement("p");
    genderValue.classList.add("usuario__genderValue");
    genderValue.textContent = peticion.gender;
    genderCont.append(genderTittle, genderValue);

    // telefono ---------------------------------------------------
    const phoneCont = document.createElement("div");
    phoneCont.classList.add("usuario__phoneCont");
    const phoneTittle = document.createElement("div");
    phoneTittle.classList.add("usuario__phoneTittle");
    const phoneIcon = document.createElement("i");
    phoneIcon.classList.add("ri-phone-line");
    const phoneText = document.createElement("span");
    phoneText.textContent = "Teléfono: ";
    phoneTittle.append(phoneIcon, phoneText);
    const phoneValue = document.createElement("p");
    phoneValue.classList.add("usuario__phoneValue");
    phoneValue.textContent = peticion.phone;
    phoneCont.append(phoneTittle, phoneValue);

    // seccional ---------------------------------------------------
    const sectionalCont = document.createElement("div");
    sectionalCont.classList.add("usuario__sectionalCont");
    const sectionalTittle = document.createElement("div");
    sectionalTittle.classList.add("usuario__sectionalTittle");
    const sectionalIcon = document.createElement("i");
    sectionalIcon.classList.add("ri-map-pin-line");
    const sectionalText = document.createElement("span");
    sectionalText.textContent = "Seccional: ";
    sectionalTittle.append(sectionalIcon, sectionalText);
    const sectionalValue = document.createElement("p");
    sectionalValue.classList.add("usuario__sectionalValue");
    sectionalValue.textContent = peticion.sectional;
    sectionalCont.append(sectionalTittle, sectionalValue);

    // organización ---------------------------------------------------
    const organizationCont = document.createElement("div");
    organizationCont.classList.add("usuario__organizationCont");
    const organizationTittle = document.createElement("div");
    organizationTittle.classList.add("usuario__organizationTittle");
    const organizationIcon = document.createElement("i");
    organizationIcon.classList.add("ri-building-line");
    const organizationText = document.createElement("span");
    organizationText.textContent = "Organización: ";
    organizationTittle.append(organizationIcon, organizationText);
    const organizationValue = document.createElement("p");
    organizationValue.classList.add("usuario__organizationValue");
    organizationValue.textContent = peticion.organization;
    organizationCont.append(organizationTittle, organizationValue);

    usuarioContainer.append(
        nameCont, lastNameCont, emailCont, documentTypeCont,
        documentNumberCont, birthdayCont, genderCont, phoneCont,
        sectionalCont, organizationCont
    );

    // asignar rol (solo admin) ---------------------------------------------------
    let selectRol = null;

    if (esAdmin) {

        const rolCont = document.createElement("div");
        rolCont.classList.add("usuario__rolCont");

        const rolTittle = document.createElement("div");
        rolTittle.classList.add("usuario__rolTittle");
        const rolIcon = document.createElement("i");
        rolIcon.classList.add("ri-admin-line");
        const rolText = document.createElement("span");
        rolText.textContent = "Asignar Rol: ";
        rolTittle.append(rolIcon, rolText);

        selectRol = document.createElement("select");
        selectRol.classList.add("selector-portatil");

        const optVoluntario = document.createElement("option");
        optVoluntario.value = 3;
        optVoluntario.textContent = "Voluntario";

        const optSupervisor = document.createElement("option");
        optSupervisor.value = 2;
        optSupervisor.textContent = "Supervisor";
        
        selectRol.append(optVoluntario, optSupervisor);
        
        rolCont.append(rolTittle, selectRol);
        usuarioContainer.append(rolCont);

    }

    // botones ---------------------------------------------------
    const btnContEstado = document.createElement("div");
    btnContEstado.classList.add("btnContEstado");

    const btnAprobar = document.createElement("button");
    btnAprobar.textContent = "Aprobar";
    btnAprobar.classList.add("btn-activar");

    const btnRechazar = document.createElement("button");
    btnRechazar.textContent = "Rechazar";
    btnRechazar.classList.add("btn-eliminar-peticion"); // ajusta a tu clase real de botón destructivo con texto

    btnAprobar.addEventListener("click", async () => {

        const confirmacion = await alerta.alertaQuest("¿Seguro que deseas aprobar esta petición?");

        if (!confirmacion.isConfirmed) return;

        try {
            const rolSeleccionado = selectRol?.value ?? 3;

            const response = await api.patch("users/change-status", {
                user_ids: [peticion.id],
                state_user_id: 1,
                async: false,
            });

            if (!response.success) {
                await alerta.alertaWarning(response.message, response.errors);
                return;
            }

            if (esAdmin) {
                const dataRol = await api.patch(`users/${peticion.id}/change-role`, {
                    role: rolSeleccionado == 2 ? "Supervisor" : "Voluntario",
                });

                if (!dataRol.success) {
                    await alerta.alertaWarning(dataRol.message, dataRol.errors);
                    return;
                }
            }

            await alerta.alertaOK(response.message);
            overlay.remove();
            recargar();

        } catch (error) {
            console.error(error);
            await alerta.alertaError("Error al aprobar la petición");
        }
    });

    btnRechazar.addEventListener("click", async () => {

        const confirmacion = await alerta.alertaQuest("¿Seguro que deseas rechazar y eliminar esta petición?");

        if (!confirmacion.isConfirmed) return;

        try {
            const response = await api.delet(`users/${peticion.id}`);

            if (!response.success) {
                await alerta.alertaWarning(response.message, response.errors);
                return;
            }

            await alerta.alertaOK(response.message);
            overlay.remove();
            recargar();

        } catch (error) {
            console.error(error);
            await alerta.alertaError("Error al rechazar la petición");
        }
    });

    btnContEstado.append(btnAprobar, btnRechazar);

    ventana.append(btnCerrarCont, usuarioContainer, btnContEstado);

    overlay.appendChild(ventana);

    const container = document.querySelector(".container");
    container.appendChild(overlay);

    initTomSelectPortatil();

    overlay.onclick = (e) => {
        if (e.target === overlay) overlay.remove();
    };
};

export default verPeticionVentana;