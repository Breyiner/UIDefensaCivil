import { api } from "@/helpers/index.js";

import { alertas as alerta } from "@/helpers/index.js";

import { adjuntarOpciones as adjuntarOpc } from "@/helpers/index.js";

import { cargarDatosHelper as cargarDatos } from "@/helpers/index.js";

import { validacionInputs as validacion } from "@/helpers/index.js";

import { planAccion as modalPlanAccion } from "@/helpers/modales/index.js";

const planAccionController = async () => {

    const botonBack = document.getElementById("botonBack"); // Botón para regresar al menú principal del Plan
    const boton = document.getElementById("botonGuardar"); // Botón principal para enviar el formulario
    const form = document.querySelector(".form"); // Formulario principal en la pantalla

    const id = location.hash.split("=")[1];
    const esSupervisor = location.hash.includes("/supervisor/");

    const miembro = document.getElementById("miembro"); // Lista desplegable de los familiares
    const factorRiesgo = document.getElementById("factorRiesgo"); // Lista desplegable de los riesgos
    const containerAccion = document.querySelector(".container__gap"); // Contenedor que aloja la lista de acciones (permanece oculto al inicio)

    if (window.procesoPeticion === undefined) {
        window.procesoPeticion = true; // Se bloquea temporalmente mientras se cargan los datos de las listas
    }

    window.procesoPeticion = true;

    botonBack.onclick = () => {

        if (window.procesoPeticion) return;

        location.href = esSupervisor ? `#/supervisor/plan_familiar/revision?familia_id=${id}` : `#/voluntario/plan_familiar/familia?id=${id}`;
    };

    await adjuntarOpc.adjuntarMiembros(miembro, `members/familyPlan/select/${id}`,);
    await adjuntarOpc.adjuntarFactorRiesgo(factorRiesgo, `riskFactors/familyPlan/select/${id}`);

    miembro.addEventListener("change", () => {
        validacion.limpiarError(miembro);
    });

    factorRiesgo.addEventListener("change", () => {
        validacion.limpiarError(factorRiesgo);
    });

    window.procesoPeticion = false;
    boton.disabled = false;

    const existePlanAccion = await api.get(
        `actionPlans/familyPlan/boolean/${id}`,
    );

    if (existePlanAccion.boolean) {

        await cargarDatos.cargarDatos(
            `actionPlans/familyPlan/${id}`, // Dirección del servidor con los datos guardados
            [miembro, factorRiesgo], // Elementos de la pantalla que se van a rellenar
            ["member_id", "risk_factor_id"], // Nombres de los datos según la base de datos
        );
    }

    // ---- Guardar datos base (miembro + factor de riesgo) ----
    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        window.procesoPeticion = true;
        boton.disabled = true;

        validacion.validar_select(miembro);
        validacion.validar_select(factorRiesgo);

        const datosRegistro = {
            member_id: miembro.value,
            risk_factor_id: factorRiesgo.value,
        };

        try {

            let data;

            if (existePlanAccion.boolean) {

                const idPlanAccion = await api.get(`actionPlans/familyPlan/${id}`);

                data = await api.put(`actionPlans/${idPlanAccion.id}`, datosRegistro);

            } else {

                data = await api.post(`actionPlans`, datosRegistro);
            }

            if (data.success) {

                await alerta.alertaOK(data.message);

                if (!existePlanAccion.boolean) location.reload();

            } else {

                alerta.alertaWarning(data.message, data.errors);
            }

        } catch (error) {
            alerta.alertaError(error.errors);
        }

        boton.disabled = false;
        window.procesoPeticion = false;
    });

    containerAccion.classList.remove("invisible");
    
    // -------------- Si no hay plan guardado aún, no hay nada más que mostrar --------------
    if (!existePlanAccion.boolean) return;

    const idPlanAccion = await api.get(`actionPlans/familyPlan/${id}`);

    // ---- Botonera de pestañas Antes / Durante / Después ----
    const botonera = document.createElement('div');
    botonera.classList.add('planAccion__botonera');

    const antesBtn = document.createElement('button');
    antesBtn.textContent = 'Antes';

    const duranteBtn = document.createElement('button');
    duranteBtn.textContent = 'Durante';

    const despuesBtn = document.createElement('button');
    despuesBtn.textContent = 'Despues';

    botonera.append(antesBtn, duranteBtn, despuesBtn);
    containerAccion.append(botonera);

    // ---- Sección de contenedores (uno por fase) ----
    const accionSection = document.createElement('div');
    accionSection.classList.add('gestionarPlanAccion__secciones');
    containerAccion.append(accionSection);

    // Crea el contenido interno de un contenedor de fase: botón "+Agregar" + lista de tarjetas
    const crearContenidoFase = (tipoEstado) => {

        const contenedor = document.createElement('div');

        const botonAñadir = document.createElement('button');
        botonAñadir.classList.add('boton');
        botonAñadir.type = 'button';
        botonAñadir.textContent = '+ Agregar acción';
        if (esSupervisor) botonAñadir.classList.add('oculto');

        const lista = document.createElement('div');
        lista.classList.add('gestionarAfecciones__lista');

        const cargarAfecciones = async () => {

            const afecciones = await api.get(`actionPlanActions/actionPlan/${idPlanAccion.id}`);

            lista.innerHTML = '';

            const afeccionesFiltradas = afecciones.filter(item => tipoEstado == item.action_type_id);

            if (afeccionesFiltradas.length === 0) {
                const mensajeVacio = document.createElement('p');
                mensajeVacio.classList.add('gestionarAfecciones__mensajeVacio');
                mensajeVacio.textContent = "No hay registros disponibles para esta fase.";
                lista.appendChild(mensajeVacio);
                return;
            }

            afeccionesFiltradas.forEach((item) => {
                const tarjeta = document.createElement('button');
                tarjeta.classList.add('gestionarAfecciones__afeccion');
                tarjeta.dataset.id = item.id;

                const Descripcion = document.createElement('div');
                Descripcion.classList.add('gestionarAfecciones__descripcion');

                const icon = document.createElement('i');
                icon.classList.add('ri-hammer-line');

                const descripcionText = document.createElement('p');
                descripcionText.textContent = item.description;

                Descripcion.append(icon, descripcionText)
                // span.appendChild(document.createTextNode(` ${item.member_name} - ${item.description}`));

                const Responsable = document.createElement('div');
                Responsable.classList.add('gestionarAfecciones__Responsable');

                const responsableSpan = document.createElement('span');
                responsableSpan.textContent = 'Responsable:';

                const responsableName = document.createElement('p');
                responsableName.textContent = item.member_name;

                Responsable.append(responsableSpan, responsableName);

                tarjeta.append(Descripcion, Responsable);
                lista.appendChild(tarjeta);
            });

        };

        botonAñadir.addEventListener('click', () => {
            modalPlanAccion.crear(id, tipoEstado, cargarAfecciones, idPlanAccion.id);
        });

        lista.addEventListener('click', (e) => {
            const target = e.target.closest('.gestionarAfecciones__afeccion');
            if (!target) return;
            modalPlanAccion.verEditarEliminar(target.dataset.id, id, cargarAfecciones, esSupervisor);
        });

        contenedor.append(botonAñadir, lista);

        return { contenedor, cargarAfecciones };
    };

    const antes = crearContenidoFase(1);
    const durante = crearContenidoFase(2);
    const despues = crearContenidoFase(3);

    antes.contenedor.classList.add('gestionarPlanAccion__fase',);
    durante.contenedor.classList.add('gestionarPlanAccion__fase', 'oculto');
    despues.contenedor.classList.add('gestionarPlanAccion__fase', 'oculto');

    accionSection.append(antes.contenedor, durante.contenedor, despues.contenedor);

    // Carga las tarjetas de las 3 fases desde el inicio
    await Promise.all([
        antes.cargarAfecciones(),
        durante.cargarAfecciones(),
        despues.cargarAfecciones(),
    ]);

    // ---- Lógica de cambio de pestaña ----
    const fases = [
        { boton: antesBtn, contenedor: antes.contenedor },
        { boton: duranteBtn, contenedor: durante.contenedor },
        { boton: despuesBtn, contenedor: despues.contenedor },
    ];

    const mostrarFase = (faseSeleccionada) => {
        fases.forEach(({ boton, contenedor }) => {
            const esLaSeleccionada = contenedor === faseSeleccionada.contenedor;
            contenedor.classList.toggle('oculto', !esLaSeleccionada);
            boton.classList.toggle('activo', esLaSeleccionada);
        });
    };

    antesBtn.addEventListener('click', () => mostrarFase(fases[0]));
    duranteBtn.addEventListener('click', () => mostrarFase(fases[1]));
    despuesBtn.addEventListener('click', () => mostrarFase(fases[2]));

    antesBtn.classList.add('activo'); // Pestaña inicial

    // ---- Bloqueo si el plan ya fue aprobado/cerrado ----
    const familyPlan = await api.get(`familyPlans/${id}`);

    if (familyPlan.status_plan_id === 6 || familyPlan.status_plan_id === 7) {

        containerAccion.querySelectorAll('.gestionarAfecciones__afeccion').forEach((btn) => {
            btn.disabled = true;
        });

        containerAccion.querySelectorAll('.gestionarAfecciones__boton').forEach((btn) => {
            btn.classList.add('oculto');
        });

        form.querySelectorAll('.boton').forEach((btn) => {
            btn.classList.add('oculto');
        });

        form.querySelectorAll('.selector').forEach((select) => {
            select.disabled = true;
        });
    }
};

export default planAccionController;