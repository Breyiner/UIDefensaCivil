/**
 * Helper de Modales Complejos: Factores de Riesgo (factorRiesgo.js)
 * Contiene un mini-ecosistema de modales entrelazados. Permite no solo Ver el factor en sí,
 * sino levantar pop-ups hijos para Crear, Editar y Eliminar tareas de reducción y 
 * debilidades (Vulnerabilidades) colgadas de dicho Riesgo.
 */
import * as api from "../api";
import * as alerta from "../alertas";

// Ventana General Informativa del Factor de Riesgo particular
export const ver = async (id) => {

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
    contadorAcciones > 0 ? 
    (todasAcciones += `, ${accion.action} - Encargado: ${accion.member.names} ${accion.member.last_names} - Fecha finalización: ${accion.end_date}`) :
    (todasAcciones += `${accion.action} - Encargado: ${accion.member.names} ${accion.member.last_names} - Fecha finalización: ${accion.end_date}`);
    contadorAcciones++;});
    
    if (acciones.length == 0) todasAcciones = "ninguna";
    
    // Procesamiento y agrupación de Strings p/vulnerabilidades
    vulnerabilidades.forEach((vulnerabilidad) => {
    contadorVulnerabilidades > 0 ?
    (todasVulnerabilidades += `, ${vulnerabilidad.vulnerability.name} - Grado: ${vulnerabilidad.vulnerability_grade.name}`) :
      todasVulnerabilidades += `${vulnerabilidad.vulnerability.name} - Grado: ${vulnerabilidad.vulnerability_grade.name}`;
    });
    
    if (vulnerabilidades.length == 0) todasVulnerabilidades = "ninguna";

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
      crearDato("ri-shield-check-line", "Tipo de Amenaza", datos.threat_type.name, true),
      crearDato("ri-user-line", "Descripcion", datos.description, true),
      crearDato("ri-calendar-line", "Ubicacion del riesgo", datos.ubication, false),
      crearDato("ri-map-pin-line", "Distancia", `${datos.distance} m`, false),
      crearDato("ri-list-check", "Acciones de reducción de riesgo", todasAcciones, true),
      crearDato("ri-list-check", "Vulnerabilidades", todasVulnerabilidades, true)
    );

    // 3. Renderiza en pantalla sin botones CRUD
    alerta.Ver(modalDiv, false, false, null, null, null);
};


// Lanza formulario para crear una nueva "Acción de Reducción" asociada al Factor Riesgo
export const crearAccion = async (riskFactorId, familyPlanId, recargarContainer) => {

    // Extrae los familiares registrados en el plan para listarlos en el Input Encargado
    const members = await api.get(`members/familyPlan/select/${familyPlanId}`);
    // Marco del SweetAlert
    const explicacionDiv = document.createElement("div");
    explicacionDiv.classList.add("explicacion", "modal");

    const tituloP = document.createElement("p");
    tituloP.classList.add("explicacion__titulo");
    tituloP.textContent = "Agregar Acción de Reducción";
    explicacionDiv.appendChild(tituloP);

    const formDiv = document.createElement("div");
    formDiv.classList.add("form");

    const inputBox1 = document.createElement("div");
    inputBox1.classList.add("form__inputBox", "modal-50");

    const icon1 = document.createElement("i");
    icon1.classList.add("ri-shield-check-line");

    const inputAction = document.createElement("input");
    inputAction.type = "text";
    inputAction.classList.add("form__input", "form__action");
    inputAction.placeholder = "Acción a realizar";
    inputAction.autocomplete = "off";

    inputBox1.append(icon1, inputAction);
    formDiv.appendChild(inputBox1);

    const inputBox2 = document.createElement("div");
    inputBox2.classList.add("form__inputBox");

    const icon2 = document.createElement("i");
    icon2.classList.add("ri-user-line");

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
      selectMember.appendChild(option);
    });

    inputBox2.append(icon2, selectMember);
    formDiv.appendChild(inputBox2);

    const inputBox3 = document.createElement("div");
    inputBox3.classList.add("form__inputBox");

    const icon3 = document.createElement("i");
    icon3.classList.add("ri-calendar-line");

    const inputDate = document.createElement("input");
    inputDate.type = "date";
    inputDate.classList.add("form__input", "form__date");

    inputBox3.append(icon3, inputDate);
    formDiv.appendChild(inputBox3);

    const container = document.createElement("div");
    container.append(explicacionDiv, formDiv);

    // Hook: se activa con el Ok confirmatorio
    const funcionModal = async () => {

        // Cosecha los value
        const datos = {
            action: document.querySelector(".form__action").value,
            member_id: document.querySelector(".form__member").value,
            risk_factor_id: riskFactorId, // Amarre foreign key vital
            end_date: document.querySelector(".form__date").value
        };

        try {
            // Emite por POST
            const data = await api.post("riskReductionActions", datos);

            // Validaciones API (success flag)
            if (data.success) {
                await alerta.alertaOK(data.message);
                await recargarContainer();
            } else {
                alerta.alertaWarning(data.message, data.errors);
            }

        } catch (error) {
            alerta.alertaError(error.errors);
        }

    };

    // Abre el creador
    alerta.Crear(container, funcionModal);
};

