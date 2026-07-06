import * as api from "@/helpers/api";
import { alertas as alerta } from "@/helpers/index.js";
import { validacionInputs as validacion } from "@/helpers/index.js";

/**
 * Abre modal en memoria para agregar/editar una vulnerabilidad.
 * 
 * @param {Object} params
 * @param {Object|null} params.initialData - Datos previos en caso de edición
 * @param {Function} params.onSave - Callback que retorna los datos seleccionados
 */
export const agregarVulnerabilidadMemoria = async ({ initialData = null, onSave }) => {
    const vulnerabilityGrades = await api.get("vulnerabilityGrades");
    const vulnerabilities = await api.get("vulnerabilities");

    const explicacionDiv = document.createElement("div");
    explicacionDiv.classList.add("explicacion", "modal");

    const tituloP = document.createElement("p");
    tituloP.classList.add("explicacion__titulo");
    tituloP.textContent = initialData ? "Editar Vulnerabilidad" : "Agregar Vulnerabilidad";
    explicacionDiv.appendChild(tituloP);

    const formDiv = document.createElement("div");
    formDiv.classList.add("form");

    const inputBox1 = document.createElement("div");
    inputBox1.classList.add("form__inputBox", "modal-50");

    const icon1 = document.createElement("i");
    icon1.className = "ri-alert-line";

    const selectVulnerability = document.createElement("select");
    selectVulnerability.classList.add("form__input", "form__vulnerability");

    const optionDefault1 = document.createElement("option");
    optionDefault1.value = "";
    optionDefault1.textContent = "Seleccione vulnerabilidad";
    selectVulnerability.appendChild(optionDefault1);

    vulnerabilities.forEach(item => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.name;
      if (initialData && (item.id == initialData.vulnerability_id || item.id == initialData.vulnerability?.id)) {
        option.selected = true;
      }
      selectVulnerability.appendChild(option);
    });

    inputBox1.append(icon1, selectVulnerability);
    formDiv.appendChild(inputBox1);

    const inputBox2 = document.createElement("div");
    inputBox2.classList.add("form__inputBox");

    const icon2 = document.createElement("i");
    icon2.className = "ri-bar-chart-line";

    const selectGrade = document.createElement("select");
    selectGrade.classList.add("form__input", "form__vulnerabilityGrade");

    const optionDefault2 = document.createElement("option");
    optionDefault2.value = "";
    optionDefault2.textContent = "Seleccione grado";
    selectGrade.appendChild(optionDefault2);

    vulnerabilityGrades.forEach(item => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.name;
      if (initialData && (item.id == initialData.vulnerability_grade_id || item.id == initialData.vulnerability_grade?.id)) {
        option.selected = true;
      }
      selectGrade.appendChild(option);
    });

    inputBox2.append(icon2, selectGrade);
    formDiv.appendChild(inputBox2);

    const container = document.createElement("div");
    container.append(explicacionDiv, formDiv);

    const funcionModal = async () => {
        const vId = selectVulnerability.value;
        const vgId = selectGrade.value;

        validacion.limpiarError(selectVulnerability);
        if (!vId) {
            validacion.mostrarError(selectVulnerability, "Debe seleccionar una vulnerabilidad.");
            return false;
        }

        validacion.limpiarError(selectGrade);
        if (!vgId) {
            validacion.mostrarError(selectGrade, "Debe seleccionar un grado de vulnerabilidad.");
            return false;
        }

        const selectedVuln = vulnerabilities.find(v => v.id == vId);
        const selectedGrade = vulnerabilityGrades.find(g => g.id == vgId);

        if (onSave) {
            const success = await onSave({
                vulnerability_id: vId,
                vulnerability_grade_id: vgId,
                vulnerability_name: selectedVuln ? selectedVuln.name : "",
                grade_name: selectedGrade ? selectedGrade.name : ""
            });
            return success;
        }
        return true;
    };

    alerta.Crear(container, funcionModal);
};

/**
 * Abre modal en memoria para agregar/editar una acción de reducción.
 * 
 * @param {Object} params
 * @param {string} params.familyPlanId - ID del plan familiar
 * @param {Object|null} params.initialData - Datos previos en caso de edición
 * @param {Function} params.onSave - Callback que retorna los datos seleccionados
 */
