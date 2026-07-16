import * as api from "@/helpers/api";
import * as alerta from "@/helpers/alertas";

/* =====================================================
BASE COMÚN
==================================================== */

const verUsuarioVentana = async (endpoint, recargar, urlHistorial) => {
    const peticion = await api.get(endpoint);

    const overlay = document.createElement("div");
    overlay.classList.add("overlay_verEstado");

    const ventana = document.createElement("div");
    ventana.classList.add("ventana");

    const btnCerrarCont = document.createElement("div");
    btnCerrarCont.classList.add("btn-cerrar-Cont");

    const btnCerrar = document.createElement("button");
    btnCerrar.classList.add("ri-close-large-line", "btn-cerrar-Estado");
    btnCerrar.onclick = () => overlay.remove();

    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("ri-delete-bin-2-fill", "btn-eliminar");

    // CAMPOS DE INFORMACIÓN DEL USUARIO

    const historialContainer = document.createElement("div");
    historialContainer.classList.add("historial-Cont");

    //nombre ---------------------------------------------------

    const nameCont = document.createElement("div");
    nameCont.classList.add("historial__nameCont");

    const nameTittle = document.createElement("div");
    nameTittle.classList.add("historial__nameTittle");

    const nameIcon = document.createElement("i");
    nameIcon.classList.add("ri-user-line");

    const nameText = document.createElement("span");
    nameText.textContent = "Nombre: ";

    nameTittle.append(nameIcon, nameText);

    const nameValue = document.createElement("p");
    nameValue.classList.add("historial__nameValue");
    nameValue.textContent = peticion.names;

    console.log(peticion.names);

    nameCont.append(nameTittle, nameValue);

    // apellidos ---------------------------------------------------

    const lastNameCont = document.createElement("div");
    lastNameCont.classList.add("historial__lastNameCont");

    const lastNameTittle = document.createElement("div");
    lastNameTittle.classList.add("historial__lastNameTittle");

    const lastNameIcon = document.createElement("i");
    lastNameIcon.classList.add("ri-user-line");

    const lastNameText = document.createElement("span");
    lastNameText.textContent = "Apellidos: ";

    lastNameTittle.append(lastNameIcon, lastNameText);

    const lastNameValue = document.createElement("p");
    lastNameValue.classList.add("historial__lastNameValue");
    lastNameValue.textContent = peticion.last_names;

    lastNameCont.append(lastNameTittle, lastNameValue);

    // tipo de documento ---------------------------------------------------

    const documentTypeCont = document.createElement("div");
    documentTypeCont.classList.add("historial__documentTypeCont");

    const documentTypeTittle = document.createElement("div");
    documentTypeTittle.classList.add("historial__documentTypeTittle");

    const documentTypeIcon = document.createElement("i");
    documentTypeIcon.classList.add("ri-file-text-line");

    const documentTypeText = document.createElement("span");
    documentTypeText.textContent = "Tipo de documento: ";

    documentTypeTittle.append(documentTypeIcon, documentTypeText);

    const documentTypeValue = document.createElement("p");
    documentTypeValue.classList.add("historial__documentTypeValue");
    documentTypeValue.textContent = peticion.document_type;

    documentTypeCont.append(documentTypeTittle, documentTypeValue);

    // numero de documento ---------------------------------------------------

    const documentNumberCont = document.createElement("div");
    documentNumberCont.classList.add("historial__documentNumberCont");

    const documentNumberTittle = document.createElement("div");
    documentNumberTittle.classList.add("historial__documentNumberTittle");

    const documentNumberIcon = document.createElement("i");
    documentNumberIcon.classList.add("ri-file-text-line");

    const documentNumberText = document.createElement("span");
    documentNumberText.textContent = "Número de documento: ";

    documentNumberTittle.append(documentNumberIcon, documentNumberText);

    const documentNumberValue = document.createElement("p");
    documentNumberValue.classList.add("historial__documentNumberValue");
    documentNumberValue.textContent = peticion.document_number;

    documentNumberCont.append(documentNumberTittle, documentNumberValue);

    // genero ---------------------------------------------------

    const genderCont = document.createElement("div");
    genderCont.classList.add("historial__genderCont");

    const genderTittle = document.createElement("div");
    genderTittle.classList.add("historial__genderTittle");

    const genderIcon = document.createElement("i");
    genderIcon.classList.add("ri-genderless-line");

    const genderText = document.createElement("span");
    genderText.textContent = "Género: ";

    genderTittle.append(genderIcon, genderText);

    const genderValue = document.createElement("p");
    genderValue.classList.add("historial__genderValue");
    genderValue.textContent = peticion.gender;

    genderCont.append(genderTittle, genderValue);

    // cumpleaños ---------------------------------------------------

    const birthdayCont = document.createElement("div");
    birthdayCont.classList.add("historial__birthdayCont");

    const birthdayTittle = document.createElement("div");
    birthdayTittle.classList.add("historial__birthdayTittle");

    const birthdayIcon = document.createElement("i");
    birthdayIcon.classList.add("ri-calendar-line");

    const birthdayText = document.createElement("span");
    birthdayText.textContent = "Cumpleaños: ";

    birthdayTittle.append(birthdayIcon, birthdayText);

    const birthdayValue = document.createElement("p");
    birthdayValue.classList.add("historial__birthdayValue");
    birthdayValue.textContent = peticion.birth_date;

    birthdayCont.append(birthdayTittle, birthdayValue);

    // seccional ---------------------------------------------------

    const sectionalCont = document.createElement("div");
    sectionalCont.classList.add("historial__sectionalCont");

    const sectionalTittle = document.createElement("div");
    sectionalTittle.classList.add("historial__sectionalTittle");

    const sectionalIcon = document.createElement("i");
    sectionalIcon.classList.add("ri-map-pin-line");

    const sectionalText = document.createElement("span");
    sectionalText.textContent = "Seccional: ";

    sectionalTittle.append(sectionalIcon, sectionalText);

    const sectionalValue = document.createElement("p");
    sectionalValue.classList.add("historial__sectionalValue");
    sectionalValue.textContent = peticion.sectional;

    sectionalCont.append(sectionalTittle, sectionalValue);

    // organización ---------------------------------------------------

    const organizationCont = document.createElement("div");
    organizationCont.classList.add("historial__organizationCont");

    const organizationTittle = document.createElement("div");
    organizationTittle.classList.add("historial__organizationTittle");

    const organizationIcon = document.createElement("i");
    organizationIcon.classList.add("ri-map-pin-line");

    const organizationText = document.createElement("span");
    organizationText.textContent = "Organización: ";

    organizationTittle.append(organizationIcon, organizationText);

    const organizationValue = document.createElement("p");
    organizationValue.classList.add("historial__organizationValue");
    organizationValue.textContent = peticion.organization;

    organizationCont.append(organizationTittle, organizationValue);

    // rol ---------------------------------------------------

    const rolCont = document.createElement("div");
    rolCont.classList.add("historial__rolCont");

    const rolTittle = document.createElement("div");
    rolTittle.classList.add("historial__rolTittle");

    const rolIcon = document.createElement("i");
    rolIcon.classList.add("ri-map-pin-line");

    const rolText = document.createElement("span");
    rolText.textContent = "Rol: ";

    rolTittle.append(rolIcon, rolText);

    const rolValue = document.createElement("p");
    rolValue.classList.add("historial__rolValue");
    rolValue.textContent = peticion.rol;

    rolCont.append(rolTittle, rolValue);

    historialContainer.append(nameCont, lastNameCont, documentTypeCont, documentNumberCont, genderCont, birthdayCont, sectionalCont, organizationCont, rolCont);

    btnCerrarCont.append(btnCerrar);

    const btnContEstado = document.createElement("div");
    btnContEstado.classList.add("btnContEstado");

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.classList.add("btn-editar");

    /* ---------------- EDITAR ---------------- */
    let inputNombre = null;
    let inputApellidos = null;
    let inputDocumentNumber = null;
    let inputBirthday = null;

    let boxNombre = null;
    let boxApellidos = null;
    let boxDocumentNumber = null;
    let boxBirthday = null;

    btnEditar.addEventListener("click", () => {
        // nombre
        boxNombre = document.createElement("div");
        boxNombre.classList.add("form__inputBox");
        const iconNombre = document.createElement("i");
        iconNombre.classList.add("ri-user-line");
        inputNombre = document.createElement("input");
        inputNombre.type = "text";
        inputNombre.value = peticion.names;
        boxNombre.append(iconNombre, inputNombre);
        nameValue.replaceWith(boxNombre);

        // apellidos
        boxApellidos = document.createElement("div");
        boxApellidos.classList.add("form__inputBox");
        const iconApellidos = document.createElement("i");
        iconApellidos.classList.add("ri-user-line");
        inputApellidos = document.createElement("input");
        inputApellidos.type = "text";
        inputApellidos.value = peticion.last_names;
        boxApellidos.append(iconApellidos, inputApellidos);
        lastNameValue.replaceWith(boxApellidos);

        // número de documento
        boxDocumentNumber = document.createElement("div");
        boxDocumentNumber.classList.add("form__inputBox");
        const iconDocumentNumber = document.createElement("i");
        iconDocumentNumber.classList.add("ri-file-text-line");
        inputDocumentNumber = document.createElement("input");
        inputDocumentNumber.type = "text";
        inputDocumentNumber.value = peticion.document_number;
        boxDocumentNumber.append(iconDocumentNumber, inputDocumentNumber);
        documentNumberValue.replaceWith(boxDocumentNumber);

        // fecha de nacimiento
        boxBirthday = document.createElement("div");
        boxBirthday.classList.add("form__inputBox");
        const iconBirthday = document.createElement("i");
        iconBirthday.classList.add("ri-calendar-line");
        inputBirthday = document.createElement("input");
        inputBirthday.type = "date";
        inputBirthday.value = peticion.birth_date;
        boxBirthday.append(iconBirthday, inputBirthday);
        birthdayValue.replaceWith(boxBirthday);

        btnHistorial.classList.add("oculto");
        btnEditar.classList.add("oculto");
        btnGuardar.classList.remove("oculto");
        btnCancelar.classList.remove("oculto");

        btnCancelar.addEventListener("click", () => {
            boxNombre.replaceWith(nameValue);
            boxApellidos.replaceWith(lastNameValue);
            boxDocumentNumber.replaceWith(documentNumberValue);
            boxBirthday.replaceWith(birthdayValue);

            btnHistorial.classList.remove("oculto");
            btnEditar.classList.remove("oculto");
            btnGuardar.classList.add("oculto");
            btnCancelar.classList.add("oculto");
        });
    });

    const btnHistorial = document.createElement("button");
    btnHistorial.textContent = "Ver Historial";
    btnHistorial.classList.add("btn-historial");
    btnHistorial.addEventListener("click", () => {
        location.href = urlHistorial;
        overlay.remove();
    });

    const btnCancelar = document.createElement("button");
    btnCancelar.textContent = "Cancelar";
    btnCancelar.classList.add("btn-cancelar");
    btnCancelar.classList.add("oculto");

    const btnGuardar = document.createElement("button");
    btnGuardar.textContent = "Guardar";
    btnGuardar.classList.add("btn-guardar");
    btnGuardar.classList.add("oculto");

    btnContEstado.append(btnEditar, btnHistorial, btnCancelar, btnGuardar, btnEliminar);

    ventana.append(btnCerrarCont, historialContainer, btnContEstado);

    overlay.appendChild(ventana);

    const container = document.querySelector(".container");
    container.appendChild(overlay);

    overlay.onclick = (e) => {
        if (e.target === overlay) overlay.remove();
    };
};

export default verUsuarioVentana;
