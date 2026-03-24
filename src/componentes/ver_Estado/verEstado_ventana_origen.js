// Este archivo solo es el origen de los otros dos archivos que lo acompañan en ver_Estado

import * as api from "../../helpers/api";
import * as alerta from "../../helpers/alertas";

export const verEstado_input = async (datoMaestro, recargar, urlHistorial, datoText) => {

    const overlay = document.createElement("div");
    overlay.classList.add("overlay_verEstado");

    const ventana = document.createElement("div");
    ventana.classList.add("ventana");

    const nombreCont = document.createElement ("div")
    nombreCont.classList.add("nombre_Cont")

    const nombreDato = document.createElement("p");
    nombreDato.textContent = `${datoText.datoNombre}:`;
    nombreDato.classList.add("nombreDato_Estado")

    const nombre = document.createElement("p");
    nombre.textContent = `${datoMaestro[datoText.nameDB]}`;
    nombre.classList.add("nombre_Estado")

    nombreCont.append(nombreDato, nombre);

    const btnCerrarCont = document.createElement ("div")
    btnCerrarCont.classList.add("btn-cerrar-Cont");
    
    const btnCerrar = document.createElement("button");
    btnCerrar.classList.add("ri-close-line", "btn-cerrar-Estado");
    
    btnCerrarCont.append(btnCerrar);

    btnCerrar.onclick = () => { overlay.remove(); }

    const btnContEstado = document.createElement("div");
    btnContEstado.classList.add("btnContEstado");

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.classList.add("btn-editar");

    const btnHistorial = document.createElement("button");
    btnHistorial.textContent = "Ver Historial";
    btnHistorial.classList.add("btn-historial");

    btnHistorial.addEventListener("click", () => {

        // location.href = `#/administrador-datosMaestros/historial-seccional/id=${datoMaestro.id}`;
        location.href = urlHistorial;
        overlay.remove();
    });

    const btnDesactivar = document.createElement("button");
    // btnDesactivar.textContent = datoNombre.status === "Activo" ? "Desactivar" : "Activar";
    btnDesactivar.textContent = datoMaestro.is_active ? "Desactivar" : "Activar";
    btnDesactivar.classList.add(datoMaestro.is_active ? "btn-desactivar" : "btn-activar");

    btnDesactivar.addEventListener("click", async () => {

        // datoNombre.is_active;

        const nuevoEstado = datoMaestro.is_active ? 0 : 1;

        const data = await api.patch(`${datoText.urlDato}/status/${datoMaestro.id}`, { is_active: nuevoEstado });

        if (!data.success) {
            await alerta.alertaError(data.message);
            return;
        }

        await alerta.alertaOK(data.message);
    
        // Actualizar estado local y texto del botón
        datoMaestro.is_active = nuevoEstado;
        btnDesactivar.textContent = nuevoEstado === 1 ? "Desactivar" : "Activar";

        recargar();
        overlay.remove();
    });

    const btnCancelar = document.createElement("button");
    btnCancelar.textContent = "Cancelar";
    btnCancelar.classList.add("btn-cancelar");
    btnCancelar.style.display = "none";


    const btnGuardar = document.createElement("button");
    btnGuardar.textContent = "Guardar";
    btnGuardar.classList.add("btn-guardar");
    btnGuardar.style.display = "none";

    btnContEstado.append(btnEditar, btnHistorial, btnDesactivar, btnCancelar, btnGuardar);

    ventana.append( btnCerrarCont, nombreCont, btnContEstado);

    let inputNombre = null; // Variable para almacenar el input de nombre durante la edición
    
    let inputBox = null;

    let iconNombre = null;

    btnEditar.addEventListener("click", () => {

        inputBox = document.createElement("div");
        inputBox.classList.add("form__inputBox");

        iconNombre = document.createElement("i");
        iconNombre.classList.add("ri-building-fill");

        //el espacio de nombre pasa a ser placeholder y los botones pasan a ser cancelar y guardar

        inputNombre = document.createElement("input"); // Crear un nuevo input para editar el nombre
        inputNombre.type = "text";
        inputNombre.value = datoMaestro[datoText.nameDB];

        inputBox.append(iconNombre, inputNombre);

        nombre.replaceWith(inputBox);

        btnDesactivar.style.display = "none";
        btnHistorial.style.display = "none";
        btnEditar.style.display = "none";
        btnGuardar.style.display = "block";
        btnCancelar.style.display = "block";
        
    });

    btnGuardar.addEventListener("click", async  () => {

        if (!inputNombre?.value.trim()) {
            await alerta.alertaError("El nombre no puede estar vacío");
            return;
        }

        btnGuardar.disabled = true;

        const data = await api.patch(`${datoText.urlDato}/${datoMaestro.id}`, { [datoText.nameDB]: inputNombre.value });

        btnGuardar.disabled = false;

        if (!data.success) {
            await alerta.alertaError(data.message);
            return;
        }
        
        await alerta.alertaOK(data.message);
        recargar();
        overlay.remove();
    });


    btnCancelar.addEventListener("click", ()=> {

        inputBox.replaceWith(nombre);
        inputBox= null;
        inputNombre= null; // Limpiar la variable del input al cancelar

        btnDesactivar.style.display = "block";
        btnHistorial.style.display = "block";
        btnEditar.style.display = "block";
        btnGuardar.style.display = "none";
        btnCancelar.style.display = "none";
    });
        

    overlay.appendChild(ventana);
    document.body.appendChild(overlay);

    // al hacer click en overlay, se cierra la ventana
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    }

}

