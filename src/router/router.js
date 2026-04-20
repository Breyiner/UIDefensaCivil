/**
 * Módulo de Enrutamiento principal (router.js)
 * Controlador estilo SPA (Single Page Application) basado en el "hash" de la URL.
 * Se encarga de procesar la URL, validar el acceso del usuario, y cargar dinámicamente
 * el HTML de las vistas ("views") junto con la ejecución de sus controladores JS.
 */

// Importa el árbol de rutas configuradas para toda la aplicación
import { routes } from "./routers";
// Importa utilidades gráficas para el display de alertas en pantalla
import * as alerta from "../helpers/alertas";
import { isAuth, isAuthorize } from "../helpers/auth";

import * as api from "../helpers/api";

export const router = async (main) => {
    // Encontrar la ruta desde el hash (#)
    const hash = location.hash.slice(1);
    let arregloHash = hash.split("/");
    let residuo = arregloHash.pop();
    // Separar la ruta URL de los queryParams
    arregloHash = [...arregloHash, ...residuo.split("?")];

    // recorrer todas las rutas
    const [ruta, parametros] = recorrerRutas(routes, arregloHash);

    // si la ruta no es encontrada:

    if (!ruta) {
        volverHome(hash);
        alerta.alertaMensaje(`Error 404: Página no encontrada. Serás redirigido a tu página de inicio.`)
        return;
    }

    //deestructurar la configuracion (objeto config)
    const { private: esPrivada, layout: tieneLayout, permissions } = ruta.config;

    if (esPrivada && !isAuth()) {
        console.log("Error")
    }

    // verificar que el usuario tenga permisos especificos
    if (!tienePermisos(permissions)) {
        limpiarLayout(main);
        app.innerHTML = `<h2>No tienes permisos para acceder a esta sección</h2>`;
        return;
    }

    validarRol(hash);

    ocultarEditarUrl(hash);


    if (ruta.path) {
        await cargarVista(ruta.path, main);
    }

    await ruta.controlador(parametros);

}

// funcion encargada de limpiar toda la vista
const limpiarLayout = (main) => {
    main.innerHTML = "";
}

const ocultarEditarUrl = async (hash) => {

    const esSupervisor = hash.includes("supervisor/");
    const esVoluntario = hash.includes("voluntario/");
    const segmentos = hash.split("/");
    const tieneEditar = segmentos.some(segmento => segmento.split("?")[0] === 'editar');
    const estaEnPlan = hash.includes("plan_familiar/");

    if (estaEnPlan && tieneEditar) {

        const queryString = hash.split("?")[1] || "";

        const params = new URLSearchParams(queryString);

        const familia_id = params.get("familia_id");

        if (familia_id) {
            const plan = await api.get(`familyPlans/${familia_id}`);

            if (plan.status_plan_id === 6 || plan.status_plan_id === 7) {

                if (esSupervisor) {

                    window.location.hash = "#/supervisor/plan_familiar";
                    alerta.alertaMensaje(`Este plan familiar ya fue aprobado o rechazado definitivamente y no se puede editar, te redirigiremos al listado de planes familiares`);
                    return;

                } else if (esVoluntario) {

                    window.location.hash = "#/voluntario/plan_familiar";
                    alerta.alertaMensaje(`Este plan familiar ya fue aprobado o rechazado definitivamente y no se puede editar, te redirigiremos al listado de planes familiares`);
                    return;
                }
            }
        }
    };
}

const volverHome = async (hash) => {
    const roleId = parseInt(localStorage.getItem('role_id'));

    const homes = {
        1: "#/administrador",
        2: "#/supervisor",
        3: "#/voluntario"
    };

    if (homes[roleId]) window.location.hash = homes[roleId];
};

