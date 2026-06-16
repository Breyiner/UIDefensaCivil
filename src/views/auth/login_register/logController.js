// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { alertas as alerta } from "@/helpers/index.js";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { api } from "@/helpers/index.js";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { adjuntarOpciones as adjuntarOpc } from "@/helpers/index.js";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { validacionInputs as validacion } from "@/helpers/index.js";

import * as fechas from "@/helpers/fechas";
import { initTomSelectPortatil } from "../../../helpers/tomSelectPortatil";

const logController = async () => {

    const loginCont = document.querySelector(".login");
    const registerCont = document.querySelector(".register");

    // Inicialización del semáforo global para evitar peticiones simultáneas
    if (window.procesoPeticion === undefined) {
        window.procesoPeticion = false;
    }

    //LOGIN ____________________________________________________________________________

    const formLogin = document.createElement('form');
    formLogin.classList.add("form", "form--login");

    const emailCredential = document.createElement('input')
    emailCredential.classList.add("input--azul");
    emailCredential.type = "text";
    emailCredential.placeholder = "Correo electrónico";
    emailCredential.classList.add("form__input");
    emailCredential.id = "emailCredential";
    emailCredential.autocomplete = "off";
    emailCredential.setAttribute("data-tipo", "correo");

    //-----password
    const passwordContLogin = document.createElement('div');
    passwordContLogin.classList.add("form__input--password");

    const passwordCredential = document.createElement('input')
    passwordCredential.classList.add("input--azul");
    passwordCredential.type = "password";
    passwordCredential.placeholder = "Contraseña";
    passwordCredential.classList.add("form__input");
    passwordCredential.id = "passwordCredential";
    passwordCredential.autocomplete = "off";
    passwordCredential.setAttribute("data-tipo", "passwordSinValdacion");

    const checkVistaPassword = document.createElement('input');
    checkVistaPassword.classList.add("oculto");
    checkVistaPassword.type = "checkbox";
    checkVistaPassword.classList.add("form__input--password--checkbox");
    checkVistaPassword.id = "checkVistaPassword";

    const labelVistaPassword = document.createElement('label');
    labelVistaPassword.htmlFor = "checkVistaPassword";
    labelVistaPassword.classList.add("form__input--password--label");
    
    const iconCloseEye = document.createElement('i');
    iconCloseEye.classList.add("ri-eye-close-line");

    const iconOpenEye = document.createElement('i');
    iconOpenEye.classList.add("ri-eye-fill", "oculto");

    labelVistaPassword.addEventListener("click", () => {
        if (checkVistaPassword.checked) {
            passwordCredential.type = "text";
            iconCloseEye.classList.add("oculto");
            iconOpenEye.classList.remove("oculto");
        } else {
            passwordCredential.type = "password";
            iconCloseEye.classList.remove("oculto");
            iconOpenEye.classList.add("oculto");
        }
    });

    labelVistaPassword.append(iconCloseEye, iconOpenEye);

    passwordContLogin.append(passwordCredential, checkVistaPassword, labelVistaPassword);

    const botonLogin = document.createElement('button');
    botonLogin.classList.add("boton");
    botonLogin.type = "submit";
    botonLogin.textContent = "Iniciar sesión";


    formLogin.appendChild(emailCredential);
    formLogin.appendChild(passwordContLogin);
    formLogin.appendChild(botonLogin);

    const botonesLogin = document.createElement('div');
    botonesLogin.classList.add("form__subBotones");

    const botonRecuperar = document.createElement('button');
    botonRecuperar.classList.add("form__link");
    botonRecuperar.textContent = "¿Olvidaste tu contraseña?";

    const decorationLogin = document.createElement('span');
    decorationLogin.classList.add("form__decoration");
    decorationLogin.textContent = "O";

    const botonRegistrar = document.createElement('button');
    botonRegistrar.classList.add("boton", "boton--azul");
    botonRegistrar.textContent = "¿No tienes cuenta? Regístrate";

    botonesLogin.append(botonRecuperar, decorationLogin, botonRegistrar);

    loginCont.append(formLogin, botonesLogin);

    // REGISTRO ____________________________________________________________________________

    const registerTittle = document.createElement("p");
    registerTittle.classList.add("form__tittle");
    registerTittle.textContent = "Registro";

    const formRegister = document.createElement('form');
    formRegister.classList.add("form", "form--register");
    
    // ---Nombres y apellidos
    const nameCont = document.createElement('div');
    nameCont.classList.add("form__doubleinput");

    const iconName = document.createElement('i');
    iconName.classList.add("ri-user-fill");

    const nameSection = document.createElement('div');
    nameSection.classList.add("section__input"); 

    const name = document.createElement('input')
    name.classList.add("input--azul")
    name.type = "text";
    name.placeholder = "Nombres";
    name.id = "nombres";
    name.autocomplete = "off";
    name.setAttribute("data-tipo", "textoNombres");

    nameSection.append(name);
    
    const lastNameSection = document.createElement('div');
    lastNameSection.classList.add("section__input");

    const lastName = document.createElement('input')
    lastName.classList.add("input--azul")
    lastName.type = "text";
    lastName.placeholder = "Apellidos";
    lastName.id = "apellidos";
    lastName.autocomplete = "off";
    lastName.setAttribute("data-tipo", "textoNombres");

    lastNameSection.append(lastName);
    
    nameCont.append(iconName, nameSection, lastNameSection);
    
    
    formRegister.appendChild(nameCont);

    // ---Tipo y número de documento
    const documentCont = document.createElement('div');
    documentCont.classList.add("form__doubleinput");

    const iconDocument = document.createElement('i');
    iconDocument.classList.add("ri-pass-valid-fill");

    const documentTypeSection = document.createElement('div');
    documentTypeSection.classList.add("section__input");

    const documentType = document.createElement('select');
    documentType.classList.add("input--azul");
    documentType.id = "tiposDocumento";
    documentType.classList.add("form__input");

    const optionDefault = document.createElement('option');
    optionDefault.value = "";
    optionDefault.textContent = "Tipo de documento";
    optionDefault.disabled = true;
    optionDefault.selected = true;
    
    documentType.appendChild(optionDefault);
    
    await adjuntarOpc.adjuntarInfo(documentType,"public/document-types","acronym");

    documentTypeSection.append(documentType);
    
    const documentNumberSection = document.createElement('div');
    documentNumberSection.classList.add("section__input");

    const documentNumber = document.createElement('input');
    documentNumber.classList.add("input--azul");
    documentNumber.type = "text";
    documentNumber.placeholder = "Número de documento";
    documentNumber.id = "numeroDocumento";
    documentNumber.autocomplete = "off";
    documentNumber.setAttribute("data-tipo", "documento");

    documentNumberSection.append(documentNumber);

    documentCont.append(iconDocument, documentTypeSection, documentNumberSection);

    formRegister.appendChild(documentCont);


    // ---Género y fecha de nacimiento (Contenedor doble con íconos individuales)
    const genderbirthCont = document.createElement('div');
    genderbirthCont.classList.add("form__doubleCont");

    const genderCont = document.createElement('div');
    genderCont.classList.add("form__input");

    const iconGender = document.createElement('i');
    iconGender.classList.add("ri-genderless-line");

    const genderSection = document.createElement('div');
    genderSection.classList.add("section__input");

    const gender = document.createElement('select');
    gender.classList.add("form__input", "input--azul");

    const optionDefaultGender = document.createElement('option');
    optionDefaultGender.value = "";
    optionDefaultGender.textContent = "Género";
    optionDefaultGender.disabled = true;
    optionDefaultGender.selected = true;

    gender.setAttribute("data-tipo", "requerido");
    
    gender.appendChild(optionDefaultGender);

    await adjuntarOpc.adjuntar(gender, "public/genders");

    genderSection.append(gender);

    genderCont.append(iconGender, genderSection);

    const birthCont = document.createElement('div');
    birthCont.classList.add("form__input");

    const iconBirth = document.createElement('i');
    iconBirth.classList.add("ri-calendar-event-fill");

    const birthSection = document.createElement('div');
    birthSection.classList.add("section__input");

    const birth = document.createElement('input');
    birth.classList.add("input--azul");
    birth.type = "text";
    birth.id = "nacimiento";
    birth.autocomplete = "off";
    birth.placeholder = "Fecha de nacimiento";
    birth.setAttribute("data-tipo", "fecha");
    birth.setAttribute("data-fecha", "fechaAntes");

    birthSection.append(birth);

    birthCont.append(iconBirth, birthSection);

    genderbirthCont.append(genderCont, birthCont);

    formRegister.appendChild(genderbirthCont);


    // ---Seccional y organización (Contenedor doble con íconos individuales, organización dependiente de seccional)
    const seccionalOrganizacionCont = document.createElement('div');
    seccionalOrganizacionCont.classList.add("form__doubleinput");

    const iconUbicacion = document.createElement('i');
    iconUbicacion.classList.add("ri-map-pin-2-fill");

    const seccionalSection = document.createElement('div');
    seccionalSection.classList.add("section__input");

    const seccional = document.createElement('select');
    seccional.classList.add("form__input", "input--azul");
    seccional.id = "seccionales";
    seccional.classList.add("form__input");

    const optionDefaultSeccional = document.createElement('option');
    optionDefaultSeccional.value = "";
    optionDefaultSeccional.textContent = "Seccionales";
    optionDefaultSeccional.disabled = true;
    optionDefaultSeccional.selected = true;

    seccional.appendChild(optionDefaultSeccional);

    await adjuntarOpc.adjuntar(seccional, "public/sectionals");

    seccionalSection.append(seccional);

    const organizacionSection = document.createElement('div');
    organizacionSection.classList.add("section__input");

    const organizacion = document.createElement('select');
    organizacion.classList.add("form__input", "input--azul");
    organizacion.id = "organizaciones";
    organizacion.classList.add("form__input");

    const optionDefaultOrganizacion = document.createElement('option');
    optionDefaultOrganizacion.value = "";
    optionDefaultOrganizacion.textContent = "Organización";
    optionDefaultOrganizacion.disabled = true;
    optionDefaultOrganizacion.selected = true;

    organizacion.appendChild(optionDefaultOrganizacion);

    organizacionSection.append(organizacion);

    console.log("seccionales", seccional.value);
    
    seccionalOrganizacionCont.append(iconUbicacion, seccionalSection, organizacionSection);
    
    formRegister.appendChild(seccionalOrganizacionCont);
    

    // ---Correo electrónico y teléfono (Contenedor doble con íconos individuales)
    const emailCont = document.createElement('div');
    emailCont.classList.add("form__input");
    
    const iconEmail = document.createElement('i');
    iconEmail.classList.add("ri-mail-fill");
    
    const emailSection = document.createElement('div');
    emailSection.classList.add("section__input");

    const email = document.createElement('input');
    email.classList.add("input--azul")
    email.type = "text";
    email.placeholder = "Correo electrónico";
    email.id = "correoElectronico";
    email.autocomplete = "off";
    email.setAttribute("data-tipo", "correo");

    emailSection.append(email);
    
    emailCont.append(iconEmail, emailSection);
    
    formRegister.appendChild(emailCont);
    
    const phoneCont = document.createElement('div');
    phoneCont.classList.add("form__input");
    
    const iconPhone = document.createElement('i');
    iconPhone.classList.add("ri-phone-fill");
    
    const phoneSection = document.createElement('div');
    phoneSection.classList.add("section__input");

    const phone = document.createElement('input');
    phone.classList.add("input--azul")
    phone.type = "text";
    phone.placeholder = "Número de teléfono";
    phone.id = "telefono";
    phone.autocomplete = "off";
    phone.setAttribute("data-tipo", "telefono");

    phoneSection.append(phone);
    
    phoneCont.append(iconPhone, phoneSection);
    formRegister.appendChild(phoneCont);
    

    // ---Contraseña y confirmación de contraseña (Contenedor doble con íconos individuales, validación de igualdad entre ambos campos) 
    const passwordRegisterCont = document.createElement('div');
    passwordRegisterCont.classList.add("form__doubleCont", "colum__doubleCont");
    
    const passwordCont = document.createElement('div');
    passwordCont.classList.add("form__input");
    
    const iconPassword = document.createElement('i');
    iconPassword.classList.add("ri-lock-fill");
    
    const passwordSection = document.createElement('div');
    passwordSection.classList.add("section__input");

    const password = document.createElement('input');
    password.classList.add("input--azul");
    password.type = "password";
    password.placeholder = "Contraseña";
    password.id = "contrasena";
    password.autocomplete = "off";
    password.setAttribute("data-tipo", "password");

    passwordSection.append(password);
    
    const checkVistaPasswordRegister = document.createElement('input');
    checkVistaPasswordRegister.classList.add("oculto");
    checkVistaPasswordRegister.type = "checkbox";
    checkVistaPasswordRegister.classList.add("form__input--password--checkbox");
    checkVistaPasswordRegister.id = "checkVistaPasswordRegister";
    
    const labelVistaPasswordRegister = document.createElement('label');
    labelVistaPasswordRegister.htmlFor = "checkVistaPasswordRegister";
    labelVistaPasswordRegister.classList.add("form__input--password--label");
    
    const iconCloseEyeRegister = document.createElement('i');
    iconCloseEyeRegister.classList.add("ri-eye-close-line");
    
    const iconOpenEyeRegister = document.createElement('i');
    iconOpenEyeRegister.classList.add("ri-eye-fill", "oculto");
    
    labelVistaPasswordRegister.addEventListener("click", () => {
        if (checkVistaPasswordRegister.checked) {
            password.type = "text";
            iconCloseEyeRegister.classList.add("oculto");
            iconOpenEyeRegister.classList.remove("oculto");
        } else {
            password.type = "password";
            iconCloseEyeRegister.classList.remove("oculto");
            iconOpenEyeRegister.classList.add("oculto");
        }
    });
    
    labelVistaPasswordRegister.append(iconCloseEyeRegister, iconOpenEyeRegister);
    
    passwordCont.append( checkVistaPasswordRegister, labelVistaPasswordRegister, passwordSection);
    
    const passwordComfirmCont = document.createElement('div');
    passwordComfirmCont.classList.add("form__input");
    
    const passwordComfirmSection = document.createElement('div');
    passwordComfirmSection.classList.add("section__input");

    const passwordComfirm = document.createElement('input');
    passwordComfirm.classList.add("input--azul")
    passwordComfirm.type = "password";
    passwordComfirm.placeholder = "Confirmar contraseña";
    passwordComfirm.id = "confContrasena";
    passwordComfirm.autocomplete = "off";
    passwordComfirm.setAttribute("data-tipo", "passwordSinValdacion");

    passwordComfirmSection.append(passwordComfirm);
    
    const checkVistaPasswordComfirm = document.createElement('input');
    checkVistaPasswordComfirm.classList.add("oculto");
    checkVistaPasswordComfirm.type = "checkbox";
    checkVistaPasswordComfirm.classList.add("form__input--password--checkbox");
    checkVistaPasswordComfirm.id = "checkVistaPasswordComfirm";
    
    const labelVistaPasswordComfirm = document.createElement('label');
    labelVistaPasswordComfirm.htmlFor = "checkVistaPasswordComfirm";
    labelVistaPasswordComfirm.classList.add("form__input--password--label");
    
    const iconCloseEyeComfirm = document.createElement('i');
    iconCloseEyeComfirm.classList.add("ri-eye-close-line");
    
    const iconOpenEyeComfirm = document.createElement('i');
    iconOpenEyeComfirm.classList.add("ri-eye-fill", "oculto");
    
    labelVistaPasswordComfirm.addEventListener("click", () => {
        if (checkVistaPasswordComfirm.checked) {
            passwordComfirm.type = "text";
            iconCloseEyeComfirm.classList.add("oculto");
            iconOpenEyeComfirm.classList.remove("oculto");
        } else {
            passwordComfirm.type = "password";
            iconCloseEyeComfirm.classList.remove("oculto");
            iconOpenEyeComfirm.classList.add("oculto");
        }
    });
    
    labelVistaPasswordComfirm.append(iconCloseEyeComfirm, iconOpenEyeComfirm);
    
    passwordComfirmCont.append(checkVistaPasswordComfirm, labelVistaPasswordComfirm, passwordComfirmSection);
    
    passwordRegisterCont.append(passwordCont, passwordComfirmCont);
    
    formRegister.appendChild(passwordRegisterCont);
    
    const botonesRegister = document.createElement('div');
    botonesRegister.classList.add("form__subBotones");

    const decorationRegister = document.createElement('span');
    decorationRegister.classList.add("form__decoration");
    decorationRegister.textContent = "O";

    const botonIrLogin = document.createElement('button');
    botonIrLogin.classList.add("form__link");
    botonIrLogin.textContent = "Iniciar sesión";
    
    const botonRegister = document.createElement('button');
    botonRegister.classList.add("boton");
    botonRegister.type = "submit";
    botonRegister.textContent = "Registrarse";

    
    formRegister.appendChild(botonRegister);

    botonesRegister.append(decorationRegister, botonIrLogin);
    
    registerCont.append(registerTittle, formRegister, botonesRegister);

    // Validaciones y data REGISTER ------------------------------------------------------------------------

    // Una vez que el formRegister ya está armado e insertado, 
    // ejecutamos el init para que detecte todos los data-tipo y amarre los eventos 'keydown'.
    validacion.validadorAutomatico.init(formRegister); 

    fechas.initFechas(); // se cargan el calendario

    // Limpieza visual del error en el campo de confirmación de contraseña
    const confirmacionPsw = document.getElementById("confContrasena");
    if (confirmacionPsw) {
        confirmacionPsw.addEventListener("blur", (e) => {
            validacion.limpiarError(e.target);
        });
    }

    formRegister.addEventListener("submit", async (e) => {

        e.preventDefault();

        // Si ya hay una petición de registro en curso, frena de inmediato
        if (window.procesoPeticion) return;

        // Busca el botón de envío dentro del formulario para deshabilitarlo
        const botonSubmit = formRegister.querySelector(".form__boton");
        if (botonSubmit) botonSubmit.disabled = true;
        window.procesoPeticion = true;

        // Validaciones booleanas finales
        const validacionRegister = validacion.validadorAutomatico.validarTodo(formRegister);
        const contrasenaIgualdad = validacion.validar_igualdad(password, passwordComfirm);
    
        if (!validacionRegister || !contrasenaIgualdad) {
            console.log("Error en validación de registro");
            // Si la validación falla localmente, debemos liberar el formulario
            if (botonSubmit) botonSubmit.disabled = false;
            window.procesoPeticion = false;
            return;

        } else {
            console.log("Validación de registro exitosa");
        }
    
        const dataRegistro = {
            names: name.value,
            last_names: lastName.value,
            gender_id: gender.value,
            birth_date: birth.value,
            document_type_id: documentType.value,
            document_number: documentNumber.value,
            phone: phone.value,
            organization_id: organizacion.value,
            email: email.value,
            password: password.value,
        };

        try {
          // Enlaza la ruta 'api/v1/register/' (Por omisión app)
          const data = await api.post("register", dataRegistro);

          // Verifica prop return success estándar en todo Service response de backend
          if (data.success) {

                  await alerta.alertaOK(data.message);
          //   window.location.href = "#/"
          } else alerta.alertaWarning(data.message, data.errors); // Producir array validation
          
        } catch (error) {
          alerta.alertaError(error); // Trágico 500 error o no red
        }

        // Pase lo que pase (Éxito o Error de red), volvemos a habilitar todo
        if (botonSubmit) botonSubmit.disabled = false;
        window.procesoPeticion = false;
    });
    
    seccional.addEventListener("change", async () => {
        console.log("Seccional seleccionada ID:", seccional.value); // Ahora sí verás el ID real cargado
        await adjuntarOpc.adjuntarReseteo(organizacion, `public/organizations/sectional/${seccional.value}`);
    });
}

export default logController;