export const verEstado_select = async (datoMaestro, subDatoMaestro, recargar, urlHistorial , datoText) => {

    const overlay = document.createElement("div");
    overlay.classList.add("overlay_verEstado");

    const ventana = document.createElement("div");
    ventana.classList.add("ventana");

    const nombreCont = document.createElement ("div")
    nombreCont.classList.add("nombre_Cont")

    const nombreDato = document.createElement("p");
    nombreDato.textContent = `${datoText.datoNombre} de`;
    nombreDato.classList.add("nombreDato_Estado")

    const nombre = document.createElement("p")
    nombre.textContent = `${datoMaestro[datoText.nameDB]}`;
    nombre.classList.add("nombre_Estado")

    if (datoText.datoNombre == "Pregunta") {

        nombre.classList.add("esPregunta_Estado");
    }
    
    nombreCont.append(nombreDato, nombre);

    const subNombreCont = document.createElement("div");
    subNombreCont.classList.add("subNombre_Cont");

    const subNombreDato = document.createElement("p");

    subNombreDato.textContent = `${datoText.subDatoNombre}:`;
    subNombreDato.classList.add("subNombreDato_Estado");
    
    const subNombre = document.createElement("p");
    subNombre.classList.add("subNombre_Estado");
    
    if (datoText.urlSubDato == null) {
        
        if (Number(subDatoMaestro) === 1) {
            subNombre.textContent = `Si`;
        } else {
            subNombre.textContent = `No`;
        }
        
    } else {
        
        subNombre.textContent = `${subDatoMaestro[datoText.subnameDB]}`;
    }

    subNombreCont.append(subNombreDato, subNombre);

    const btnCerrarCont = document.createElement ("div")
    btnCerrarCont.classList.add("btn-cerrar-Cont");
    
    const btnCerrar = document.createElement("button");
    btnCerrar.classList.add("ri-close-line", "btn-cerrar-Estado");
    
    btnCerrarCont.append(btnCerrar);

    btnCerrar.onclick = () => { overlay.remove(); }

    const btnContEstado = document.createElement("div");
    btnContEstado.classList.add("btnContEstado");

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.classList.add("btn-editar");

    const btnHistorial = document.createElement("button");
    btnHistorial.textContent = "Ver Historial";
    btnHistorial.classList.add("btn-historial");

    btnHistorial.addEventListener("click", () => {

        location.href = urlHistorial;
        overlay.remove();
    });

    const btnDesactivar = document.createElement("button");

    btnDesactivar.textContent = datoMaestro.is_active ? "Desactivar" : "Activar";
    btnDesactivar.classList.add(datoMaestro.is_active ? "btn-desactivar" : "btn-activar");

    btnDesactivar.addEventListener("click", async () => {

        // datoNombre.is_active;

        const nuevoEstado = datoMaestro.is_active ? 0 : 1;

        const data = await api.patch(`${datoText.urlDato}/status/${datoMaestro.id}`, { is_active: nuevoEstado });

        if (!data.success) {
            await alerta.alertaError(data.message);
            return;
        }

        await alerta.alertaOK(data.message);
    
        btnDesactivar.textContent = nuevoEstado === 1 ? "Desactivar" : "Activar";

        recargar();
        overlay.remove();
    });

    const btnCancelar = document.createElement("button");
    btnCancelar.textContent = "Cancelar";
    btnCancelar.classList.add("btn-cancelar");
    btnCancelar.style.display = "none";


    const btnGuardar = document.createElement("button");
    btnGuardar.textContent = "Guardar";
    btnGuardar.classList.add("btn-guardar");
    btnGuardar.style.display = "none";

    btnContEstado.append(btnEditar, btnHistorial, btnDesactivar, btnCancelar, btnGuardar);

    ventana.append( btnCerrarCont, nombreCont, subNombreCont, btnContEstado);

    let inputNombre = null; // Variable para almacenar el input de nombre durante la edición

    let inputSubDato = null; // Variable para almacenar el select de subdato durante la edición

    let inputBox = null;

    let subInputBox =null;

    let iconNombre = null;

    let subIconNombre = null;

    btnEditar.addEventListener("click", async () => {

        //el espacio de nombre pasa a ser placeholder y los botones pasan a ser cancelar y guardar
        inputBox = document.createElement("div");
        inputBox.classList.add("form__inputBox");

        iconNombre = document.createElement("i");
        iconNombre.classList.add("ri-building-fill");

        inputNombre = document.createElement("input"); // Crear un nuevo input para editar el nombre
        inputNombre.classList.add("form__input","form__nombre");
        inputNombre.type = "text";
        inputNombre.value = datoMaestro[datoText.nameDB];

        inputBox.append(iconNombre, inputNombre);

        nombre.replaceWith(inputBox);

        subInputBox = document.createElement("div");
        subInputBox.classList.add("form__inputBox");

        subIconNombre = document.createElement("i");
        subIconNombre.classList.add("ri-article-fill");

        const opcionesSubDato = datoText.urlSubDato !== null ? await api.get(datoText.urlSubDato) : [];

        inputSubDato = document.createElement("select");
        inputSubDato.classList.add("form__input","form__seccional");

        if (datoText.urlSubDato === null) {
    
            const optionY = document.createElement("option");
            optionY.value = 1;
            optionY.textContent = "Si";
            
            const optionN = document.createElement("option");
            optionN.value = 0;
            optionN.textContent = "No";
        
            if (Number(subDatoMaestro) === 1) {
                optionY.selected = true;
            } else {
                optionN.selected = true;
            }

            inputSubDato.append(optionY, optionN);
        } else {

            opcionesSubDato.forEach(opcion => {
    
                const option = document.createElement("option");
                option.value = opcion.id;
                option.textContent = opcion[datoText.nameDB];
                if (opcion.id === subDatoMaestro.id) option.selected = true; // preselecciona el actual
                inputSubDato.append(option);
            });
        }

        subInputBox.append(subIconNombre, inputSubDato);

        subNombre.replaceWith(subInputBox);

        btnDesactivar.style.display = "none";
        btnHistorial.style.display = "none";
        btnEditar.style.display = "none";
        btnGuardar.style.display = "block";
        btnCancelar.style.display = "block";
        
    });

    btnGuardar.addEventListener("click", async  () => {

        if (!inputNombre?.value.trim()) {
            await alerta.alertaError("El nombre no puede estar vacío");
            return;
        }

        btnGuardar.disabled = true;

        // const data = await api.patch(`${url}/${datoNombre.id}`, { name: inputNombre.value });

        const data = await api.patch(`${datoText.urlDato}/${datoMaestro.id}`, { 
            [datoText.nameDB]: inputNombre.value,
            [datoText.campoDato]: inputSubDato.value
        });

        btnGuardar.disabled = false;

        if (!data.success) {
            await alerta.alertaError(data.message);
            return;
        }
        
        await alerta.alertaOK(data.message);
        recargar();
        overlay.remove();
    });


    btnCancelar.addEventListener("click", ()=> {

        inputBox.replaceWith(nombre);
        inputBox= null;
        inputNombre= null; // Limpiar la variable del input al cancelar

        subInputBox.replaceWith(subNombre);
        subInputBox = null;
        inputSubDato = null;

        btnDesactivar.style.display = "block";
        btnHistorial.style.display = "block";
        btnEditar.style.display = "block";
        btnGuardar.style.display = "none";
        btnCancelar.style.display = "none";
    });
        

    overlay.appendChild(ventana);
    document.body.appendChild(overlay);

    // al hacer click en overlay, se cierra la ventana
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    }

}

