/**
 * Controlador: Home Supervisor (homeController.js)
 * Construye la página principal o Dashboard del perfil Supervisor.
 * Muestra métricas rápidas (Planes Recibidos, Aprobados, Rechazados, Tiempos) 
 * y provee navegación rápida a los sub-módulos clave.
 */
import { crearAside } from "../../../componentes/navegacion/aside";
import * as alerta from "../../../helpers/alertas";
import * as api from "../../../helpers/api";

export default async () => {
    // Petición al endpoint del dashboard para obtener un objeto de métricas generales consolidadas
    const dashBoard = await api.get('audits/dashBoardSupervisor');

    // Nodos de presentación de 'Hola X persona'
    const explicaciontitulo = document.querySelector(".explicacion__titulo");
    
    // Absorbe de localStorage (Sesión actual) el identity
    const nombre = localStorage.getItem("full_name");
    const genero = localStorage.getItem("gender_id");

    // elementos de cada item del aside
    const enlaces = [
        { icono: 'ri-gallery-view-2',      texto: 'Inicio',           info: null,         perfil: false, href: '#/supervisor' },
        { icono: 'ri-file-user-line',      texto: 'Planes Familiares',info: null,         perfil: false, href: '#/supervisor/plan_familiar' },
        { icono: 'ri-group-line',          texto: 'Voluntarios',      info: null,         perfil: false, href: '#/supervisor/usuarios/gestion' },
        { icono: 'ri-bar-chart-2-line',    texto: 'Estadisticas',     info: null,         perfil: false, href: '#/supervisor/plan_familiar/estadistica' },
        { icono: 'ri-arrow-left-right-line',texto: 'Peticiones',      info: null,         perfil: false, href: '#/supervisor/usuarios/peticiones' },
        { icono: 'ri-user-line',           texto: 'Nombre',           info: 'Supervisor', perfil: true , href: '#/usuarios/perfil' },
    ];

    // renderizar componente de aside
    const aside = crearAside(enlaces);
    const app = document.querySelector("#app"); 
    app.prepend(aside)


    // Lógica boba inclusiva para el saludo ('Bienvenido' vs 'Bienvenida') según catálogos previos (1=Masc, 2=Fem)
    if (genero == 2) {
        explicaciontitulo.innerHTML += "a " + nombre; // Resulta en: ...Bienvenida Fulanita
    } else {
        explicaciontitulo.innerHTML += " " + nombre; // Resulta: ...Bienvenido Menganito
    }

    // Nodos contadores crudos (Tarjetas resumen)
    const planesRecibidos = document.getElementById('planesRecibidos');
    const planesAprobados = document.getElementById('planesAprobados');
    const planesRechazados = document.getElementById('planesRechazados');
    const planesEnRevision = document.getElementById('planesEnRevision');
    /* const tiempoAproximado = document.getElementById('tiempoAproximado'); */

    // Accesos directos / Botonera secundaria
    const botonVoluntarios = document.getElementById("voluntarios");
    const botonPeticiones = document.getElementById("peticiones");
    const botonPlanFamiliar = document.getElementById("planFamiliar");
    const botonEstadistica = document.getElementById("estadisticas");


    // Llenado estático de los contadores con las claves recuperadas del objeto 'dashboard' json
    planesRecibidos.textContent = dashBoard.pending_plans;
    planesAprobados.textContent = dashBoard.approved_plans;
    planesRechazados.textContent = dashBoard.rejected_plans;
 /*    
    // Algoritmo de formateo simple para presentar el Promedio de Tiempo en forma legible (Mins o Horas)
    const tiempo = dashBoard.time_validation;
    let tiempoValidado;
    
    // Si sobrepasa la métrica en Minutos (Ej: 90) -> Lo reduce a factor Horas ej: 1h
    // TODO: Bug potencial - solo extrae horas pisando minutos. (Ej 90 -> 1h, perdiendo los 30 min)
    if (tiempo > 60)
    {
        tiempoValidado = Math.floor(tiempo / 60);
        tiempoValidado += "h" 
    }
    // Presentación en minutos puros si es lapso corto
    else tiempoValidado = tiempo + "m"
    
    // Aplica el string formateado final
    tiempoAproximado.textContent = tiempoValidado */

    // Declaración de enrutamientos de la botonera principal Dashboard
    botonVoluntarios.addEventListener("click", () => {
        window.location.href = `#/supervisor/usuarios/gestion/`; // Vista Gestor Users
    });
    botonPeticiones.addEventListener("click", () => {
        window.location.href = `#/supervisor/usuarios/peticiones`; // Vista Peticiones/Requests List
    });
    botonPlanFamiliar.addEventListener("click", () => {
        window.location.href = `#/supervisor/plan_familiar/`; // Vista Planes List Main
    });
    botonEstadistica.addEventListener("click", () => {
        window.location.href = `#/supervisor/plan_familiar/estadistica`; // La Dona Chart page
    });
};