// Sub-Controlador: Lee en modal una acción de riesgo, pero con habilitación CRUD (Edita y Borra hijo)
export const verEditarEliminarAccion = async (id, familyPlanId, recargarContainer, esSupervisor) => {

    const datos = await api.get(`riskReductionActions/${id}`);
    
    // Estructura de vista default (lectura)
    const modalDiv = document.createElement("div");
    modalDiv.classList.add("modalVer", "modal");

    const crearDato = (claseIcono, titulo, texto) => {
      const dato = document.createElement("div");
      dato.classList.add("modalVer__dato", "modalVer__dato--largo");

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
      crearDato("ri-shield-check-line", "Acción", datos.action),
      crearDato("ri-user-line", "Miembro", `${datos.member.names} ${datos.member.last_names}`),
      crearDato("ri-calendar-line", "Fecha Finalización", datos.end_date)
    );

    // ✏ ALGORITMO DE EDICIÓN
    const funcionModalEditar = async () => {

        // Recarga catálogo delegados
        const members = await api.get(`members/familyPlan/select/${familyPlanId}`);
        
        // Pantalla de Form Editar rellena
        const explicacionDiv = document.createElement("div");
        explicacionDiv.classList.add("explicacion", "modal");

        const tituloP = document.createElement("p");
        tituloP.classList.add("explicacion__titulo");
        tituloP.textContent = "Editar Acción";
        explicacionDiv.appendChild(tituloP);

        const formDiv = document.createElement("div");
        formDiv.classList.add("form");

        const inputBox1 = document.createElement("div");
        inputBox1.classList.add("form__inputBox", "modal-50");

        const icon1 = document.createElement("i");
        icon1.classList.add("ri-shield-check-line");

        const inputAction = document.createElement("input");
        inputAction.type = "text";
        inputAction.classList.add("form__input", "form__action");
        inputAction.value = datos.action;

        inputBox1.append(icon1, inputAction);
        formDiv.appendChild(inputBox1);

        const inputBox2 = document.createElement("div");
        inputBox2.classList.add("form__inputBox");

        const icon2 = document.createElement("i");
        icon2.classList.add("ri-user-line");

        const selectMember = document.createElement("select");
        selectMember.classList.add("form__input", "form__member");

        members.forEach(member => {
          const option = document.createElement("option");
          option.value = member.id;
          option.textContent = member.full_name;
          if (member.id == datos.member_id) option.selected = true;
          selectMember.appendChild(option);
        });

        inputBox2.append(icon2, selectMember);
        formDiv.appendChild(inputBox2);

        const inputBox3 = document.createElement("div");
        inputBox3.classList.add("form__inputBox");

        const icon3 = document.createElement("i");
        icon3.classList.add("ri-calendar-line");

        const inputDate = document.createElement("input");
        inputDate.type = "date";
        inputDate.classList.add("form__input", "form__date");
        inputDate.value = datos.end_date;

        inputBox3.append(icon3, inputDate);
        formDiv.appendChild(inputBox3);

        const container = document.createElement("div");
        container.append(explicacionDiv, formDiv);

        const funcionModal = async () => {

            const dataUpdate = {
                action: document.querySelector(".form__action").value,
                member_id: document.querySelector(".form__member").value,
                end_date: document.querySelector(".form__date").value
            };

            try {
                // Notese el uso de "PATCH" para edición parcial
                const response = await api.patch(`riskReductionActions/${id}`, dataUpdate);

                if (response.success) {
                    await alerta.alertaOK(response.message);
                    await recargarContainer();
                } else {
                    alerta.alertaWarning(response.message, response.errors);
                }

            } catch (error) {
                alerta.alertaError(error.errors);
            }

        };

        alerta.Crear(container, funcionModal);
    };

    // 🗑 ALGORITMO BORRADOR
    const funcionModalEliminar = async () => {

        // Prevención accidentes
        const confirmacion = await alerta.alertaQuest(
            "¿Seguro que deseas eliminar esta acción?"
        );

        if (!confirmacion.isConfirmed) return; // Rompe si "Cancelar"

        // Eliminación física
        const eliminado = await api.delet(`riskReductionActions/${id}`);

        if (eliminado.success) {
            await alerta.alertaOK(eliminado.message);
            await recargarContainer();
        }
    };

    // Renderiza modal incial de vista habilitando edición y tachado
    alerta.Ver(modalDiv, true, true, funcionModalEditar, funcionModalEliminar, esSupervisor);
};


