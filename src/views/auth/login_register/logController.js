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

    const resetForm = (form) => {
        
        form.reset();
        form.querySelectorAll("input, select").forEach(el => el.value = "");
        form.querySelectorAll(".error").forEach(el => el.remove());

        // Limpia también la capa visual de TomSelect en los selects que lo tengan activo
        form.querySelectorAll(".selector-portatil").forEach(el => {
            if (el.tomselect) {
                el.tomselect.clear(); // Quita la selección visual
            }
        });
    };

    // Inicialización del semáforo global para evitar peticiones simultáneas
    if (window.procesoPeticion === undefined) {
        window.procesoPeticion = false;
    }

    //LOGIN ____________________________________________________________________________

    const formLogin = document.createElement('form');
    formLogin.classList.add("form", "form--login");

    const emailWrapper = document.createElement('div');
    emailWrapper.classList.add("input");

    const emailInputBox = document.createElement('div');
    emailInputBox.classList.add("input--azul");

    const iconEmailLogin = document.createElement('i');
    iconEmailLogin.classList.add("ri-mail-line");

    const emailCredential = document.createElement('input');
    emailCredential.type = "text";
    emailCredential.placeholder = "Correo electrónico";
    emailCredential.id = "emailCredential";
    emailCredential.autocomplete = "off";
    emailCredential.setAttribute("data-tipo", "correo");

    emailInputBox.append(iconEmailLogin, emailCredential);
    emailWrapper.appendChild(emailInputBox);

    //-----password
    const passwordWrapper = document.createElement('div');
    passwordWrapper.classList.add("input");

    const passwordInputBox = document.createElement('div');
    passwordInputBox.classList.add("input--azul");

    const iconLockLogin = document.createElement('i');
    iconLockLogin.classList.add("ri-lock-fill");

    const passwordCredential = document.createElement('input');
    passwordCredential.type = "password";
    passwordCredential.placeholder = "Contraseña";
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
        if (!checkVistaPassword.checked) {
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

    passwordInputBox.append(iconLockLogin, passwordCredential, checkVistaPassword, labelVistaPassword);
    passwordWrapper.appendChild(passwordInputBox);

    const botonLogin = document.createElement('button');
    botonLogin.classList.add("boton", "form__boton");
    botonLogin.type = "submit";
    botonLogin.textContent = "Iniciar sesión";

    formLogin.appendChild(emailWrapper);
    formLogin.appendChild(passwordWrapper);
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

    // Validaciones y data LOGIN
    validacion.validadorAutomatico.init(formLogin);
    
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (window.procesoPeticion) return;
      botonLogin.disabled = true;
      window.procesoPeticion = true;

      const validacionLogin = validacion.validadorAutomatico.validarTodo(formLogin);

      if (!validacionLogin) {
        console.log("Error en validación de sesión");
        botonLogin.disabled = false;
        window.procesoPeticion = false;
        return;
      };

      const dataLogin = {
        email: emailCredential.value,
        password: passwordCredential.value,
      };

      // Solicita Tokenización o aprobación a servicio
      const data = await api.post("login", dataLogin);

      // Branch exitoso de promesa Fetch nativa
      if (data && data.success) {
        const atributos = data.data; // Extrae JSON profundo de la prop key "data" devuelta

        // Persiste atributos básicos de perfilamiento offline localmente para toda la persistencia app
        localStorage.setItem("full_name", atributos.full_name);
        localStorage.setItem("id", atributos.id);
        localStorage.setItem("permissions", atributos.permissions);
        localStorage.setItem("role_id", atributos.role_id);
        localStorage.setItem("sectional_id", atributos.sectional_id);
        localStorage.setItem("gender_id", atributos.gender);
        localStorage.setItem("access_token", atributos.token);
        localStorage.setItem("refresh_token", atributos.refresh_token);

        // Presenta mensaje de bienvenida / Éxito dictado por Api
        await alerta.alertaOK(data.message);

        // Enrutador cliente "Router" manual leyendo permisos o rol ID local
        if (atributos.role_id == 1)
          window.location.href = "#/administrador"; // Dashboard Administrador Supremo

        else if (atributos.role_id == 2)
          window.location.href = "#/supervisor"; // Dashboard Supervisor (Tercero)

        else if (atributos.role_id == 3)
          window.location.href = "#/voluntario"; // Dashboard Voluntario

        else window.location.href = "#/"; // Contingencia en caso raro

      } else {
        // Branch fallido (Ej: Credenciales incorrectas)
        await alerta.alertaError(data.message);
      }

      // Rehabilitación del sistema general
      botonLogin.disabled = false;
      window.procesoPeticion = false;

    });

    botonRecuperar.addEventListener("click", async (e) =>{
        window.location.href = "#/forgotPassword";
    });

    botonRegistrar.addEventListener("click", () => {
        resetForm(formLogin);
        loginCont.classList.remove("active");
        registerCont.classList.add("active");
    });

    // REGISTRO ____________________________________________________________________________

    const registerTittle = document.createElement("p");
    registerTittle.classList.add("form__tittle");
    registerTittle.textContent = "Registro";

    const formRegister = document.createElement('form');
    formRegister.classList.add("form", "form--register");
    
    // ---Nombres y apellidos
    const nameCont = document.createElement('div');
    nameCont.classList.add("form__doubleinput");

    // Nombres
    const nameWrapper = document.createElement('div');
    nameWrapper.classList.add("input");
    const nameInputBox = document.createElement('div');
    nameInputBox.classList.add("input--azul");
    const iconName = document.createElement('i');
    iconName.classList.add("ri-user-fill");

    const name = document.createElement('input')
    // name.classList.add("input--azul")
    name.type = "text";
    name.placeholder = "Nombres";
    name.id = "nombres";
    name.autocomplete = "off";
    name.setAttribute("data-tipo", "textoNombres");

    nameInputBox.append(iconName, name);
    nameWrapper.append(nameInputBox);
    
    // Apellidos
    const lastNameWrapper = document.createElement('div');
    lastNameWrapper.classList.add("input");
    const lastNameInputBox = document.createElement('div');
    lastNameInputBox.classList.add("input--azul");
    const iconLastName = document.createElement('i');
    iconLastName.classList.add("ri-user-fill");

    const lastName = document.createElement('input')
    lastName.type = "text";
    lastName.placeholder = "Apellidos";
    lastName.id = "apellidos";
    lastName.autocomplete = "off";
    lastName.setAttribute("data-tipo", "textoNombres");

    lastNameInputBox.append(iconLastName, lastName);
    lastNameWrapper.append(lastNameInputBox);
    
    nameCont.append(nameWrapper, lastNameWrapper);
    formRegister.appendChild(nameCont);

    // ---Tipo y número de documento
    const documentCont = document.createElement('div');
    documentCont.classList.add("form__doubleinput");

    // Tipo de documento
    const docTypeWrapper = document.createElement('div');
    docTypeWrapper.classList.add("input");
    const docTypeInputBox = document.createElement('div');
    docTypeInputBox.classList.add("input--azul");
    const iconDocType = document.createElement('i');
    iconDocType.classList.add("ri-pass-valid-fill");

    const documentType = document.createElement('select');
    documentType.classList.add("selector-portatil");
    documentType.id = "tiposDocumento";

    const optionDefault = document.createElement('option');
    optionDefault.value = "";
    optionDefault.textContent = "Tipo de documento";
    optionDefault.disabled = true;
    optionDefault.selected = true;
    
    documentType.appendChild(optionDefault);
    await adjuntarOpc.adjuntarInfo(documentType,"public/document-types","acronym");

    docTypeInputBox.append(iconDocType, documentType);
    docTypeWrapper.append(docTypeInputBox);
    
    // Número de documento
    const docNumWrapper = document.createElement('div');
    docNumWrapper.classList.add("input");
    const docNumInputBox = document.createElement('div');
    docNumInputBox.classList.add("input--azul");
    const iconDocNum = document.createElement('i');
    iconDocNum.classList.add("ri-info-card-line");

    const documentNumber = document.createElement('input');
    documentNumber.type = "text";
    documentNumber.placeholder = "Número de documento";
    documentNumber.id = "numeroDocumento";
    documentNumber.autocomplete = "off";
    documentNumber.setAttribute("data-tipo", "documento");

    docNumInputBox.append(iconDocNum, documentNumber);
    docNumWrapper.append(docNumInputBox);

    documentCont.append(docTypeWrapper, docNumWrapper);
    formRegister.appendChild(documentCont);

    // ---Género y fecha de nacimiento
    const genderbirthCont = document.createElement('div');
    genderbirthCont.classList.add("form__doubleCont");

    // Género
    const genderWrapper = document.createElement('div');
    genderWrapper.classList.add("input");
    const genderInputBox = document.createElement('div');
    genderInputBox.classList.add("input--azul");
    const iconGender = document.createElement('i');
    iconGender.classList.add("ri-genderless-line");

    const gender = document.createElement('select');
    gender.classList.add("selector-portatil");
    gender.id = "gender";

    const optionDefaultGender = document.createElement('option');
    optionDefaultGender.value = "";
    optionDefaultGender.textContent = "Género";
    optionDefaultGender.disabled = true;
    optionDefaultGender.selected = true;

    gender.setAttribute("data-tipo", "requerido");
    gender.appendChild(optionDefaultGender);
    await adjuntarOpc.adjuntar(gender, "public/genders");

    genderInputBox.append(iconGender, gender);
    genderWrapper.append(genderInputBox);

    // Fecha de nacimiento
    const birthWrapper = document.createElement('div');
    birthWrapper.classList.add("input");
    const birthInputBox = document.createElement('div');
    birthInputBox.classList.add("input--azul");
    const iconBirth = document.createElement('i');
    iconBirth.classList.add("ri-calendar-event-fill");

    const birth = document.createElement('input');
    birth.type = "text";
    birth.id = "nacimiento";
    birth.autocomplete = "off";
    birth.placeholder = "Fecha de nacimiento";
    birth.setAttribute("data-tipo", "fecha");
    birth.setAttribute("data-fecha", "fechaAntes");

    birthInputBox.append(iconBirth, birth);
    birthWrapper.append(birthInputBox);

    genderbirthCont.append(genderWrapper, birthWrapper);
    formRegister.appendChild(genderbirthCont);

    // ---Seccional y organización
    const seccionalOrganizacionCont = document.createElement('div');
    seccionalOrganizacionCont.classList.add("form__doubleinput");

    // Seccional
    const seccionalWrapper = document.createElement('div');
    seccionalWrapper.classList.add("input");
    const seccionalInputBox = document.createElement('div');
    seccionalInputBox.classList.add("input--azul");
    const iconSeccional = document.createElement('i');
    iconSeccional.classList.add("ri-map-pin-2-fill");

    const seccional = document.createElement('select');
    seccional.classList.add("selector-portatil");
    seccional.id = "seccionales";

    const optionDefaultSeccional = document.createElement('option');
    optionDefaultSeccional.value = "";
    optionDefaultSeccional.textContent = "Seccionales";
    optionDefaultSeccional.disabled = true;
    optionDefaultSeccional.selected = true;

    seccional.appendChild(optionDefaultSeccional);
    await adjuntarOpc.adjuntar(seccional, "public/sectionals");

    seccionalInputBox.append(iconSeccional, seccional);
    seccionalWrapper.append(seccionalInputBox);

    // Organización
    const organizacionWrapper = document.createElement('div');
    organizacionWrapper.classList.add("input");
    const organizacionInputBox = document.createElement('div');
    organizacionInputBox.classList.add("input--azul");
    const iconOrganizacion = document.createElement('i');
    iconOrganizacion.classList.add("ri-map-pin-2-fill");

    const organizacion = document.createElement('select');
    organizacion.classList.add("selector-portatil");
    organizacion.id = "organizaciones";

    const optionDefaultOrganizacion = document.createElement('option');
    optionDefaultOrganizacion.value = "";
    optionDefaultOrganizacion.textContent = "Organización";
    optionDefaultOrganizacion.disabled = true;
    optionDefaultOrganizacion.selected = true;

    organizacion.appendChild(optionDefaultOrganizacion);

    organizacionInputBox.append(iconOrganizacion, organizacion);
    organizacionWrapper.append(organizacionInputBox);

    console.log("seccionales", seccional.value);
    
    seccionalOrganizacionCont.append(seccionalWrapper, organizacionWrapper);
    formRegister.appendChild(seccionalOrganizacionCont);
    
    // ---Correo electrónico
    const emailWrapperReg = document.createElement('div');
    emailWrapperReg.classList.add("input");
    const emailInputBoxReg = document.createElement('div');
    emailInputBoxReg.classList.add("input--azul");
    const iconEmailReg = document.createElement('i');
    iconEmailReg.classList.add("ri-mail-fill");

    const email = document.createElement('input');
    email.type = "text";
    email.placeholder = "Correo electrónico";
    email.id = "correoElectronico";
    email.autocomplete = "off";
    email.setAttribute("data-tipo", "correo");

    emailInputBoxReg.append(iconEmailReg, email);
    emailWrapperReg.append(emailInputBoxReg);
    formRegister.appendChild(emailWrapperReg);
    
    // ---Teléfono
    const phoneWrapperReg = document.createElement('div');
    phoneWrapperReg.classList.add("input");
    const phoneInputBoxReg = document.createElement('div');
    phoneInputBoxReg.classList.add("input--azul");
    const iconPhoneReg = document.createElement('i');
    iconPhoneReg.classList.add("ri-phone-fill");

    const phone = document.createElement('input');
    phone.type = "text";
    phone.placeholder = "Número de teléfono";
    phone.id = "telefono";
    phone.autocomplete = "off";
    phone.setAttribute("data-tipo", "telefono");

    phoneInputBoxReg.append(iconPhoneReg, phone);
    phoneWrapperReg.append(phoneInputBoxReg);
    formRegister.appendChild(phoneWrapperReg);
    
    // ---Contraseña y confirmación de contraseña
    const passwordRegisterCont = document.createElement('div');
    passwordRegisterCont.classList.add("form__doubleCont", "colum__doubleCont");
    
    // Contraseña
    const passRegWrapper = document.createElement('div');
    passRegWrapper.classList.add("input");
    const passRegInputBox = document.createElement('div');
    passRegInputBox.classList.add("input--azul");
    const iconPasswordReg = document.createElement('i');
    iconPasswordReg.classList.add("ri-lock-fill");

    const password = document.createElement('input');
    password.type = "password";
    password.placeholder = "Contraseña";
    password.id = "contrasena";
    password.autocomplete = "off";
    password.setAttribute("data-tipo", "password");
    
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
        if (!checkVistaPasswordRegister.checked) {
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
    
    passRegInputBox.append(iconPasswordReg, password, checkVistaPasswordRegister, labelVistaPasswordRegister);
    passRegWrapper.append(passRegInputBox);
    
    // Confirmar contraseña
    const passConfirmWrapper = document.createElement('div');
    passConfirmWrapper.classList.add("input");
    const passConfirmInputBox = document.createElement('div');
    passConfirmInputBox.classList.add("input--azul");
    const iconPasswordConfirm = document.createElement('i');
    iconPasswordConfirm.classList.add("ri-lock-fill");

    const passwordComfirm = document.createElement('input');
    passwordComfirm.type = "password";
    passwordComfirm.placeholder = "Confirmar contraseña";
    passwordComfirm.id = "confContrasena";
    passwordComfirm.autocomplete = "off";
    passwordComfirm.setAttribute("data-tipo", "passwordConfirm");
    
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
        if (!checkVistaPasswordComfirm.checked) {
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
    
    passConfirmInputBox.append(iconPasswordConfirm, passwordComfirm, checkVistaPasswordComfirm, labelVistaPasswordComfirm);
    passConfirmWrapper.append(passConfirmInputBox);
    
    passwordRegisterCont.append(passRegWrapper, passConfirmWrapper);
    formRegister.appendChild(passwordRegisterCont);
    
    const botonesRegister = document.createElement('div');
    botonesRegister.classList.add("form__subBotones");

    const decorationRegister = document.createElement('span');
    decorationRegister.classList.add("form__decoration");
    decorationRegister.textContent = "O";

    const botonIrLogin = document.createElement('button');
    botonIrLogin.classList.add("boton", "boton--azul");
    botonIrLogin.textContent = "Iniciar sesión";
    
    const botonRegister = document.createElement('button');
    botonRegister.classList.add("boton", "form__boton");
    botonRegister.type = "submit";
    botonRegister.textContent = "Registrarse";

    formRegister.appendChild(botonRegister);
    botonesRegister.append(decorationRegister, botonIrLogin);
    
    registerCont.append(registerTittle, formRegister, botonesRegister);

    
    // Validaciones y data REGISTER ------------------------------------------------------------------------
    
    validacion.validadorAutomatico.init(formRegister); 
    
    fechas.initFechas(); // se carga el calendario
    
    // Limpieza visual del error en el campo de confirmación de contraseña
    const confirmacionPsw = document.getElementById("confContrasena");
    if (confirmacionPsw) {
        confirmacionPsw.addEventListener("blur", (e) => {
            validacion.limpiarError(e.target);
        });
    }
    
    initTomSelectPortatil(); 

    formRegister.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (window.procesoPeticion) return;

        botonRegister.disabled = true;
        window.procesoPeticion = true;

        const validacionRegister = validacion.validadorAutomatico.validarTodo(formRegister);
        const contrasenaIgualdad = validacion.validar_igualdad(passwordComfirm, password);
    
        if (!validacionRegister || !contrasenaIgualdad) {
            console.log("Error en validación de registro");
            botonRegister.disabled = false;
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
          const data = await api.post("register", dataRegistro);

          if (data.success) {
            await alerta.alertaOK(data.message);
            resetForm(formRegister);
            registerCont.classList.remove("active");
            loginCont.classList.add("active");
          } else alerta.alertaWarning(data.message, data.errors);
          
        } catch (error) {
          alerta.alertaError(error);
        }

        botonRegister.disabled = false;
        window.procesoPeticion = false;
    });

    botonIrLogin.addEventListener("click", () => {
        resetForm(formRegister);
        registerCont.classList.remove("active");
        loginCont.classList.add("active");
    });
    
    seccional.addEventListener("change", async () => {
        console.log("Seccional seleccionada ID:", seccional.value);
        await adjuntarOpc.adjuntarReseteo(organizacion, `public/organizations/sectional/${seccional.value}`);
    });
}

export default logController;