const validarRol = async (hash) => {

    const roleId = parseInt(localStorage.getItem('role_id'));

    const homes = {
        1: "#/administrador",
        2: "#/supervisor",
        3: "#/voluntario"
    };

    const rolEnURL = [
        { segmento: "voluntario", roleId: 3 },
        { segmento: "supervisor", roleId: 2 },
        { segmento: "administrador", roleId: 1 },
    ];

    const rolEncontrado = rolEnURL.find (rol=>{
        return hash.includes(rol.segmento);
    });

    if (rolEncontrado && rolEncontrado.roleId !== roleId) {

        window.location.hash = homes[roleId];
        alerta.alertaMensaje(`Esta página no está disponible para tu perfil. Te redirigimos a tu página de inicio.`)
        return false;
    }

    return true;
};

// funcion encargada de cargar una vista. params: la ruta de la vista y el elemento HTML donde se inyecta el contenido de la vista
const cargarVista = async (path, elemento) => {
    console.log(path, elemento);
    const seccion = await fetch(`./src/views/${path}`);
    if (!seccion.ok) throw new Error("No pudimos leer el archivo");
    const html = await seccion.text();
    elemento.innerHTML = html;
};

// función encargada de verificar si el usuario tiene uno o varios permisos.
const tienePermisos = (permisosRequeridos) => {
    if (!permisosRequeridos || permisosRequeridos.length === 0) {
        return true; // Ruta pública
    }

    // Si es un solo permiso, verificarlo directamente
    if (permisosRequeridos.length === 1) {
        return isAuthorize(permisosRequeridos[0]);
    }

    // Si son múltiples permisos, verificar que tenga todos
    return permisosRequeridos.every(permiso => isAuthorize(permiso));
};

// funcion encargada de recorrer todas las rutas y verificar si hay una coincidencia con la actual
const recorrerRutas = (routes, arregloHash, esLlamadaRecursiva = false) => {
    let parametros = {};

    // Procesar parámetros solo en la primera llamada
    if (!esLlamadaRecursiva && arregloHash.length > 0) {
        const ultimoElemento = arregloHash[arregloHash.length - 1];

        // Verificar si el último elemento contiene parámetros (tiene =)
        if (ultimoElemento && ultimoElemento.includes("=")) {
            let parametrosSeparados = ultimoElemento.split("&");

            parametrosSeparados.forEach((parametro) => {
                let claveValor = parametro.split("=");
                parametros[claveValor[0]] = claveValor[1];
            });

            console.log("Parámetros procesados:", parametros);
            arregloHash = [...arregloHash]; // Crear copia para no mutar el original
            arregloHash.pop(); // Remover los parámetros del array
            console.log("Array después de quitar parámetros:", arregloHash);
        }
    }

    // Ruta raíz vacía (#/ o #)
    if ((arregloHash.length == 1 && arregloHash[0] == "") ||
        (arregloHash.length == 2 && arregloHash[0] == "" && arregloHash[1] == "") ||
        arregloHash.length == 0) {
        return [routes[""], parametros];
    }

    // Obtener la ruta real (ignorando el primer elemento vacío si existe)
    const rutaActual = arregloHash[0] === "" ? arregloHash[1] : arregloHash[0];
    const resto = arregloHash[0] === "" ? arregloHash.slice(2) : arregloHash.slice(1);

    console.log("Buscando ruta:", rutaActual, "resto:", resto);

    // Buscar ruta
    for (const key in routes) {
        if (key == rutaActual) {
            console.log("Encontré la clave:", key, "tipo:", typeof routes[key]);
            console.log(routes[key])
            // Si es una ruta con sub-rutas (contenedor)
            if (typeof routes[key] === "object" && !routes[key].path && !routes[key].controlador) {
                console.log("Es un contenedor, llamando recursivamente");
                // Llamada recursiva con el resto de segmentos
                const [rutaRecursiva, parametrosRecursivos] = recorrerRutas(routes[key], resto, true);
                // Combinar parámetros de ambas llamadas
                return [rutaRecursiva, { ...parametros, ...parametrosRecursivos }];
            }
            // Ruta final encontrada
            console.log("Ruta final encontrada");
            return [routes[key], parametros];
        }
    }
    console.log("No se encontró la ruta");
    return [null, parametros];
};