// Agregador de debilidades de un Factor de Riesgo. Mismo mecanismo de creación que arriba
export const crearVulnerabilidad = async (riskFactorId, recargarContainer) => {

    // 🔹 Traer selects dependientes para llenar el dropdown
    const vulnerabilityGrades = await api.get("vulnerabilityGrades");
    const vulnerabilities = await api.get("vulnerabilities");

    const explicacionDiv = document.createElement("div");
    explicacionDiv.classList.add("explicacion", "modal");

    const tituloP = document.createElement("p");
    tituloP.classList.add("explicacion__titulo");
    tituloP.textContent = "Agregar Vulnerabilidad";
    explicacionDiv.appendChild(tituloP);

    const formDiv = document.createElement("div");
    formDiv.classList.add("form");

    const inputBox1 = document.createElement("div");
    inputBox1.classList.add("form__inputBox", "modal-50");

    const icon1 = document.createElement("i");
    icon1.classList.add("ri-alert-line");

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
      selectVulnerability.appendChild(option);
    });

    inputBox1.append(icon1, selectVulnerability);
    formDiv.appendChild(inputBox1);

    const inputBox2 = document.createElement("div");
    inputBox2.classList.add("form__inputBox");

    const icon2 = document.createElement("i");
    icon2.classList.add("ri-bar-chart-line");

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
      selectGrade.appendChild(option);
    });

    inputBox2.append(icon2, selectGrade);
    formDiv.appendChild(inputBox2);

    const container = document.createElement("div");
    container.append(explicacionDiv, formDiv);

    const funcionModal = async () => {

        const datos = {
            vulnerability_id: document.querySelector(".form__vulnerability").value,
            vulnerability_grade_id: document.querySelector(".form__vulnerabilityGrade").value,
            risk_factor_id: riskFactorId
        };

        try {
            const response = await api.post("vulnerabilityFactors", datos);

            if (response.success) {
                await alerta.alertaOK(response.message);
                await recargarContainer(); // Carga de nuevo la visual
            } else {
                alerta.alertaWarning(response.message, response.errors);
            }

        } catch (error) {
            alerta.alertaError(error.errors);
        }
    };

    alerta.Crear(container, funcionModal);
};

