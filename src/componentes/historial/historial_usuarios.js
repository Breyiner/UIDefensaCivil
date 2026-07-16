import { paginacion } from "@/helpers/index.js";
import * as alerta from "../../helpers/alertas";
import * as api from "../../helpers/api";

const historial_usuarios = async (endpoint, nombreSubDato) => {
    const container = document.querySelector(".container__paginas");
    const mensajeVacio = "No hay registros en el historial para este elemento.";

    let selectedAuditIds = [];
    let opcionesPanel = null;
    let contadorSpan = null;

    const opcionesEliminar = async () => {
        if (document.querySelector(".eliminar-panel")) return;

        opcionesPanel = document.createElement("div");
        opcionesPanel.classList.add("eliminar-panel", "ocultar_opciones");

        const opcionesCont = document.createElement("div");
        opcionesCont.classList.add("container-eliminar-panel");

        const btnCerrar = document.createElement("button");
        btnCerrar.classList.add("btnCerrar", "ri-close-large-line");

        contadorSpan = document.createElement("span");
        contadorSpan.classList.add("contadorSpan");
        contadorSpan.textContent = "Elementos seleccionados: 0";

        const botonera = document.createElement("div");
        botonera.classList.add("botonera--panel__Eliminacion");

        const btnSelectAll = document.createElement("button");
        btnSelectAll.classList.add("btnSelectAll");
        btnSelectAll.textContent = "seleccionar todo";

        const btnBorrar = document.createElement("button");
        btnBorrar.classList.add("btn_borrar");

        const borrarIcono = document.createElement("i");
        borrarIcono.classList.add("ri-delete-bin-2-fill");

        const borrarText = document.createElement("p");
        borrarText.textContent = "Borrar datos";

        btnBorrar.append(borrarIcono, borrarText);

        botonera.append(btnSelectAll, btnBorrar);

        opcionesCont.append(btnCerrar, contadorSpan, botonera);

        opcionesPanel.appendChild(opcionesCont);

        container.before(opcionesPanel);

        // 1. Botón Cerrar (Limpia toda la selección actual) ______________________________________
        btnCerrar.addEventListener("click", () => {
            selectedAuditIds = [];
            const checkboxes = container.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach((chk) => {
                chk.checked = false;
                const icon = chk.parentElement.querySelector(".ri-check-line");
                if (icon) icon.classList.add("oculto");
            });
            actualizarPanelSeleccion();
        });

        // 2. Botón Seleccionar Todo ______________________________________________________________
        btnSelectAll.addEventListener("click", () => {
            const checkboxes = container.querySelectorAll('input[type="checkbox"]');
            const todosMarcados = Array.from(checkboxes).every((chk) => chk.checked);

            checkboxes.forEach((chk) => {
                if (todosMarcados) {
                    // Si ya todos estaban marcados en la página, desmarca
                    if (chk.checked) {
                        chk.checked = false;
                        chk.dispatchEvent(new Event("change"));
                    }
                } else {
                    // Si faltaba alguno, márcalos todos
                    if (!chk.checked) {
                        chk.checked = true;
                        chk.dispatchEvent(new Event("change"));
                    }
                }
            });
        });

        // 3. Botón Borrar Masivo (Borra concurrentemente todos los IDs recolectados)___________________________________
        btnBorrar.addEventListener("click", async () => {
            const totalElementos = selectedAuditIds.length;
            const confirmacion = await alerta.alertaQuest(`¿Estás seguro de que deseas eliminar los ${totalElementos} registros seleccionados del historial?`);

            if (!confirmacion.isConfirmed) return;

            try {
                const resultado = await api.bulkDelete("audits/bulk_delete", {
                    audit_ids: selectedAuditIds,
                });

                if (resultado.success) {
                    await alerta.alertaOK("Los registros seleccionados se eliminaron con éxito.");
                } else {
                    // Si el backend devuelve un error controlado (ej. código 422 o 500)
                    await alerta.alertaError(resultado.message || "No se pudieron eliminar los registros.");
                }
            } catch (error) {
                await alerta.alertaError("Ocurrió un error inesperado al procesar el borrado masivo.");
            }

            selectedAuditIds = [];
            await recargarContainer();
        });
    };

    const actualizarPanelSeleccion = () => {
        if (contadorSpan) {
            contadorSpan.textContent = "Elementos seleccionados: " + selectedAuditIds.length;
        }

        if (opcionesPanel) {
            if (selectedAuditIds.length > 0) {
                opcionesPanel.classList.remove("ocultar_opciones");
            } else {
                opcionesPanel.classList.add("ocultar_opciones");
            }
        }
    };

    const cargarHistorial = async () => {
        container.innerHTML = "";

        await opcionesEliminar();

        await paginacion(endpoint, mensajeVacio, cardHistorial);

        actualizarPanelSeleccion();
    };

    const recargarContainer = async () => {
        await cargarHistorial();
    };

    const cardHistorial = (dato) => {
        // USER_________________________________________________________
        const card = document.createElement("div");
        card.classList.add("card-Cont", "card-Cont--usuario");

        const userContainer = document.createElement("div");
        userContainer.classList.add("user-Cont");

        const userDiv = document.createElement("div");
        userDiv.classList.add("user-div");

        const userIcon = document.createElement("i");
        userIcon.classList.add("ri-user-3-fill");

        const userInfo = document.createElement("div");
        userInfo.classList.add("user-info");

        const userName = document.createElement("p");
        userName.classList.add("user-name");
        userName.textContent = dato.user_name;

        const userRol = document.createElement("p");
        userRol.classList.add("user-rol");
        userRol.textContent = dato.rol;

        userDiv.append(userIcon);
        userInfo.append(userName, userRol);
        userContainer.append(userDiv, userInfo);

        // HISTORIAL_________________________________________________________
        const uniqueId = `checkHistorial-${dato.id}`;

        const historialContainer = document.createElement("div");
        historialContainer.classList.add("historial-Cont");

        const sideHistorial = document.createElement("div");
        sideHistorial.classList.add("historial-side");

        const sidePunto = document.createElement("div");
        sidePunto.classList.add("historial-sideElement", "check-historial_cont");

        const checkHistorial = document.createElement("input");
        checkHistorial.type = "checkbox";
        checkHistorial.id = uniqueId;
        checkHistorial.classList.add("oculto");

        // Ahora sí puede leer selectedAuditIds sin romper el código
        checkHistorial.checked = selectedAuditIds.includes(dato.id);

        const labelHistorial = document.createElement("label");
        labelHistorial.htmlFor = uniqueId;

        const iconCheck = document.createElement("i");
        iconCheck.className = "ri-check-line";

        labelHistorial.appendChild(iconCheck);
        sidePunto.append(checkHistorial, labelHistorial);

        // Estado inicial del icono de check
        iconCheck.classList.toggle("oculto", !checkHistorial.checked);

        // Evento que reacciona al hacer click en el LABEL
        checkHistorial.addEventListener("change", function () {
            const isChecked = this.checked;

            iconCheck.classList.toggle("oculto", !isChecked);

            if (isChecked) {
                selectedAuditIds.push(dato.id);
            } else {
                selectedAuditIds = selectedAuditIds.filter((id) => id !== dato.id);
            }

            actualizarPanelSeleccion();
        });

        const sideLine = document.createElement("div");
        sideLine.classList.add("historial-sideElement");

        const historialDatos = document.createElement("div");
        historialDatos.classList.add("historial-usuariDatos");

        const nameProfile = document.createElement("div");
        nameProfile.classList.add("historial_dato");

        const tittleName = document.createElement("span");
        tittleName.classList.add("tittle_user-historial");
        tittleName.textContent = "Nombre(s)";

        const name = document.createElement("p");
        name.classList.add("data_user-historial");
        name.textContent = dato.userName_new ?? dato.userName_old ?? "Sin registro";

        nameProfile.append(tittleName, name);

        const lastNameProfile = document.createElement("div");
        lastNameProfile.classList.add("historial_dato");

        const tittleLastName = document.createElement("span");
        tittleLastName.classList.add("tittle_user-historial");
        tittleLastName.textContent = "Apellido(s)";

        const lastName = document.createElement("p");
        lastName.classList.add("data_user-historial");
        lastName.textContent = dato.lastName_new ?? dato.lastName_old ?? "Sin registro";

        lastNameProfile.append(tittleLastName, lastName);

        const documentTypeProfile = document.createElement("div");
        documentTypeProfile.classList.add("historial_dato");

        const tittleDocumentType = document.createElement("span");
        tittleDocumentType.classList.add("tittle_user-historial");
        tittleDocumentType.textContent = "Tipo de documento";

        const documentType = document.createElement("p");
        documentType.classList.add("data_user-historial");
        documentType.textContent = dato.documentType_new ?? dato.documentType_old ?? "Sin registro";

        documentTypeProfile.append(tittleDocumentType, documentType);

        const documentNumberProfile = document.createElement("div");
        documentNumberProfile.classList.add("historial_dato");

        const tittleDocumentNumber = document.createElement("span");
        tittleDocumentNumber.classList.add("tittle_user-historial");
        tittleDocumentNumber.textContent = "Número de documento";

        const documentNumber = document.createElement("p");
        documentNumber.classList.add("data_user-historial");
        documentNumber.textContent = dato.numberDocument_new ?? dato.numberDocument_old ?? "Sin registro";

        documentNumberProfile.append(tittleDocumentNumber, documentNumber);

        const genderProfile = document.createElement("div");
        genderProfile.classList.add("historial_dato");

        const tittleGender = document.createElement("span");
        tittleGender.classList.add("tittle_user-historial");
        tittleGender.textContent = "Género";

        const gender = document.createElement("p");
        gender.classList.add("data_user-historial");
        gender.textContent = dato.gender_new ?? dato.gender_old ?? "Sin registro";

        genderProfile.append(tittleGender, gender);

        const birthDateProfile = document.createElement("div");
        birthDateProfile.classList.add("historial_dato");

        const tittleBirthDate = document.createElement("span");
        tittleBirthDate.classList.add("tittle_user-historial");
        tittleBirthDate.textContent = "Fecha de nacimiento";

        const birthDate = document.createElement("p");
        birthDate.classList.add("data_user-historial");
        birthDate.textContent = dato.birthDate_new ?? dato.birthDate_old ?? "Sin registro";

        birthDateProfile.append(tittleBirthDate, birthDate);

        const sectionalProfile = document.createElement("div");
        sectionalProfile.classList.add("historial_dato");

        const tittleSectional = document.createElement("span");
        tittleSectional.classList.add("tittle_user-historial");
        tittleSectional.textContent = "Seccional";

        const sectional = document.createElement("p");
        sectional.classList.add("data_user-historial");
        sectional.textContent = dato.sectional_new ?? dato.sectional_old ?? "Sin registro";

        sectionalProfile.append(tittleSectional, sectional);

        const organizationProfile = document.createElement("div");
        organizationProfile.classList.add("historial_dato");

        const tittleOrganization = document.createElement("span");
        tittleOrganization.classList.add("tittle_user-historial");
        tittleOrganization.textContent = "Organización";

        const organization = document.createElement("p");
        organization.classList.add("data_user-historial");
        organization.textContent = dato.organization_new ?? dato.organization_old ?? "Sin registro";

        organizationProfile.append(tittleOrganization, organization);

        const rolProfile = document.createElement("div");
        rolProfile.classList.add("historial_dato");

        const tittleRol = document.createElement("span");
        tittleRol.classList.add("tittle_user-historial");
        tittleRol.textContent = "Rol";

        const rol = document.createElement("p");
        rol.classList.add("data_user-historial");
        rol.textContent = dato.userRol_new ?? dato.userRol_old ?? "Sin registro";

        rolProfile.append(tittleRol, rol);

        historialDatos.append(nameProfile, lastNameProfile, documentTypeProfile, documentNumberProfile, genderProfile, birthDateProfile, sectionalProfile, organizationProfile, rolProfile);

        if (dato.data_old !== null && dato.data_old !== undefined && dato.data_old !== dato.data_new) {
            const oldName = document.createElement("p");
            oldName.classList.add("oldName-Historial");
            oldName.textContent = "Anteriormente: " + dato.data_old;
            historialDatos.append(oldName);
        }

        let subname = null;
        if (dato.subData_new != null) {
            subname = document.createElement("p");
            subname.classList.add("subname-Historial");
            subname.textContent = `${nombreSubDato}: ${dato.subData_new ?? dato.subData_old ?? "Sin registro"}`;

            historialDatos.append(subname);

            if (dato.subData_old !== null && dato.subData_old !== undefined) {
                const oldSubname = document.createElement("p");
                oldSubname.textContent = `Anteriormente ${nombreSubDato}: ${dato.subData_old}`;
                historialDatos.append(oldSubname);
            }
        }

        const actionContainer = document.createElement("div");
        actionContainer.classList.add("action-Cont");

        const action = document.createElement("p");
        action.classList.add("action-Historial");
        action.textContent = "Acción: " + dato.action_execute;

        sideHistorial.append(sidePunto, sideLine);
        historialContainer.append(sideHistorial, historialDatos, action);

        const statusContainer = document.createElement("div");
        statusContainer.classList.add("status-Cont");

        if (dato.status_new !== null) {
            const statusElement = document.createElement("div");
            statusElement.classList.add("status-Element");

            const statusColor = document.createElement("div");
            statusColor.classList.add("status-color");

            if (dato.status_new === "Activo") {
                statusColor.classList.add("status-activo");
            }
            if (dato.status_new === "Inactivo") {
                statusColor.classList.add("status-inactivo");
            }

            const status = document.createElement("p");
            status.classList.add("status-Historial");
            status.textContent = "Estado nuevo: " + dato.status_new;

            statusElement.append(statusColor, status);
            statusContainer.append(statusElement);
        }

        if (dato.status_old !== null) {
            const statusElement = document.createElement("div");
            statusElement.classList.add("status-Element");

            const statusColor = document.createElement("div");
            statusColor.classList.add("status-color");

            if (dato.status_old === "Activo") {
                statusColor.classList.add("status-activo");
            }
            if (dato.status_old === "Inactivo") {
                statusColor.classList.add("status-inactivo");
            }

            const status = document.createElement("p");
            status.classList.add("status-Historial");
            status.textContent = "Estado anterior: " + dato.status_old;

            statusElement.append(statusColor, status);
            statusContainer.append(statusElement);
        }

        historialContainer.append(statusContainer);

        // FECHA_________________________________________________________
        const dateContainer = document.createElement("div");
        dateContainer.classList.add("date-Cont");

        const date = document.createElement("p");
        date.classList.add("date-Historial");
        date.textContent = dato.date_time;

        const dateIcon = document.createElement("i");
        dateIcon.classList.add("ri-calendar-event-fill");

        dateContainer.append(dateIcon, date);

        card.append(userContainer, historialContainer, dateContainer);

        return card;
    };

    await cargarHistorial();
};

export default historial_usuarios;
