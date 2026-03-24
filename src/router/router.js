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


export const router = async (main) => {
  // Encontrar la ruta desde el hash (#)
  const hash = location.hash.slice(1);
  let arregloHash = hash.split("/");
  let residuo = arregloHash.pop();
  // Separar la ruta URL de los queryParams
  arregloHash = [ ...arregloHash, ...residuo.split("?")];

  // recorrer todas las rutas
  const [ruta, parametros] = recorrerRutas(routes, arregloHash);

  console.log(ruta)

  // si la ruta no es encontrada:

  if (!ruta) {
    main.innerHTML = `<h2>Ruta no encontrada</h2>`;
    return;
  }
}

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
            // Si es una ruta con sub-rutas (contenedor)
            if (typeof routes[key] === "object" && !routes[key].path && !routes[key].controller) {
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



