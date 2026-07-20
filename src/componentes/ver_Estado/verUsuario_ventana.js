import * as api from "@/helpers/api";
import * as alerta from "@/helpers/alertas";
import { adjuntarOpciones as adjuntarOpc } from "@/helpers/index.js";
import { initTomSelectPortatil } from "@/helpers/tomSelectPortatil";

/* =====================================================
BASE COMÚN
==================================================== */

const verUsuarioVentana = async (endpoint, recargar, urlHistorial) => {

    const rolId = parseInt(localStorage.getItem("role_id"));
    const esSupervisor = rolId === 2 && location.hash.includes("supervisor");

    const peticion = await api.get(endpoint);

    console.log("PETICIÓN",peticion); 

    const overlay = document.createElement("div");
    overlay.classList.add("overlay_verEstado");

    const ventana = document.createElement("div");
    ventana.classList.add("ventana", "ventana_usuario");

    const btnCerrarCont = document.createElement("div");
    btnCerrarCont.classList.add("btn-cerrar-Cont");

    const btnCerrar = document.createElement("button");
    btnCerrar.classList.add("ri-close-large-line", "btn-cerrar-Estado");
    btnCerrar.onclick = () => overlay.remove();

    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("ri-delete-bin-2-fill", "btn-eliminar");

    // CAMPOS DE INFORMACIÓN DEL USUARIO

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

    console.log(peticion.names);

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

    // cumpleaños ---------------------------------------------------

    const birthdayCont = document.createElement("div");
    birthdayCont.classList.add("usuario__birthdayCont");

    const birthdayTittle = document.createElement("div");
    birthdayTittle.classList.add("usuario__birthdayTittle");

    const birthdayIcon = document.createElement("i");
    birthdayIcon.classList.add("ri-calendar-line");

    const birthdayText = document.createElement("span");
    birthdayText.textContent = "Cumpleaños: ";

    birthdayTittle.append(birthdayIcon, birthdayText);

    const birthdayValue = document.createElement("p");
    birthdayValue.classList.add("usuario__birthdayValue");
    birthdayValue.textContent = peticion.birth_date;

    birthdayCont.append(birthdayTittle, birthdayValue);

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
    organizationIcon.classList.add("ri-map-pin-line");

    const organizationText = document.createElement("span");
    organizationText.textContent = "Organización: ";

    organizationTittle.append(organizationIcon, organizationText);

    const organizationValue = document.createElement("p");
    organizationValue.classList.add("usuario__organizationValue");
    organizationValue.textContent = peticion.organization;

    organizationCont.append(organizationTittle, organizationValue);

    // rol ---------------------------------------------------

    const rolCont = document.createElement("div");
    rolCont.classList.add("usuario__rolCont");

    const rolTittle = document.createElement("div");
    rolTittle.classList.add("usuario__rolTittle");

    const rolIcon = document.createElement("i");
    rolIcon.classList.add("ri-map-pin-line");

    const rolText = document.createElement("span");
    rolText.textContent = "Rol: ";

    rolTittle.append(rolIcon, rolText);

    const rolValue = document.createElement("p");
    rolValue.classList.add("usuario__rolValue");
    rolValue.textContent = peticion.rol;

    rolCont.append(rolTittle, rolValue);

    usuarioContainer.append(nameCont, lastNameCont, documentTypeCont, documentNumberCont, genderCont, birthdayCont, sectionalCont, organizationCont, rolCont);

    btnCerrarCont.append(btnCerrar);

    const btnContEstado = document.createElement("div");
    btnContEstado.classList.add("btnContEstado");

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.classList.add("btn-editar");

    if (esSupervisor) {
        btnEditar.classList.add("oculto");
    }

    /* ---------------- EDITAR ---------------- */
    let inputNombre = null;
    let inputApellidos = null;
    let inputDocumentNumber = null;
    let inputBirthday = null;
    let selectDocumentType = null;
    let selectGenders = null;
    let selectSectional = null;
    let selectOrganization = null;
    let selectRol = null;

    let boxNombre = null;
    let boxApellidos = null;
    let boxDocumentNumber = null;
    let boxBirthday = null;
    let boxDocumentType = null;
    let boxGenders = null;
    let boxSectional = null;
    let boxOrganization = null;
    let boxRol = null;


    btnEditar.addEventListener("click", async () => {
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

        //tipo de documento
        boxDocumentType = document.createElement("div");
        boxDocumentType.classList.add("form__inputBox");
        const iconDocumentType = document.createElement("i");
        iconDocumentType.classList.add("ri-file-text-line");

        selectDocumentType = document.createElement("select");
        selectDocumentType.classList.add("selector-portatil");
        
        await adjuntarOpc.adjuntar(selectDocumentType, `documentTypes/`);
        selectDocumentType.value = peticion.document_type_id;

        boxDocumentType.append(iconDocumentType, selectDocumentType);
        documentTypeValue.replaceWith(boxDocumentType);

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

        // genero
        boxGenders = document.createElement("div");
        boxGenders.classList.add("form__inputBox");
        const iconGenders = document.createElement("i");
        iconGenders.classList.add("ri-file-text-line");

        selectGenders = document.createElement("select");
        selectGenders.classList.add("selector-portatil");
        
        await adjuntarOpc.adjuntar(selectGenders, `genders/`);
        selectGenders.value = peticion.gender_id;

        boxGenders.append(iconGenders, selectGenders);
        genderValue.replaceWith(boxGenders);

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
        if (!esSupervisor) {
            btnEditar.classList.add("oculto");
        }
        btnDesactivar.classList.add("oculto");
        btnGuardar.classList.remove("oculto");
        btnCancelar.classList.remove("oculto");

        // seccionales
        boxSectional = document.createElement("div");
        boxSectional.classList.add("form__inputBox");
        const iconSectional = document.createElement("i");
        iconSectional.classList.add("ri-file-text-line");

        selectSectional = document.createElement("select");
        selectSectional.classList.add("selector-portatil");
        
        await adjuntarOpc.adjuntar(selectSectional, "public/sectionals");
        selectSectional.value = peticion.sectional_id;

        boxSectional.append(iconSectional, selectSectional);
        sectionalValue.replaceWith(boxSectional);

        // organizaciones
        boxOrganization = document.createElement("div");
        boxOrganization.classList.add("form__inputBox");
        const iconOrganization = document.createElement("i");
        iconOrganization.classList.add("ri-file-text-line");

        selectOrganization = document.createElement("select");
        selectOrganization.classList.add("selector-portatil");

        await adjuntarOpc.adjuntar(selectOrganization, `public/organizations/sectional/${selectSectional.value}`);
        selectOrganization.value = peticion.organization_id;

        boxOrganization.append(iconOrganization, selectOrganization);
        organizationValue.replaceWith(boxOrganization); 

        selectSectional.addEventListener("change", async () => {
          console.log("Seccional seleccionada ID:", selectSectional.value); // Ahora sí verás el ID real cargado
          await adjuntarOpc.adjuntarReseteo(selectOrganization, `public/organizations/sectional/${selectSectional.value}`, );
        });

        // rol

        boxRol = document.createElement("div");
        boxRol.classList.add("form__inputBox");
        const iconRol = document.createElement("i");
        iconRol.classList.add("ri-file-text-line");

        selectRol = document.createElement("select");
        selectRol.classList.add("selector-portatil");
        
        const optVoluntario = document.createElement("option");
        optVoluntario.value = 3;
        optVoluntario.textContent = "Voluntario";
        
        const optSupervisor = document.createElement("option");
        optSupervisor.value = 2;
        optSupervisor.textContent = "Supervisor";
        
        selectRol.append(optVoluntario,optSupervisor);
        
        selectRol.value = peticion.rol_id;

        boxRol.append(iconRol, selectRol);

        rolValue.replaceWith(boxRol);
        
        initTomSelectPortatil();

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

    const btnDesactivar = document.createElement("button");
    btnDesactivar.textContent = peticion.status_id === 1 ? "Desactivar" : "Activar";
    btnDesactivar.classList.add(peticion.status_id === 1 ? "btn-desactivar" : "btn-activar");

    btnCancelar.addEventListener("click", () => {
        boxNombre.replaceWith(nameValue);
        boxApellidos.replaceWith(lastNameValue);
        boxDocumentType.replaceWith(documentTypeValue);
        boxDocumentNumber.replaceWith(documentNumberValue);
        boxGenders.replaceWith(genderValue);
        boxBirthday.replaceWith(birthdayValue);
        boxSectional.replaceWith(sectionalValue);
        boxOrganization.replaceWith(organizationValue);
        boxRol.replaceWith(rolValue);

        btnHistorial.classList.remove("oculto");

        if (!esSupervisor) {
            btnEditar.classList.remove("oculto");
        }

        btnDesactivar.classList.remove("oculto");
        btnGuardar.classList.add("oculto");
        btnCancelar.classList.add("oculto");
    });

    btnDesactivar.addEventListener("click", async () => {
        const nuevoEstadoId = peticion.status_id === 1 ? 2 : 1;

        const data = await api.patch("users/change-status", {
            user_ids: [peticion.id],
            state_user_id: nuevoEstadoId,
            async: false,
        });

        if (!data.success) {
            await alerta.alertaError(data.message);
            return;
        }

        await alerta.alertaOK(data.message);

        btnDesactivar.textContent = nuevoEstadoId === 1 ? "Desactivar" : "Activar";
        btnDesactivar.classList.toggle("btn-desactivar", nuevoEstadoId === 1);
        btnDesactivar.classList.toggle("btn-activar", nuevoEstadoId === 2);

        overlay.remove();
        recargar();
    });

    btnGuardar.addEventListener("click", async (e) => {

        e.preventDefault(); 

        const datosUsuario = {
            names: inputNombre.value,
            last_names: inputApellidos.value,
            document_type_id: selectDocumentType.value,
            document_number: inputDocumentNumber.value,
            gender_id: selectGenders.value,
            birth_date: inputBirthday.value,
            organization_id: selectOrganization.value,
        };

        try {
            const urlUpdate = `profiles/${peticion.profile_id}`; 
        
            // Si el usuario principal se actualizó, verificamos si cambió el rol
            const nuevoRolId = parseInt(selectRol.value);
            const antiguoRolId = parseInt(peticion.rol_id);

            if (nuevoRolId !== antiguoRolId) {
                const nombreRol = nuevoRolId === 2 ? "Supervisor" : "Voluntario";

                const dataRol = await api.patch(`users/${peticion.id}/change-role`, {
                    role: nombreRol 
                });

                // Validar si el cambio de rol también fue exitoso
                if (!dataRol || !dataRol.success) {
                    alerta.alertaWarning(dataRol.message || "Error al actualizar el rol", dataRol.errors);
                    return; // Frenamos para que puedas ver qué falló en el rol
                }
            }

            // 1. Guardamos el retorno de la API para evaluar su estado real
            const dataUser = await api.patch(urlUpdate, datosUsuario);

            // 2. Evaluamos la propiedad success estándar de tu servicio
            if (dataUser && dataUser.success) {
            
                // Si todo fue exitoso
                await alerta.alertaOK(dataUser.message || "Usuario actualizado correctamente");
                overlay.remove();
            
                if (typeof recargar === "function") {
                    recargar(); 
                } else {
                    location.reload();
                }
                
            } else {
                // Si el backend respondió success: false (Ej: Falló la validación)
                alerta.alertaWarning(dataUser.message, dataUser.errors);
            }

        } catch (error) {

            console.error("Error crítico de red/servidor:", error);
            const mensaje = error?.message || "Ocurrió un error de conexión con el servidor.";
            alerta.alertaError(mensaje);
        }
    });

    btnContEstado.append(btnEditar, btnHistorial, btnDesactivar, btnCancelar, btnGuardar, btnEliminar);

    ventana.append(btnCerrarCont, usuarioContainer, btnContEstado);

    overlay.appendChild(ventana);

    const container = document.querySelector(".container");
    container.appendChild(overlay);

    overlay.onclick = (e) => {
        if (e.target === overlay) overlay.remove();
    };
};

export default verUsuarioVentana;