export const agregarAccionMemoria = async ({ familyPlanId, initialData = null, onSave }) => {
    const members = await api.get(`members/familyPlan/select/${familyPlanId}`);

    const explicacionDiv = document.createElement("div");
    explicacionDiv.classList.add("explicacion", "modal");

    const tituloP = document.createElement("p");
    tituloP.classList.add("explicacion__titulo");
    tituloP.textContent = initialData ? "Editar Acción" : "Agregar Acción de Reducción";
    explicacionDiv.appendChild(tituloP);

    const formDiv = document.createElement("div");
    formDiv.classList.add("form");

    const inputBox1 = document.createElement("div");
    inputBox1.classList.add("form__inputBox", "modal-50");

    const icon1 = document.createElement("i");
    icon1.className = "ri-shield-check-line";

    const inputAction = document.createElement("input");
    inputAction.type = "text";
    inputAction.classList.add("form__input", "form__action");
    inputAction.placeholder = "Acción a realizar";
    inputAction.autocomplete = "off";
    if (initialData) {
        inputAction.value = initialData.action || "";
    }

    inputBox1.append(icon1, inputAction);
    formDiv.appendChild(inputBox1);

    const inputBox2 = document.createElement("div");
    inputBox2.classList.add("form__inputBox");

    const icon2 = document.createElement("i");
    icon2.className = "ri-user-line";

    const selectMember = document.createElement("select");
    selectMember.classList.add("form__input", "form__member");

    const optionDefault = document.createElement("option");
    optionDefault.value = "";
    optionDefault.textContent = "Seleccione un miembro";
    selectMember.appendChild(optionDefault);

    members.forEach(member => {
      const option = document.createElement("option");
      option.value = member.id;
      option.textContent = member.full_name;
      if (initialData && member.id == initialData.member_id) {
        option.selected = true;
      }
      selectMember.appendChild(option);
    });

    inputBox2.append(icon2, selectMember);
    formDiv.appendChild(inputBox2);

    const inputBox3 = document.createElement("div");
    inputBox3.classList.add("form__inputBox");

    const icon3 = document.createElement("i");
    icon3.className = "ri-calendar-line";

    const inputDate = document.createElement("input");
    inputDate.type = "date";
    inputDate.classList.add("form__input", "form__date");
    if (initialData) {
        inputDate.value = initialData.end_date || "";
    }

    inputBox3.append(icon3, inputDate);
    formDiv.appendChild(inputBox3);

    const container = document.createElement("div");
    container.append(explicacionDiv, formDiv);

    const funcionModal = async () => {
        const action = inputAction.value;
        const memberId = selectMember.value;
        const date = inputDate.value;

        validacion.limpiarError(inputAction);
        if (!action) {
            validacion.mostrarError(inputAction, "La acción es obligatoria.");
            return false;
        }

        validacion.limpiarError(selectMember);
        if (!memberId) {
            validacion.mostrarError(selectMember, "Debe seleccionar un miembro encargado.");
            return false;
        }

        validacion.limpiarError(inputDate);
        if (!date) {
            validacion.mostrarError(inputDate, "La fecha de finalización es obligatoria.");
            return false;
        }

        // Validar que la fecha no sea pasada
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(date + "T00:00:00");
        if (selectedDate < today) {
            validacion.mostrarError(inputDate, "La fecha de la acción no puede ser anterior al día de hoy.");
            return false;
        }

        const selectedMember = members.find(m => m.id == memberId);

        if (onSave) {
            const success = await onSave({
                action,
                member_id: memberId,
                member_name: selectedMember ? selectedMember.full_name : "",
                end_date: date
            });
            return success;
        }
        return true;
    };

    alerta.Crear(container, funcionModal);
};

/**
 * Abre el modal de solo lectura para visualizar los detalles completos de un factor de riesgo.
 * 
 * @param {string} id - ID del factor de riesgo
 */
export const verRiesgo = async (id) => {
    // 1. Invoca llamadas GET para centralizar info relacionada
    const datos = await api.get(`riskFactors/${id}`);
    const acciones = await api.get(`riskReductionActions/riskFactor/${id}`);
    const vulnerabilidades = await api.get(`vulnerabilityFactors/riskFactor/${id}`);
    
    // Contenedores textuales iterables
    let todasAcciones = "";
    let todasVulnerabilidades = "";
    let contadorAcciones = 0;
    let contadorVulnerabilidades = 0;

    // Procesamiento y agrupación de Strings p/acciones
    acciones.forEach((accion) => {
        const encName = accion.member ? `${accion.member.names} ${accion.member.last_names}` : "Sin encargado";
        if (contadorAcciones > 0) {
            todasAcciones += `, ${accion.action} - Encargado: ${encName} - Fecha finalización: ${accion.end_date}`;
        } else {
            todasAcciones += `${accion.action} - Encargado: ${encName} - Fecha finalización: ${accion.end_date}`;
        }
        contadorAcciones++;
    });
    
    if (acciones.length === 0) todasAcciones = "ninguna";
    
    // Procesamiento y agrupación de Strings p/vulnerabilidades
    vulnerabilidades.forEach((vulnerabilidad) => {
        const vName = vulnerabilidad.vulnerability?.name || "";
        const gName = vulnerabilidad.vulnerability_grade?.name || "";
        if (contadorVulnerabilidades > 0) {
            todasVulnerabilidades += `, ${vName} - Grado: ${gName}`;
        } else {
            todasVulnerabilidades += `${vName} - Grado: ${gName}`;
        }
        contadorVulnerabilidades++;
    });
    
    if (vulnerabilidades.length === 0) todasVulnerabilidades = "ninguna";

    // 2. Definición del cuerpo visual usando creación DOM
    const modalDiv = document.createElement("div");
    modalDiv.classList.add("modalVer", "modal");

    const crearDato = (claseIcono, titulo, texto, largo) => {
        const dato = document.createElement("div");
        dato.classList.add("modalVer__dato");
        if (largo) dato.classList.add("modalVer__dato--largo");

        const icon = document.createElement("i");
        icon.classList.add(claseIcono);

        const tituloDiv = document.createElement("div");
        tituloDiv.classList.add("modalVer__titulo");
        tituloDiv.textContent = titulo;

        const textoDiv = document.createElement("div");
        textoDiv.classList.add("modalVer__texto");
        textoDiv.textContent = texto;

        dato.append(icon, tituloDiv, textoDiv);
        return dato;
    };

    modalDiv.append(
        crearDato("ri-shield-check-line", "Tipo de Amenaza", datos.threat_type?.name || "", true),
        crearDato("ri-user-line", "Descripcion", datos.description || "", true),
        crearDato("ri-calendar-line", "Ubicacion del riesgo", datos.ubication || datos.location || "", false),
        crearDato("ri-map-pin-line", "Distancia", `${datos.distance || 0} m`, false),
        crearDato("ri-list-check", "Acciones de reducción de riesgo", todasAcciones, true),
        crearDato("ri-list-check", "Vulnerabilidades", todasVulnerabilidades, true)
    );

    // 3. Renderiza en pantalla sin botones CRUD
    alerta.Ver(modalDiv, false, false, null, null, null);
};
