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

// Función principal de enrutamiento que inyecta el contenido en un nodo/elemento
export const router = async (elemento) => {
  // Extrae el hash actual descartando los dos primeros caracteres ("#/" quedando solo la ruta)
  const hash = location.hash.slice(2);
  // Separa la ruta en segmentos basándose en las diagonales "/" ignorando vacíos
  let arregloHash = hash.split("/")

  const segmentos = hash.split("/").filter((seg) => seg);

  // Si no hay segmentos (URL vacía o raíz directa), redirecciona a iniciar sesión
  if (segmentos.length === 0) {
    redirigirARuta("login");
    return;
  }

  // Busca los datos de la ruta en la configuración a partir de los segmentos url
  const resultadoRuta = recorrerRutas( routes,arregloHash, true );

  // Si no se logra encontrar la ruta solicitada en la lista de definidas
  if (!resultadoRuta) {
    console.warn("Ruta inválida:", hash); // Muestra advertencia en consola
    // Dibuja en pantalla diseño por defecto de "ruta no encontrada"
    elemento.innerHTML = `
    <div class="rutaInvalida noHeader">
    <h2>Ruta no encontrada <i class="ri-code-box-fill"></i>
    </h2>`;
    return;
  }

  // Extrae en nuevas constantes el objeto de ruta y sus parámetros 
  const [ruta, parametros] = resultadoRuta;

  // Valida seguridad: si la ruta requiere estar autenticado (.private === true)
  if (ruta.private) {
    // Si la ruta es privada pero el navegador no tiene sesión ("permissions") guardados
    if (ruta.private && !localStorage.getItem("permissions")) {
      redirigirARuta("login"); // Obliga devolverlo al logueo
      return;resultadoRuta
    // Sino, si tiene sesión, pero no posee el rol necesario para cargar esta ruta en especial
    } else if (!puede(ruta) && ruta.private) {
      window.history.back(); // Anula el cambio de página empujándolo a la anterior
      // Pausa e imprime alerta informando falta de autorización
      await alerta.alertaMensaje(
        "No esta autorizado a ingresar a esta ruta...",
      );
      return;
    }
  }

  // Solicitud AJAX que obtiene e inyecta el HTML de la ruta en el contenedor deseado (elemento)
  await cargarVista(ruta.path, elemento);
  // Invoca el controlador JS atado a esa vista, y le atraviesa los extractos de parámetros query
  await ruta.controlador(parametros);
};

// Utilidad que manipula el navegador para saltar a otra URL
const redirigirARuta = (ruta) => {
  location.hash = `#/${ruta}`; // Sobrescribe el actual hash empujando uno nuevo
};


// Transforma una cadena de texto llaves y querys ("id=1&nom=ana") a un clásico Json para interactuar
const extraerParametros = (parametros) => {
  const pares = parametros.split("&"); // Parte las combinaciones clave-valor donde halle el operador AND (&)
  const params = {}; // Inicia un objeto molde contenedor
  // Itera cada par llave-valor 
  pares.forEach((par) => {
    const [clave, valor] = par.split("="); // Extrae y asigna respectivamente cada sub-par partido por el igual (=)
    params[clave] = valor; // Inyecta el par como propiedad con su objeto valor
  });
  return params; // Retorna el Json armado
};

// Hace "fetch" al diseño de HTML puro mapeado a la vista, e inyecta su "inner" al elemento principal
const cargarVista = async (path, elemento) => {
  try {
    const response = await fetch(`./src/views/${path}`); // Request estático al archivo HTML definido en su rama
    if (!response.ok) throw new Error("Vista no encontrada"); // Verifica que el protocolo no dé error (ej. falsee por 404 local)

    const contenido = await response.text(); // Convierte cuerpo binario / buffer de la petición en String puro textual
    elemento.innerHTML = contenido; // Agrega el String DOM extraído dentro de su wrapper principal
  } catch (error) {
    console.error(error);
    // Si la lectura en disco por fetch dio fallo o timeout muestra un mensaje base de vista rota
    elemento.innerHTML = `<h2>Error al cargar la vista</h2>`;
  }
};

// Rutina que discrimina matemáticamente si un objeto JSON posee rutas de hijos o se topó con un atributo ciego (nodo puro obj)
const esGrupoRutas = (obj) => {
  for (let key in obj) {
    if (typeof obj[key] !== "object" || obj[key] === null) {
      return false; // Retorna invalido si dio con valores sueltos puros (functions, primitivos string o nulos)
    }
  }
  return true; // En caso contra valida que todos en esa rama resultaron objetos (vías / links)   
};

// Rutina de validaciones de privilegios
const puede = (ruta) => {
  // Parsea de manera de array una "cookie/" de storage permisos que esté por ej: "1,2,54"   
  const permisos = localStorage.getItem("permissions").split(",");
  // Checkea si en esa lista el ID o claim requerido de acceso (".can") de la vista actual existe y lo posee el user   
  const existe = permisos.includes(ruta.can);
  return existe; // True si pasa seguridad o False si rebota
};

const recorrerRutas = (routes, arregloHash, esLlamadaRecursiva) => {
  let parametros = {}

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