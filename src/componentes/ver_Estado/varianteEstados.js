import verEstadoVentana from "./verEstado_ventana";
/* =====================================================
VARIANTE: INPUT SIMPLE-------------------------------------------------------------------------------------------------------------------------------------------->
==================================================== */
export const verEstado_input = (datoMaestro, recargar, urlHistorial, datoText) => {

    verEstadoVentana(datoMaestro, recargar, urlHistorial, datoText, ({

        ventana, overlay, btnCerrarCont, 
        btnContEstado, btnEditar, btnGuardar,
        btnCancelar, btnDesactivar, btnHistorial
    }) => {

        const nombreCont = document.createElement("div");
        nombreCont.classList.add("nombre_Cont");

        const nombreDato = document.createElement("p");
        nombreDato.textContent = `${datoText.datoNombre}:`;
        nombreDato.classList.add("nombreDato_Estado");

        const nombre = document.createElement("p");
        nombre.textContent = datoMaestro[datoText.nameDB];
        nombre.classList.add("nombre_Estado");

        nombreCont.append(nombreDato, nombre);
        ventana.append(btnCerrarCont, nombreCont, btnContEstado);

        let inputNombre = null;
        let inputBox = null;

        btnEditar.addEventListener("click", () => {

            inputBox = document.createElement("div");
            inputBox.classList.add("form__inputBox");

            const icon = document.createElement("i");
            icon.classList.add("ri-building-fill");

            inputNombre = document.createElement("input");
            inputNombre.type = "text";
            inputNombre.value = datoMaestro[datoText.nameDB];

            inputBox.append(icon, inputNombre);
            nombre.replaceWith(inputBox);

            btnDesactivar.style.display = "none";
            btnHistorial.style.display = "none";
            btnEditar.style.display = "none";
            btnGuardar.style.display = "block";
            btnCancelar.style.display = "block";
        });

        btnGuardar.addEventListener("click", async () => {

            if (!inputNombre?.value.trim()) {
                await alerta.alertaError("El nombre no puede estar vacío");
                return;
            }

            btnGuardar.disabled = true;
            const data = await api.patch(`${datoText.urlDato}/${datoMaestro.id}`, {
                [datoText.nameDB]: inputNombre.value
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

        btnCancelar.addEventListener("click", () => {
            inputBox.replaceWith(nombre);
            inputBox = null;
            inputNombre = null;

            btnDesactivar.style.display = "block";
            btnHistorial.style.display = "block";
            btnEditar.style.display = "block";
            btnGuardar.style.display = "none";
            btnCancelar.style.display = "none";
        });
    });
};


/* =====================================================
VARIANTE: DOBLE INPUT-------------------------------------------------------------------------------------------------------------------------------------------->
==================================================== */
export const verEstado_doubleInput = (datoMaestro, recargar, urlHistorial, datoText) => {

    verEstadoVentana(datoMaestro, recargar, urlHistorial, datoText, ({

        ventana, overlay, btnCerrarCont,
        btnContEstado, btnEditar, btnGuardar,
        btnCancelar, btnDesactivar, btnHistorial,
    }) => {

        const nombreCont = document.createElement("div");
        nombreCont.classList.add("nombre_Cont");

        const nombreDato = document.createElement("p");
        nombreDato.textContent = `${datoText.datoNombre}:`;
        nombreDato.classList.add("nombreDato_Estado");

        const nombre = document.createElement("p");
        nombre.textContent = datoMaestro[datoText.nameDB];
        nombre.classList.add("nombre_Estado");

        nombreCont.append(nombreDato, nombre);

        const subNombreCont = document.createElement("div");
        subNombreCont.classList.add("subNombre_Cont");

        const subNombreDato = document.createElement("p");
        subNombreDato.textContent = `${datoText.subDatoNombre}:`;
        subNombreDato.classList.add("subNombreDato_Estado");

        const subNombre = document.createElement("p");
        subNombre.textContent = datoMaestro[datoText.subnameDB];
        subNombre.classList.add("subNombre_Estado");

        subNombreCont.append(subNombreDato, subNombre);
        ventana.append(btnCerrarCont, nombreCont, subNombreCont, btnContEstado);

        let inputNombre = null;
        let inputSubDato = null;
        let inputBox = null;
        let subInputBox = null;

        btnEditar.addEventListener("click", () => {

            inputBox = document.createElement("div");
            inputBox.classList.add("form__inputBox");
            const icon = document.createElement("i");
            icon.classList.add("ri-building-fill");
            inputNombre = document.createElement("input");
            inputNombre.type = "text";
            inputNombre.value = datoMaestro[datoText.nameDB];
            inputBox.append(icon, inputNombre);
            nombre.replaceWith(inputBox);

            subInputBox = document.createElement("div");
            subInputBox.classList.add("form__inputBox");
            const subIcon = document.createElement("i");
            subIcon.classList.add("ri-article-fill");
            inputSubDato = document.createElement("input");
            inputSubDato.type = "text";
            inputSubDato.value = datoMaestro[datoText.subnameDB];
            subInputBox.append(subIcon, inputSubDato);
            subNombre.replaceWith(subInputBox);

            btnDesactivar.style.display = "none";
            btnHistorial.style.display = "none";
            btnEditar.style.display = "none";
            btnGuardar.style.display = "block";
            btnCancelar.style.display = "block";
        });

        btnGuardar.addEventListener("click", async () => {

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

        btnCancelar.addEventListener("click", () => {
            inputBox.replaceWith(nombre);
            inputBox = null;
            inputNombre = null;
            subInputBox.replaceWith(subNombre);
            subInputBox = null;
            inputSubDato = null;

            btnDesactivar.style.display = "block";
            btnHistorial.style.display = "block";
            btnEditar.style.display = "block";
            btnGuardar.style.display = "none";
            btnCancelar.style.display = "none";
        });
    });
};


/* =====================================================
VARIANTE: SELECT-------------------------------------------------------------------------------------------------------------------------------------------->
==================================================== */
export const verEstado_select = (datoMaestro, subDatoMaestro, recargar, urlHistorial, datoText) => {

    verEstadoVentana(datoMaestro, recargar, urlHistorial, datoText, ({

        ventana, overlay, btnCerrarCont,
        btnContEstado, btnEditar, btnGuardar, 
        btnCancelar, btnDesactivar, btnHistorial,
    }) => {

        const nombreCont = document.createElement("div");
        nombreCont.classList.add("nombre_Cont");

        const nombreDato = document.createElement("p");
        nombreDato.textContent = `${datoText.datoNombre} de`;
        nombreDato.classList.add("nombreDato_Estado");

        const nombre = document.createElement("p");
        nombre.textContent = datoMaestro[datoText.nameDB];
        nombre.classList.add("nombre_Estado");
        if (datoText.datoNombre == "Pregunta") nombre.classList.add("esPregunta_Estado");

        nombreCont.append(nombreDato, nombre);

        const subNombreCont = document.createElement("div");
        subNombreCont.classList.add("subNombre_Cont");

        const subNombreDato = document.createElement("p");
        subNombreDato.textContent = `${datoText.subDatoNombre}:`;
        subNombreDato.classList.add("subNombreDato_Estado");

        const subNombre = document.createElement("p");
        subNombre.classList.add("subNombre_Estado");

        if (datoText.urlSubDato == null) {
            subNombre.textContent = Number(subDatoMaestro) === 1 ? "Si" : "No";
        } else {
            subNombre.textContent = subDatoMaestro[datoText.subnameDB];
        }

        subNombreCont.append(subNombreDato, subNombre);
        ventana.append(btnCerrarCont, nombreCont, subNombreCont, btnContEstado);

        let inputNombre = null;
        let inputSubDato = null;
        let inputBox = null;
        let subInputBox = null;

        btnEditar.addEventListener("click", async () => {

            inputBox = document.createElement("div");
            inputBox.classList.add("form__inputBox");

            const icon = document.createElement("i");
            icon.classList.add("ri-building-fill");

            inputNombre = document.createElement("input");
            inputNombre.classList.add("form__input", "form__nombre");
            inputNombre.type = "text";
            inputNombre.value = datoMaestro[datoText.nameDB];

            inputBox.append(icon, inputNombre);
            nombre.replaceWith(inputBox);

            subInputBox = document.createElement("div");
            subInputBox.classList.add("form__inputBox");
            const subIcon = document.createElement("i");
            subIcon.classList.add("ri-article-fill");

            const opcionesSubDato = datoText.urlSubDato !== null ? await api.get(datoText.urlSubDato) : [];
            inputSubDato = document.createElement("select");
            inputSubDato.classList.add("form__input", "form__seccional");

            if (datoText.urlSubDato === null) {

                const optionY = document.createElement("option");
                optionY.value = 1;
                optionY.textContent = "Si";

                const optionN = document.createElement("option");
                optionN.value = 0;
                optionN.textContent = "No";

                if (Number(subDatoMaestro) === 1) optionY.selected = true;
                else optionN.selected = true;

                inputSubDato.append(optionY, optionN);

            } else {

                opcionesSubDato.forEach(opcion => {

                    const option = document.createElement("option");
                    option.value = opcion.id;
                    option.textContent = opcion[datoText.nameDB];

                    if (opcion.id === subDatoMaestro.id) option.selected = true;
                    
                    inputSubDato.append(option);
                });
            }

            subInputBox.append(subIcon, inputSubDato);
            subNombre.replaceWith(subInputBox);

            btnDesactivar.style.display = "none";
            btnHistorial.style.display = "none";
            btnEditar.style.display = "none";
            btnGuardar.style.display = "block";
            btnCancelar.style.display = "block";
        });

        btnGuardar.addEventListener("click", async () => {

            if (!inputNombre?.value.trim()) {
                await alerta.alertaError("El nombre no puede estar vacío");
                return;
            }

            btnGuardar.disabled = true;
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

        btnCancelar.addEventListener("click", () => {

            inputBox.replaceWith(nombre);
            inputBox = null;
            inputNombre = null;
            subInputBox.replaceWith(subNombre);
            subInputBox = null;
            inputSubDato = null;

            btnDesactivar.style.display = "block";
            btnHistorial.style.display = "block";
            btnEditar.style.display = "block";
            btnGuardar.style.display = "none";
            btnCancelar.style.display = "none";
        });
    });
};