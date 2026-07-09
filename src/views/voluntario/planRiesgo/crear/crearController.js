/**
 * Controlador: Insertar Nuevo Factor Riesgo Inicial (planRiesgo/crear/crearController.js)
 * Formulario inicial simplificado para registrar un tipo de amenaza ("Sismo", "Inundación").
 * Envía el Payload directo porque el cliente confía en el validador estricto del HTML Required Properties o DB side.
 */
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { api } from "@/helpers/index.js";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { alertas as alerta } from "@/helpers/index.js";
import { validacionInputs as validacion } from "@/helpers/index.js";
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

    // Instancia el componente visual de factores de riesgo (retorna el nodo del formulario)
    const form = await VistaRiesgo({
        riskData: null,
        esSupervisor: false
    });

    const contenedor = document.getElementById("contenedor-riesgo");
    contenedor.innerHTML = ""; // Limpiar
    contenedor.appendChild(form);

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
                    // Callback al editar en memoria
                    agregarVulnerabilidadMemoria({
                        initialData: vuln,
                        onSave: async (updatedData) => {
                            const idx = vulnerabilities.findIndex(v => v.tempId === vuln.tempId);
                            if (idx !== -1) {
                                vulnerabilities[idx] = { ...vulnerabilities[idx], ...updatedData };
                                renderVulnerabilities();
                                return true;
                            }
                            return false;
                        }
                    });
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
                    // Callback al editar en memoria
                    agregarAccionMemoria({
                        familyPlanId: id,
                        initialData: action,
                        onSave: async (updatedData) => {
                            const idx = actions.findIndex(a => a.tempId === action.tempId);
                            if (idx !== -1) {
                                actions[idx] = { ...actions[idx], ...updatedData };
                                renderActions();
                                return true;
                            }
                            return false;
                        }
                    });
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
        agregarVulnerabilidadMemoria({
            initialData: null,
            onSave: async (data) => {
                const newVuln = {
                    tempId: Date.now().toString() + Math.random().toString(),
                    vulnerability_id: data.vulnerability_id,
                    vulnerability_grade_id: data.vulnerability_grade_id,
                    vulnerability_name: data.vulnerability_name,
                    grade_name: data.grade_name
                };
                vulnerabilities.push(newVuln);
                renderVulnerabilities();
                return true;
            }
        });
    });

    // Click en agregar acción
    btnAgregarAcc.addEventListener("click", () => {
        agregarAccionMemoria({
            familyPlanId: id,
            initialData: null,
            onSave: async (data) => {
                const newAction = {
                    tempId: Date.now().toString() + Math.random().toString(),
                    action: data.action,
                    member_id: data.member_id,
                    member_name: data.member_name,
                    end_date: data.end_date
                };
                actions.push(newAction);
                renderActions();
                return true;
            }
        });
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