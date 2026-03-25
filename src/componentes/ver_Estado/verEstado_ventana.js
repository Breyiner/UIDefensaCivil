import * as api from "../../helpers/api";
import * as alerta from "../../helpers/alertas";

export const verEstado_input = async (datoNombre, datoMaestro, url, recargar, urlHistorial, nombrePri) => {

    const overlay = document.createElement("div");
    overlay.classList.add("overlay_verEstado");

    const ventana = document.createElement("div");
    ventana.classList.add("ventana");

    const nombre = document.createElement("p");
    nombre.textContent = `${datoNombre} de ${datoMaestro[nombrePri]}`;

    const btnCerrar = document.createElement("button");
    btnCerrar.classList.add("ri-close-line", "btn-cerrar-Estado");
    // btnCerrar.innerHTML = `<i class="ri-close-line"></i>`;

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

        const data = await api.patch(`${url}/status/${datoMaestro.id}`, { is_active: nuevoEstado });

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

    ventana.append( nombre, btnContEstado, btnCerrar);

    let inputNombre = null; // Variable para almacenar el input de nombre durante la edición

    btnEditar.addEventListener("click", () => {

        //el espacio de nombre pasa a ser placeholder y los botones pasan a ser cancelar y guardar

        inputNombre = document.createElement("input"); // Crear un nuevo input para editar el nombre
        inputNombre.type = "text";
        inputNombre.value = datoMaestro[nombrePri];

        nombre.replaceWith(inputNombre);

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

        const data = await api.patch(`${url}/${datoMaestro.id}`, { [nombrePri]: inputNombre.value });

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

        inputNombre.replaceWith(nombre);
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

    // const infoSelect = document.createElement("div");
    // infoSelect.classList.add("infoSelect");

    const nombreCont = document.createElement ("div")
    nombreCont.classList.add("nombre_Cont")

    const nombreDato = document.createElement("p");
    nombreDato.textContent = `${datoText.datoNombre} de`;
    nombreDato.classList.add("nombreDato_Estado")

    const nombre = document.createElement("p")
    nombre.textContent = `${datoMaestro[datoText.nameDB]}`;
    nombre.classList.add("nombre_Estado")

    nombreCont.append(nombreDato, nombre);

    const subNombre = document.createElement("p");

    if (datoText.urlSubDato == null) {

        if (Number(subDatoMaestro) === 1) {
            subNombre.textContent = `${datoText.subDatoNombre}: Si`;
        } else {
            subNombre.textContent = `${datoText.subDatoNombre}: No`;
        }

    } else {

        subNombre.textContent = `${datoText.subDatoNombre} de ${subDatoMaestro[datoText.subnameDB]}`;
    }

    const btnCerrar = document.createElement("button");
    btnCerrar.classList.add("ri-close-line", "btn-cerrar-Estado");
    // btnCerrar.innerHTML = `<i class="ri-close-line"></i>`;

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
        // datoMaestro.is_active = nuevoEstado;
        btnDesactivar.textContent = nuevoEstado === 1 ? "Desactivar" : "Activar";

        // btnDesactivar.classList.toggle("btn-desactivar", nuevoEstado === 1);
        // btnDesactivar.classList.toggle("btn-activar", nuevoEstado === 0);

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

    ventana.append( nombreCont, subNombre, btnContEstado, btnCerrar);

    let inputNombre = null; // Variable para almacenar el input de nombre durante la edición

    let inputSubDato = null; // Variable para almacenar el select de subdato durante la edición

    btnEditar.addEventListener("click", async () => {

        //el espacio de nombre pasa a ser placeholder y los botones pasan a ser cancelar y guardar

        inputNombre = document.createElement("input"); // Crear un nuevo input para editar el nombre
        inputNombre.type = "text";
        inputNombre.value = datoMaestro[datoText.nameDB];

        nombre.replaceWith(inputNombre);

        // const opcionesSubDato = await api.get(urlSubDato);

        const opcionesSubDato = datoText.urlSubDato !== null ? await api.get(datoText.urlSubDato) : [];

        inputSubDato = document.createElement("select");
        inputSubDato.classList.add("select-subDato");

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


        subNombre.replaceWith(inputSubDato);

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
            [datoText.campoSubDato]: inputSubDato.value  // 👈 ej: "sectional_id"
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

        inputNombre.replaceWith(nombre);
        inputNombre= null; // Limpiar la variable del input al cancelar

        inputSubDato.replaceWith(subNombre);
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

export const verEstado_doubleInput = async (datoMaestro, subDatoMaestro, recargar, urlHistorial, datoText) => {

    const overlay = document.createElement("div");
    overlay.classList.add("overlay_verEstado");

    const ventana = document.createElement("div");
    ventana.classList.add("ventana");


    const nombre = document.createElement("p");
    nombre.textContent = `${datoText.datoNombre}: ${datoMaestro[datoText.nameDB]}`;

    const subNombre = document.createElement("p");
    subNombre.textContent = `${datoText.subDatoNombre}: ${subDatoMaestro[datoText.subnameDB]}`;


    const btnCerrar = document.createElement("button");
    btnCerrar.classList.add("ri-close-line", "btn-cerrar-Estado");
    // btnCerrar.innerHTML = `<i class="ri-close-line"></i>`;

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

    ventana.append( nombre, subNombre, btnContEstado, btnCerrar);

    let inputNombre = null; // Variable para almacenar el input de nombre durante la edición

    let inputSubDato = null; // Variable para almacenar el select de subdato durante la edición

    btnEditar.addEventListener("click", async () => {

        //el espacio de nombre pasa a ser placeholder y los botones pasan a ser cancelar y guardar

        inputNombre = document.createElement("input"); // Crear un nuevo input para editar el nombre
        inputNombre.type = "text";
        inputNombre.value = datoMaestro[datoText.nameDB];

        nombre.replaceWith(inputNombre);

        inputSubDato = document.createElement("input");
        inputSubDato.type = "text";
        inputSubDato.value = subDatoMaestro[datoText.subnameDB];


        subNombre.replaceWith(inputSubDato);

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
            [datoText.campoSubDato]: inputSubDato.value
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

        inputNombre.replaceWith(nombre);
        inputNombre= null; // Limpiar la variable del input al cancelar

        inputSubDato.replaceWith(subNombre);
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