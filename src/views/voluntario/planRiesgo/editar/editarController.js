/**
 * Controlador: Gestor Completo del Riesgo, Modifica Riesgo Base e inyecta Relaciones Hijos (planRiesgo/editarController.js)
 * Controlador de Alta Complejidad. Permite Múltiples Operaciones Interrelacionadas:
 * 1. Edita Atributos Padre (Factor de Riesgo/Amenaza) PATCH Base.
 * 2. Visualización e Inserción usando modales de UI reutilizados de componentes para hijos: "Acciones para Reducir Riesgo" Y "Factores Vulnerabilidad".
 */
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { api } from "@/helpers/index.js";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { alertas as alerta } from "@/helpers/index.js";
import { validacionInputs as validacion } from "@/helpers/index.js";
import { VistaRiesgo, tarjetaVulnerabilidad, tarjetaAccion, agregarVulnerabilidadMemoria, agregarAccionMemoria } from "@/componentes/riesgo/index.js";

export default async () => {
    const esSupervisor = location.hash.includes("/supervisor/");
    const hashQuery = location.hash.split("?")[1] ?? "";
    const params = new URLSearchParams(hashQuery);

    const planId = params.get("familia_id");
    const riesgoId = params.get("riesgo_id");

    if (window.procesoPeticion === undefined) {
        window.procesoPeticion = true;
    }
    window.procesoPeticion = false;

    // Lógica Botón Atrás
    const botonBack = document.getElementById("botonBack");
    botonBack.onclick = async () => {
        if (window.procesoPeticion) return;
        if (esSupervisor) {
            location.href = `#/supervisor/plan_familiar/revision?familia_id=${planId}`;
            return;
        }
        location.href = `#/voluntario/plan_familiar/factores_de_riesgo?familia_id=${planId}`;
    };

    // Cargar datos del factor de riesgo desde el servidor
    let riskData = null;
    if (riesgoId) {
        riskData = await api.get(`riskFactors/${riesgoId}`);
    }

    // Instancia el componente visual de factores de riesgo (retorna el nodo del formulario)
    const form = await VistaRiesgo({
        riskData: riskData,
        esSupervisor: esSupervisor
    });

    const contenedor = document.getElementById("contenedor-riesgo");
    contenedor.innerHTML = ""; // Limpiar
    contenedor.appendChild(form);

    // Inicializar validador automático sobre el formulario
    validacion.validadorAutomatico.init(form);

    // Obtener referencias de elementos del DOM internos del formulario
    const descripcionTextarea = form.querySelector("#descripcion");
    const ubicacionInput = form.querySelector("#ubicacion");
    const amenazaSelect = form.querySelector("#tiposAmenaza");
    const distanciaInput = form.querySelector("#distancia");
    const btnAgregarVuln = form.querySelector("#btnAgregarVulnerabilidad");
    const btnAgregarAcc = form.querySelector("#btnAgregarAccion");
    const listaVulnDiv = form.querySelector("#vulnerabilidades-lista");
    const listaAccDiv = form.querySelector("#acciones-lista");
    const btnGuardar = form.querySelector("#botonGuardar");

    // Helper local para renderizar vulnerabilidades
    const cargarVulnerabilidades = async () => {
        const list = await api.get(`vulnerabilityFactors/riskFactor/${riesgoId}`) || [];
        listaVulnDiv.innerHTML = "";

        if (list.length === 0) {
            const emptyMsg = document.createElement("p");
            emptyMsg.className = "gestionarAfecciones__mensajeVacio";
            emptyMsg.textContent = "No hay vulnerabilidades registradas.";
            listaVulnDiv.appendChild(emptyMsg);
            return;
        }

        list.forEach((vuln) => {
            const tag = tarjetaVulnerabilidad(
                vuln,
                esSupervisor,
                () => {
                    // Editar vulnerabilidad en la base de datos usando el componente modal de UI
                    agregarVulnerabilidadMemoria({
                        initialData: vuln,
                        onSave: async (updatedData) => {
                            const res = await api.patch(`vulnerabilityFactors/${vuln.id}`, {
                                vulnerability_id: updatedData.vulnerability_id,
                                vulnerability_grade_id: updatedData.vulnerability_grade_id
                            });
                            if (res.success) {
                                await alerta.alertaOK(res.message);
                                cargarVulnerabilidades();
                                return true;
                            } else {
                                alerta.alertaWarning(res.message, res.errors);
                                return false;
                            }
                        }
                    });
                },
                async () => {
                    // Lógica del delete si es voluntario
                    const confirmacion = await alerta.alertaQuest("¿Seguro que deseas eliminar esta vulnerabilidad?");
                    if (!confirmacion.isConfirmed) return;

                    const res = await api.delet(`vulnerabilityFactors/${vuln.id}`);
                    if (res.success) {
                        await alerta.alertaOK(res.message);
                        cargarVulnerabilidades();
                    }
                }
            );
            listaVulnDiv.appendChild(tag);
        });
    };

    // Helper local para renderizar acciones de reducción
    const cargarAcciones = async () => {
        const list = await api.get(`riskReductionActions/riskFactor/${riesgoId}`) || [];
        listaAccDiv.innerHTML = "";

        if (list.length === 0) {
            const emptyMsg = document.createElement("p");
            emptyMsg.className = "gestionarAfecciones__mensajeVacio";
            emptyMsg.textContent = "No hay acciones de reducción registradas.";
            listaAccDiv.appendChild(emptyMsg);
            return;
        }

        list.forEach((action) => {
            const tag = tarjetaAccion(
                action,
                esSupervisor,
                () => {
                    // Editar acción de reducción en la base de datos usando el componente modal de UI
                    agregarAccionMemoria({
                        familyPlanId: planId,
                        initialData: action,
                        onSave: async (updatedData) => {
                            const res = await api.patch(`riskReductionActions/${action.id}`, {
                                action: updatedData.action,
                                member_id: updatedData.member_id,
                                end_date: updatedData.end_date
                            });
                            if (res.success) {
                                await alerta.alertaOK(res.message);
                                cargarAcciones();
                                return true;
                            } else {
                                alerta.alertaWarning(res.message, res.errors);
                                return false;
                            }
                        }
                    });
                },
                async () => {
                    // Lógica del delete si es voluntario
                    const confirmacion = await alerta.alertaQuest("¿Seguro que deseas eliminar esta acción?");
                    if (!confirmacion.isConfirmed) return;

                    const res = await api.delet(`riskReductionActions/${action.id}`);
                    if (res.success) {
                        await alerta.alertaOK(res.message);
                        cargarAcciones();
                    }
                }
            );
            listaAccDiv.appendChild(tag);
        });
    };

    // Cargar listas iniciales
    cargarVulnerabilidades();
    cargarAcciones();

    // Click en agregar vulnerabilidad
    if (!esSupervisor) {
        btnAgregarVuln.addEventListener("click", () => {
            agregarVulnerabilidadMemoria({
                initialData: null,
                onSave: async (data) => {
                    const res = await api.post("vulnerabilityFactors", {
                        vulnerability_id: data.vulnerability_id,
                        vulnerability_grade_id: data.vulnerability_grade_id,
                        risk_factor_id: riesgoId
                    });
                    if (res.success) {
                        await alerta.alertaOK(res.message);
                        cargarVulnerabilidades();
                        return true;
                    } else {
                        alerta.alertaWarning(res.message, res.errors);
                        return false;
                    }
                }
            });
        });

        // Click en agregar acción
        btnAgregarAcc.addEventListener("click", () => {
            agregarAccionMemoria({
                familyPlanId: planId,
                initialData: null,
                onSave: async (data) => {
                    const res = await api.post("riskReductionActions", {
                        action: data.action,
                        member_id: data.member_id,
                        risk_factor_id: riesgoId,
                        end_date: data.end_date
                    });
                    if (res.success) {
                        await alerta.alertaOK(res.message);
                        cargarAcciones();
                        return true;
                    } else {
                        alerta.alertaWarning(res.message, res.errors);
                        return false;
                    }
                }
            });
        });
    }

    // Submit del PADRE: Modificar Datos del Riesgo Base
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Validar inputs
        const isValid = validacion.validadorAutomatico.validarTodo(form);
        if (!isValid) return;

        if (window.procesoPeticion) return;
        window.procesoPeticion = true;
        btnGuardar.disabled = true;

        const datosRegistro = {
            threat_type_id: amenazaSelect.value,
            description: descripcionTextarea.value,
            location: ubicacionInput.value,
            distance: distanciaInput.value,
        };

        try {
            const data = await api.patch(`riskFactors/${riesgoId}`, datosRegistro);
            if (data.success) {
                await alerta.alertaOK(data.message);
                if (esSupervisor) {
                    location.href = `#/supervisor/plan_familiar/revision?familia_id=${planId}`;
                } else {
                    location.href = `#/voluntario/plan_familiar/factores_de_riesgo?familia_id=${planId}`;
                }
            } else {
                alerta.alertaWarning(data.message, data.errors);
            }
        } catch (error) {
            alerta.alertaError(error.errors || error.message);
        }

        btnGuardar.disabled = false;
        window.procesoPeticion = false;
    });
};