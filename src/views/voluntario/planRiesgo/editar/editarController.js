import * as api from "../../../../helpers/api";
import * as alerta from "../../../../helpers/alertas";
import * as cargarDatos from "../../../../helpers/cargarDatos";
import * as adjuntarOpc from "../../../../helpers/adjuntarOpciones";
import * as modalFactorRiesgo from "../../../../helpers/modales/factorRiesgo";
import acordeon from "../../../../helpers/acordeon";

export default async () => {
    const botonBack = document.getElementById("botonBack");
    const botonGuardar = document.getElementById("botonGuardar");
    const form = document.querySelector(".form");
    const contenedorAcciones = document.querySelector(".gestionarAcciones__lista");
    const contenedorVulnerabilidades = document.querySelector(".gestionarVulnerabilidades__lista");
    const botonAñadirAcciones = document.querySelector(".gestionarAcciones__boton");
    const botonAñadirVulnerabilidad = document.querySelector(".gestionarVulnerabilidades__boton");
    const id = location.hash.split("=")[1];
    const planId = id.split(",")[0];
    const riesgoId = id.split(",")[1];

    if (window.procesoPeticion === undefined) {
        window.procesoPeticion = true;
    }
    window.procesoPeticion = true;

    botonBack.onclick = async () => {
        if (window.procesoPeticion) return;
        location.href = `#/voluntario-planRiesgo/ver/id=${planId}`;
    };

    // Inputs
    const amenazas = document.getElementById("tiposAmenaza");
    const descripcion = document.getElementById("descripcion");
    const ubicacion = document.getElementById("ubicacion");
    const distancia = document.getElementById("distancia");

    // Select
    await adjuntarOpc.adjuntar(amenazas, "threatTypes");

    // Cargar datos del riesgo
    await cargarDatos.cargarDatos(`riskFactors/${riesgoId}`,
        [amenazas, descripcion, ubicacion, distancia],
        ["threat_type_id", "description", "ubication", "distance"]
    );



    const cargarAcciones = async () => {
        const acciones = await api.get(`riskReductionActions/riskFactor/${riesgoId}`);
        contenedorAcciones.innerHTML = "";

        acciones.forEach((item) => {
            const boton = document.createElement("button");
            boton.className = "gestionarAfecciones__afeccion";
            boton.dataset.id = item.id;
            boton.innerHTML = `
                <span class="gestionarAfecciones__tipoNombre">
                    <i class="ri-eye-fill"></i> ${item.action} - ${item.end_date}
                </span>`;
            contenedorAcciones.appendChild(boton);
        });
    };

    const cargarVulnerabilidades = async () => {
        const acciones = await api.get(`vulnerabilityFactors/riskFactor/${riesgoId}`);
        contenedorVulnerabilidades.innerHTML = "";

        acciones.forEach((item) => {
            const boton = document.createElement("button");
            boton.className = "gestionarAfecciones__afeccion";
            boton.dataset.id = item.id;
            boton.innerHTML = `
                <span class="gestionarAfecciones__tipoNombre">
                    <i class="ri-eye-fill"></i> ${item.vulnerability.name} - Grado: ${item.vulnerability_grade.name}
                </span>`;
            contenedorVulnerabilidades.appendChild(boton);
        });
    };

    acordeon()
    cargarAcciones();
    cargarVulnerabilidades();

    window.procesoPeticion = false;
    botonGuardar.disabled = false;

    botonAñadirAcciones.addEventListener("click", async () => {
        modalFactorRiesgo.crearAccion(riesgoId, planId, cargarAcciones);
    });

    botonAñadirVulnerabilidad.addEventListener("click", async () => {
        modalFactorRiesgo.crearVulnerabilidad(riesgoId, cargarVulnerabilidades);
    });

    contenedorAcciones.addEventListener("click", async (e) => {
        const id = e.target.closest(".gestionarAfecciones__afeccion").dataset.id;
        modalFactorRiesgo.verEditarEliminarAccion(id, planId, cargarAcciones);
    });
    contenedorVulnerabilidades.addEventListener("click", async (e) => {
        const id = e.target.closest(".gestionarAfecciones__afeccion").dataset.id;
        modalFactorRiesgo.verEditarEliminarVulnerabilidad(id, cargarVulnerabilidades);
    });


    // Submit
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        window.procesoPeticion = true;
        botonGuardar.disabled = true;

        const datosRegistro = {
            threat_type_id: amenazas.value,
            description: descripcion.value,
            location: ubicacion.value,
            distance: distancia.value,
        };

        try {
            const data = await api.patch(`riskFactors/${riesgoId}`, datosRegistro);
            if (data.success) {
                await alerta.alertaOK(data.message);
            } else {
                alerta.alertaWarning(data.message, data.errors);
            }
        } catch (error) {
            alerta.alertaError(error.errors);
        }

        botonGuardar.disabled = false;
        window.procesoPeticion = false;
    });
};