// Modal de lectura simple pero equiparado con la capacidad de borrado de dicha vulnerabilidad detectada
export const verEditarEliminarVulnerabilidad = async (id, recargarContainer, esSupervisor) => {

    const datos = await api.get(`vulnerabilityFactors/${id}`);

    const modalDiv = document.createElement("div");
    modalDiv.classList.add("modalVer", "modal");

    const crearDato = (claseIcono, titulo, texto) => {
      const dato = document.createElement("div");
      dato.classList.add("modalVer__dato", "modalVer__dato--largo");

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
      crearDato("ri-alert-line", "Vulnerabilidad", datos.vulnerability.name),
      crearDato("ri-bar-chart-line", "Grado", datos.vulnerability_grade.name)
    );

    // ✏ EDITAR (Nuevos Selects pre-seleccionados)
    const funcionModalEditar = async () => {

        const vulnerabilityGrades = await api.get("vulnerabilityGrades");
        const vulnerabilities = await api.get("vulnerabilities");

        const explicacionDiv = document.createElement("div");
        explicacionDiv.classList.add("explicacion", "modal");

        const tituloP = document.createElement("p");
        tituloP.classList.add("explicacion__titulo");
        tituloP.textContent = "Editar Vulnerabilidad";
        explicacionDiv.appendChild(tituloP);

        const formDiv = document.createElement("div");
        formDiv.classList.add("form");

        const inputBox1 = document.createElement("div");
        inputBox1.classList.add("form__inputBox", "modal-50");

        const icon1 = document.createElement("i");
        icon1.classList.add("ri-alert-line");

        const selectVulnerability = document.createElement("select");
        selectVulnerability.classList.add("form__input", "form__vulnerability");

        vulnerabilities.forEach(item => {
          const option = document.createElement("option");
          option.value = item.id;
          option.textContent = item.name;
          if (item.id == datos.vulnerability_id) option.selected = true;
          selectVulnerability.appendChild(option);
        });

        inputBox1.append(icon1, selectVulnerability);
        formDiv.appendChild(inputBox1);

        const inputBox2 = document.createElement("div");
        inputBox2.classList.add("form__inputBox");

        const icon2 = document.createElement("i");
        icon2.classList.add("ri-bar-chart-line");

        const selectGrade = document.createElement("select");
        selectGrade.classList.add("form__input", "form__vulnerabilityGrade");

        vulnerabilityGrades.forEach(item => {
          const option = document.createElement("option");
          option.value = item.id;
          option.textContent = item.name;
          if (item.id == datos.vulnerability_grade_id) option.selected = true;
          selectGrade.appendChild(option);
        });

        inputBox2.append(icon2, selectGrade);
        formDiv.appendChild(inputBox2);

        const container = document.createElement("div");
        container.append(explicacionDiv, formDiv);

        const funcionModal = async () => {

            const dataUpdate = {
                vulnerability_id: document.querySelector(".form__vulnerability").value,
                vulnerability_grade_id: document.querySelector(".form__vulnerabilityGrade").value
            };

            try {
                // Pide actualización en el backend (PATCH)
                const response = await api.patch(`vulnerabilityFactors/${id}`, dataUpdate);

                if (response.success) {
                    await alerta.alertaOK(response.message);
                    await recargarContainer();
                } else {
                    alerta.alertaWarning(response.message, response.errors);
                }

            } catch (error) {
                alerta.alertaError(error.errors);
            }
        };

        // Levanta cuadro editable
        alerta.Crear(container, funcionModal);
    };

    // 🗑 ELIMINAR VULNERABILIDAD SUBORDINADA
    const funcionModalEliminar = async () => {

        const confirmacion = await alerta.alertaQuest(
            "¿Seguro que deseas eliminar esta vulnerabilidad?"
        );

        if (!confirmacion.isConfirmed) return;

        const eliminado = await api.delet(`vulnerabilityFactors/${id}`);

        if (eliminado.success) {
            await alerta.alertaOK(eliminado.message);
            await recargarContainer();
        }
    };

    // Abre el modal inicial inyectando las lógicas CRUD completas
    alerta.Ver(modalDiv, true, true, funcionModalEditar, funcionModalEliminar, esSupervisor);
};