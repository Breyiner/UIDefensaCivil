/**
 * Controlador: Insertar Nuevo Factor Riesgo Inicial (planRiesgo/crear/crearController.js)
 * Formulario inicial simplificado para registrar un tipo de amenaza ("Sismo", "Inundación").
 * Envía el Payload directo porque el cliente confía en el validador estricto del HTML Required Properties o DB side.
 */
import { api, alertas as alerta, validacionInputs as validacion, adjuntarOpciones as adjuntarOpc, formatearFecha } from "@/helpers/index.js";
import { initTomSelectPortatil } from "@/helpers/tomSelectPortatil.js";
import { VistaRiesgo, tarjetaVulnerabilidad, tarjetaAccion, agregarVulnerabilidadMemoria, agregarAccionMemoria } from "@/componentes/riesgo/index.js";

export default async () => {
    // Selectores DOM Main Nav and Tools
    const botonBack = document.getElementById("botonBack");
    const id = location.hash.split("=")[1]; // Plan Familiar Parent Header Pointer UUID

    /** @type {Array} Arreglos locales en memoria para almacenar las vulnerabilidades y acciones ingresadas */
    let vulnerabilities = [];
    let actions = [];

    if (window.procesoPeticion === undefined) { window.procesoPeticion = true; }
    window.procesoPeticion = false;

    // Retorno Cancelación Safe 
    botonBack.onclick = async () => {
        if (window.procesoPeticion) return;
        const confirmacion = await alerta.alertaQuest("¿Seguro que quieres volver? perderás tu progreso");
        if (confirmacion.isConfirmed) location.href = `#/voluntario/plan_familiar/factores_de_riesgo?familia_id=${id}`;
    };

    // Precargar catálogos para vulnerabilidades y miembros
    const vulnerabilityGradesList = await api.get("vulnerabilityGrades") || [];
    const vulnerabilitiesList = await api.get("vulnerabilities") || [];
    const membersList = await api.get(`members/familyPlan/select/${id}`) || [];

    // Instancia el componente visual de factores de riesgo (retorna el nodo del formulario)
    const form = VistaRiesgo({
        esSupervisor: false
    });

    const contenedor = document.getElementById("contenedor-riesgo");
    contenedor.innerHTML = ""; // Limpiar
    contenedor.appendChild(form);

    // Cargar opciones de Amenaza y configurar TomSelect
    const tiposAmenazaSelect = form.querySelector("#tiposAmenaza");
    await adjuntarOpc.adjuntar(tiposAmenazaSelect, "threatTypes");
    initTomSelectPortatil();

    // Inicializar validador automático sobre el formulario
    validacion.validadorAutomatico.init(form);

    // Selectores Dom Formularios
    const descripcion = document.getElementById('descripcion');
    const distancia = document.getElementById('distancia');
    const ubicacion = document.getElementById('ubicacion');
    const amenaza = document.getElementById('tiposAmenaza'); // Select Diccionario
    const btnAgregarVuln = form.querySelector("#btnAgregarVulnerabilidad");
    const btnAgregarAcc = form.querySelector("#btnAgregarAccion");
    const listaVulnDiv = form.querySelector("#vulnerabilidades-lista");
    const listaAccDiv = form.querySelector("#acciones-lista");
    const botonSiguiente = form.querySelector('#botonGuardar'); // Botón guardar/siguiente

    // Helper local para renderizar vulnerabilidades en la vista
    const renderVulnerabilities = () => {
        listaVulnDiv.innerHTML = "";

        if (vulnerabilities.length === 0) {
            const emptyMsg = document.createElement("p");
            emptyMsg.className = "gestionarAfecciones__mensajeVacio";
            emptyMsg.textContent = "No hay vulnerabilidades registradas.";
            listaVulnDiv.appendChild(emptyMsg);
            return;
        }

        vulnerabilities.forEach((vuln) => {
            const tag = tarjetaVulnerabilidad(
                vuln,
                false, // esSupervisor
                () => {
                    // Instanciar modal visual nativo
                    const modal = agregarVulnerabilidadMemoria({
                        initialData: vuln,
                        vulnerabilities: vulnerabilitiesList,
                        vulnerabilityGrades: vulnerabilityGradesList
                    });
                    document.body.appendChild(modal);

                    const formModal = modal.querySelector("form");
                    const btnCancelar = modal.querySelector(".modal-edicion__btn--secundario");
                    const btnGuardar = modal.querySelector(".modal-edicion__btn--primario");
                    const selectVulnerability = modal.querySelector(".form__vulnerability");
                    const selectGrade = modal.querySelector(".form__vulnerabilityGrade");

                    const closeModal = () => {
                        modal.close();
                        modal.remove();
                    };
                    btnCancelar.addEventListener("click", closeModal);
                    modal.addEventListener("mousedown", (e) => {
                        if (e.target === modal) closeModal();
                    });

                    // Iniciar validador y evento de envío
                    validacion.validadorAutomatico.init(formModal);
                    btnGuardar.addEventListener("click", () => {
                        const isValid = validacion.validadorAutomatico.validarTodo(formModal);
                        if (!isValid) return;

                        const idx = vulnerabilities.findIndex(v => v.tempId === vuln.tempId);
                        if (idx !== -1) {
                            const selectedVuln = vulnerabilitiesList.find(v => v.id == selectVulnerability.value);
                            const selectedGrade = vulnerabilityGradesList.find(g => g.id == selectGrade.value);
                            
                            vulnerabilities[idx] = { 
                                ...vulnerabilities[idx],
                                vulnerability_id: selectVulnerability.value,
                                vulnerability_grade_id: selectGrade.value,
                                labelText: `${selectedVuln ? selectedVuln.name : ""} - Grado: ${selectedGrade ? selectedGrade.name : ""}`
                            };
                            renderVulnerabilities();
                            closeModal();
                        }
                    });

                    modal.showModal();
                },
                async () => {
                    // Callback al eliminar de memoria
                    const confirmacion = await alerta.alertaQuest("¿Seguro que deseas eliminar esta vulnerabilidad?");
                    if (confirmacion.isConfirmed) {
                        vulnerabilities = vulnerabilities.filter(v => v.tempId !== vuln.tempId);
                        renderVulnerabilities();
                    }
                }
            );
            listaVulnDiv.appendChild(tag);
        });
    };

    // Helper local para renderizar acciones de reducción en la vista
    const renderActions = () => {
        listaAccDiv.innerHTML = "";

        if (actions.length === 0) {
            const emptyMsg = document.createElement("p");
            emptyMsg.className = "gestionarAfecciones__mensajeVacio";
            emptyMsg.textContent = "No hay acciones de reducción registradas.";
            listaAccDiv.appendChild(emptyMsg);
            return;
        }

        actions.forEach((action) => {
            const tag = tarjetaAccion(
                action,
                false, // esSupervisor
                () => {
                    // Instanciar modal visual nativo
                    const modal = agregarAccionMemoria({
                        members: membersList,
                        initialData: action
                    });
                    document.body.appendChild(modal);

                    const formModal = modal.querySelector("form");
                    const btnCancelar = modal.querySelector(".modal-edicion__btn--secundario");
                    const btnGuardar = modal.querySelector(".modal-edicion__btn--primario");
                    const inputAction = modal.querySelector(".form__action");
                    const selectMember = modal.querySelector(".form__member");
                    const inputDate = modal.querySelector(".form__date");

                    const closeModal = () => {
                        modal.close();
                        modal.remove();
                    };
                    btnCancelar.addEventListener("click", closeModal);
                    modal.addEventListener("mousedown", (e) => {
                        if (e.target === modal) closeModal();
                    });

                    // Iniciar validador y evento de envío
                    validacion.validadorAutomatico.init(formModal);
                    btnGuardar.addEventListener("click", () => {
                        const isValid = validacion.validadorAutomatico.validarTodo(formModal);
                        if (!isValid) return;

                        const dateVal = inputDate.value;
                        if (!dateVal) {
                            validacion.mostrarError(inputDate, "La fecha de finalización es obligatoria.");
                            return;
                        }
                        const today = new Date();
                        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                        if (dateVal < todayStr) {
                            validacion.mostrarError(inputDate, "La fecha de la acción no puede ser anterior al día de hoy.");
                            return;
                        }

                        const idx = actions.findIndex(a => a.tempId === action.tempId);
                        if (idx !== -1) {
                            const selectedMember = membersList.find(m => m.id == selectMember.value);

                            actions[idx] = { 
                                ...actions[idx],
                                action: inputAction.value,
                                member_id: selectMember.value,
                                end_date: dateVal,
                                labelText: `${inputAction.value} - ${selectedMember ? (selectedMember.full_name || `${selectedMember.names} ${selectedMember.last_names}`) : "Sin encargado"} - ${formatearFecha(dateVal)}`
                            };
                            renderActions();
                            closeModal();
                        }
                    });

                    modal.showModal();
                },
                async () => {
                    // Callback al eliminar de memoria
                    const confirmacion = await alerta.alertaQuest("¿Seguro que deseas eliminar esta acción?");
                    if (confirmacion.isConfirmed) {
                        actions = actions.filter(a => a.tempId !== action.tempId);
                        renderActions();
                    }
                }
            );
            listaAccDiv.appendChild(tag);
        });
    };

    // Click en agregar vulnerabilidad
    btnAgregarVuln.addEventListener("click", () => {
        const modal = agregarVulnerabilidadMemoria({
            initialData: null,
            vulnerabilities: vulnerabilitiesList,
            vulnerabilityGrades: vulnerabilityGradesList
        });
        document.body.appendChild(modal);

        const formModal = modal.querySelector("form");
        const btnCancelar = modal.querySelector(".modal-edicion__btn--secundario");
        const btnGuardar = modal.querySelector(".modal-edicion__btn--primario");
        const selectVulnerability = modal.querySelector(".form__vulnerability");
        const selectGrade = modal.querySelector(".form__vulnerabilityGrade");

        const closeModal = () => {
            modal.close();
            modal.remove();
        };
        btnCancelar.addEventListener("click", closeModal);
        modal.addEventListener("mousedown", (e) => {
            if (e.target === modal) closeModal();
        });

        validacion.validadorAutomatico.init(formModal);
        btnGuardar.addEventListener("click", () => {
            const isValid = validacion.validadorAutomatico.validarTodo(formModal);
            if (!isValid) return;

            const selectedVuln = vulnerabilitiesList.find(v => v.id == selectVulnerability.value);
            const selectedGrade = vulnerabilityGradesList.find(g => g.id == selectGrade.value);
            const newVuln = {
                tempId: Date.now().toString() + Math.random().toString(),
                vulnerability_id: selectVulnerability.value,
                vulnerability_grade_id: selectGrade.value,
                labelText: `${selectedVuln ? selectedVuln.name : ""} - Grado: ${selectedGrade ? selectedGrade.name : ""}`
            };
            vulnerabilities.push(newVuln);
            renderVulnerabilities();
            closeModal();
        });

        modal.showModal();
    });

    // Click en agregar acción
    btnAgregarAcc.addEventListener("click", () => {
        const modal = agregarAccionMemoria({
            members: membersList,
            initialData: null
        });
        document.body.appendChild(modal);

        const formModal = modal.querySelector("form");
        const btnCancelar = modal.querySelector(".modal-edicion__btn--secundario");
        const btnGuardar = modal.querySelector(".modal-edicion__btn--primario");
        const inputAction = modal.querySelector(".form__action");
        const selectMember = modal.querySelector(".form__member");
        const inputDate = modal.querySelector(".form__date");

        const closeModal = () => {
            modal.close();
            modal.remove();
        };
        btnCancelar.addEventListener("click", closeModal);
        modal.addEventListener("mousedown", (e) => {
            if (e.target === modal) closeModal();
        });

        validacion.validadorAutomatico.init(formModal);
        btnGuardar.addEventListener("click", () => {
            const isValid = validacion.validadorAutomatico.validarTodo(formModal);
            if (!isValid) return;

            const dateVal = inputDate.value;
            if (!dateVal) {
                validacion.mostrarError(inputDate, "La fecha de finalización es obligatoria.");
                return;
            }
            const today = new Date();
            const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            if (dateVal < todayStr) {
                validacion.mostrarError(inputDate, "La fecha de la acción no puede ser anterior al día de hoy.");
                return;
            }

            const selectedMember = membersList.find(m => m.id == selectMember.value);
            const newAction = {
                tempId: Date.now().toString() + Math.random().toString(),
                action: inputAction.value,
                member_id: selectMember.value,
                end_date: dateVal,
                labelText: `${inputAction.value} - ${selectedMember ? (selectedMember.full_name || `${selectedMember.names} ${selectedMember.last_names}`) : "Sin encargado"} - ${formatearFecha(dateVal)}`
            };
            actions.push(newAction);
            renderActions();
            closeModal();
        });

        modal.showModal();
    });

    // Master Submit Hook Form Send
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validar inputs principales
        const isValid = validacion.validadorAutomatico.validarTodo(form);
        if (!isValid) return;

        if (window.procesoPeticion) return;
        window.procesoPeticion = true; // Lock doble hit prevent
        botonSiguiente.disabled = true;

        // Mapper a DB Contract DTO Expected properties names 
        const datosRegistro = {
            threat_type_id: amenaza.value, // Select Foreign Key Relational Data Dict App State Value numeric id 
            description: descripcion.value,
            ubication: ubicacion.value,
            distance: distancia.value,
            family_plan_id: id // Linkea Relacion Raiz (Plan Familiar) 
        };
        
        try {
            // Push HTTP Create Resource Entry Factor Riesgo "RiskFactors" tables back
            const data = await api.post(`riskFactors`, datosRegistro); // Call Helpers Axios Wrapper Fetch 
            
            if (data.success) {
                const riesgoCreadoId = data.data.id;

                // Guardar las vulnerabilidades registradas en memoria
                for (const vuln of vulnerabilities) {
                    await api.post("vulnerabilityFactors", {
                        vulnerability_id: vuln.vulnerability_id,
                        vulnerability_grade_id: vuln.vulnerability_grade_id,
                        risk_factor_id: riesgoCreadoId
                    });
                }

                // Guardar las acciones registradas en memoria
                for (const action of actions) {
                    await api.post("riskReductionActions", {
                        action: action.action,
                        member_id: action.member_id,
                        risk_factor_id: riesgoCreadoId,
                        end_date: action.end_date
                    });
                }

                await alerta.alertaOK(data.message);
                window.location.href = `#/voluntario/plan_familiar/factores_de_riesgo?familia_id=${id}`; // Return Dash Layout Default Front 
            }
            else {
                alerta.alertaWarning(data.message, data.errors); // Business Layer Error Catch From Server Backend Logic Validators
            }
        } catch (error) {
            alerta.alertaError(error.errors || error.message);
        }

        // Release Form Locked Try-Catch Flow Completed Execution Return 
        botonSiguiente.disabled = false;
        window.procesoPeticion = false;
    });

    // Render inicial
    renderVulnerabilities();
    renderActions();
};