export const verEstado_doubleInput = async (datoMaestro, recargar, urlHistorial, datoText) => {

    const overlay = document.createElement("div");
    overlay.classList.add("overlay_verEstado");

    const ventana = document.createElement("div");
    ventana.classList.add("ventana");


    const nombreCont = document.createElement ("div")
    nombreCont.classList.add("nombre_Cont")

    const nombreDato = document.createElement("p");
    nombreDato.textContent = `${datoText.datoNombre}:`;
    nombreDato.classList.add("nombreDato_Estado")

    const nombre = document.createElement("p")
    nombre.textContent = `${datoMaestro[datoText.nameDB]}`;
    nombre.classList.add("nombre_Estado")

    nombreCont.append(nombreDato, nombre);

    const subNombreCont = document.createElement("div");
    subNombreCont.classList.add("subNombre_Cont");

    const subNombreDato = document.createElement("p");
    subNombreDato.classList.add("subNombreDato_Estado");
    subNombreDato.textContent = `${datoText.subDatoNombre}:`;

    const subNombre = document.createElement("p");
    subNombre.classList.add("subNombre_Estado");
    subNombre.textContent = `${datoMaestro[datoText.subnameDB]}`;

    subNombreCont.append(subNombreDato,subNombre);

    const btnCerrarCont = document.createElement ("div")
    btnCerrarCont.classList.add("btn-cerrar-Cont");
    
    const btnCerrar = document.createElement("button");
    btnCerrar.classList.add("ri-close-line", "btn-cerrar-Estado");
    
    btnCerrarCont.append(btnCerrar);

    btnCerrar.onclick = () => { overlay.remove(); }

    const btnContEstado = document.createElement("div");
    btnContEstado.classList.add("btnContEstado");

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.classList.add("btn-editar");

    const btnHistorial = document.createElement("button");
    btnHistorial.textContent = "Ver Historial";
    btnHistorial.classList.add("btn-historial");

    btnHistorial.addEventListener("click", () => {

        location.href = urlHistorial;
        overlay.remove();
    });

    const btnDesactivar = document.createElement("button");
    // btnDesactivar.textContent = datoNombre.status === "Activo" ? "Desactivar" : "Activar";
    btnDesactivar.textContent = datoMaestro.is_active ? "Desactivar" : "Activar";
    btnDesactivar.classList.add(datoMaestro.is_active ? "btn-desactivar" : "btn-activar");

    btnDesactivar.addEventListener("click", async () => {

        // datoNombre.is_active;

        const nuevoEstado = datoMaestro.is_active ? 0 : 1;

        const data = await api.patch(`${datoText.urlDato}/status/${datoMaestro.id}`, { is_active: nuevoEstado });

        if (!data.success) {
            await alerta.alertaError(data.message);
            return;
        }

        await alerta.alertaOK(data.message);
    
        // Actualizar estado local y texto del botón
        btnDesactivar.textContent = nuevoEstado ? "Desactivar" : "Activar";

        recargar();
        overlay.remove();
    });

    const btnCancelar = document.createElement("button");
    btnCancelar.textContent = "Cancelar";
    btnCancelar.classList.add("btn-cancelar");
    btnCancelar.style.display = "none";


    const btnGuardar = document.createElement("button");
    btnGuardar.textContent = "Guardar";
    btnGuardar.classList.add("btn-guardar");
    btnGuardar.style.display = "none";

    btnContEstado.append(btnEditar, btnHistorial, btnDesactivar, btnCancelar, btnGuardar);

    ventana.append( btnCerrarCont, nombreCont, subNombreCont, btnContEstado);

    let inputNombre = null; // Variable para almacenar el input de nombre durante la edición

    let inputSubDato = null; // Variable para almacenar el select de subdato durante la edición

    let inputBox = null;

    let subInputBox =null;

    let iconNombre = null;

    let subIconNombre = null;

    btnEditar.addEventListener("click", async () => {

        inputBox = document.createElement("div");
        inputBox.classList.add("form__inputBox");

        iconNombre = document.createElement("i");
        iconNombre.classList.add("ri-building-fill");

        inputNombre = document.createElement("input"); // Crear un nuevo input para editar el nombre
        inputNombre.type = "text";
        inputNombre.value = datoMaestro[datoText.nameDB];

        inputBox.append(iconNombre, inputNombre);

        nombre.replaceWith(inputBox);

        subInputBox = document.createElement("div");
        subInputBox.classList.add("form__inputBox");

        subIconNombre = document.createElement("i");
        subIconNombre.classList.add("ri-article-fill");

        inputSubDato = document.createElement("input");
        inputSubDato.type = "text";
        inputSubDato.value = datoMaestro[datoText.subnameDB];

        subInputBox.append(subIconNombre, inputSubDato);

        subNombre.replaceWith(subInputBox);

        btnDesactivar.style.display = "none";
        btnHistorial.style.display = "none";
        btnEditar.style.display = "none";
        btnGuardar.style.display = "block";
        btnCancelar.style.display = "block";
        
    });

    btnGuardar.addEventListener("click", async  () => {

        if (!inputNombre?.value.trim()) {
            await alerta.alertaError("El nombre no puede estar vacío");
            return;
        }

        btnGuardar.disabled = true;


        const data = await api.patch(`${datoText.urlDato}/${datoMaestro.id}`, {
            [datoText.nameDB]: inputNombre.value,
            [datoText.subnameDB]: inputSubDato.value
        });

        btnGuardar.disabled = false;

        if (!data.success) {
            await alerta.alertaError(data.message);
            return;
        }
        
        await alerta.alertaOK(data.message);
        recargar();
        overlay.remove();
    });


    btnCancelar.addEventListener("click", ()=> {

        inputBox.replaceWith(nombre);
        inputBox = null;
        inputNombre= null; // Limpiar la variable del input al cancelar

        subInputBox.replaceWith(subNombre);
        subInputBox =null;
        inputSubDato = null;

        btnDesactivar.style.display = "block";
        btnHistorial.style.display = "block";
        btnEditar.style.display = "block";
        btnGuardar.style.display = "none";
        btnCancelar.style.display = "none";
    });
        

    overlay.appendChild(ventana);
    document.body.appendChild(overlay);

    // al hacer click en overlay, se cierra la ventana
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    }

}