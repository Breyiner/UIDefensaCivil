/**
 * Módulo de API (api.js)
 * Archivo central que gestiona todas las peticiones HTTP (GET, POST, PUT, DELETE, etc.) 
 * hacia el backend. Incluye la lógica global de inyección de Tokens de Autenticación 
 * y la recarga automática del token (Refresh Token) si la sesión ha expirado (Error 401).
 */

import * as alerta from "./alertas";
import * as cookie from "./cookies";
import * as spinner from "./spinner"

// const url = import.meta.env.VITE_API_URL;

// // URL base donde se alojan los archivos estáticos en el backend (imágenes, documentos, etc.)
// export const urlStorage = import.meta.env.VITE_STORAGE_URL;

const HOST = window.location.hostname;
const esLocal = HOST === "localhost" || HOST === "127.0.0.1" || /^(192\.168|10\.|172\.(1[6-9]|2[0-9]|3[0-1]))/.test(HOST);

const url = esLocal 
  ? (import.meta.env.VITE_API_URL?.replace("localhost", HOST) ?? `http://${HOST}:8000/api`)
  : import.meta.env.VITE_API_URL;

export const urlStorage = esLocal 
  ? (import.meta.env.VITE_STORAGE_URL?.replace("localhost", HOST) ?? `http://${HOST}:8000/storage`)
  : import.meta.env.VITE_STORAGE_URL;

// ==========================================
// FUNCIONES DE PETICIÓN (HTTP FETCH)
// ==========================================

/**
 * GET (Boleano): Hace una petición para confirmar si existe o no un registro.
 * Retorna true si el arreglo "data" tiene elementos, de lo contrario false.
 */
export const getExiste = async (endpoint) => {
  try {
    spinner.abrirSpinner();
    // 1. Ejecuta la petición GET estándar con el token actual
    let response = await fetch(`${url}/${endpoint}`, {
      method: "GET",
      credentials: "include", // Permite envío de cookies entre dominios si aplica
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${cookie.obtener("access_token")}`,
      },
    });
    
    // 2. Si el backend responde 401 (No Autorizado / Token Vencido)
    if (response.status === 401) {
      // 3. Intenta pedir un nuevo token usando el "refresh_token"
      await refreshToken();
      // 4. Repite la petición original pero con el token recién renovado en la cookie
      response = await fetch(`${url}/${endpoint}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${cookie.obtener("access_token")}`,
        },
      });

      // 5. Si de nuevo falla con 401, significa que la sesión caducó por completo
      if (response.status === 401) {
        alerta.alertaError("Sesion Expirada");
        window.location.href = "#/"; // Expulsa al login
        localStorage.clear(); // Limpia datos locales de sesión
        return null;
      }
    }
    
    // Procesa el cuerpo de la respuesta exitosa
    const obtenciones = await response.json();
    const info = obtenciones.data;
    // Evalúa si vino relleno o vacío

    if (info.length > 0) return true;
    else return false;
  } catch (error) {
    console.error("Error en GET:", error);
    return null;
  }
};

/**
 * POST (Archivos): Especial para enviar FormData (archivos multimedia o documentos).
 * NO lleva el header "Content-Type" porque el navegador lo asigna automáticamente al detectar FormData.
 */
export const postImagen = async (endpoint, datos) => {
  try {
    spinner.abrirSpinner();
    let response = await fetch(`${url}/${endpoint}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Accept": "application/json",
        Authorization: `Bearer ${cookie.obtener("access_token")}`,
      },
      body: datos, // Payload en formato bruto o FormData
    });

    // --- Mecanismo de Refresh Token ---
    if (response.status === 401) {
      await refreshToken();
      response = await fetch(`${url}/${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Accept": "application/json",
          Authorization: `Bearer ${cookie.obtener("access_token")}`,
        },
        body: datos,
      });

      if (response.status === 401) {
        alerta.alertaError("Sesion Expirada");
        window.location.href = "#/";
        localStorage.clear();
        return null;
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Error en POST:", error);
    return null;
  } finally {
    spinner.cerrarSpinner();
  }
};

/**
 * GET (Imagen URL): Obtiene la ruta física o nombre de archivo en el servidor 
 * y concatena la variable 'urlStorage' para retornar el link listo para usar en un <img src="">
 */
export const getImagen = async (endpoint) => {
  try {
    spinner.abrirSpinner();
    let response = await fetch(`${url}/${endpoint}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${cookie.obtener("access_token")}`,
      },
    });

    // --- Mecanismo de Refresh Token ---
    if (response.status === 401) {
      await refreshToken();
      response = await fetch(`${url}/${endpoint}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie.obtener("access_token")}`,
        },
      });

      if (response.status === 401) {
        alerta.alertaError("Sesion Expirada");
        window.location.href = "#/";
        localStorage.clear();
        return null;
      }
    }
    
    // Extrae la respuesta del JSon
    const obtenciones = await response.json();
    const imagenNombre = obtenciones.data[0].path; // Toma de asunción que la API retorna base en la prop path
    const imagen = `${urlStorage}/${imagenNombre}`; // Arma la url completa de la foto

    return imagen;
  } catch (error) {
    console.error("Error en GET:", error);
    return null;
  } finally {
    spinner.cerrarSpinner();
  }
};

/**
 * GET (Genérico): Trae una lista o un solo objeto de información desde la base de datos.
 * Retorna siempre la llave reservada "data" definida por la convención de la API.
 */
export const get = async (endpoint) => {
  try {
    spinner.abrirSpinner();
    let response = await fetch(`${url}/${endpoint}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${cookie.obtener("access_token")}`,
      },
    });

    // --- Mecanismo de Refresh Token ---
    if (response.status === 401) {
      await refreshToken();
      response = await fetch(`${url}/${endpoint}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie.obtener("access_token")}`,
        },
      });

      if (response.status === 401) {
        alerta.alertaError("Sesion Expirada");
        window.location.href = "#/";
        localStorage.clear();
        return null;
      }
    }
    
    const obtenciones = await response.json();

    return obtenciones.data; // Devuelve solo el payload interno 
  } catch (error) {
    console.error("Error en GET:", error);
    return null;
  } finally {
    spinner.cerrarSpinner()
  }
};

/**
 * POST (JSON genérico): Crea un nuevo registro en la base de datos.
 * Serializa los datos al estándar "JSON.stringify" para enviarlos por el body.
 */
export const post = async (endpoint, datos) => {
  try {
    spinner.abrirSpinner();
    let response = await fetch(`${url}/${endpoint}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${cookie.obtener("access_token")}`,
      },
      body: JSON.stringify(datos), // Transformación de Obj Javascript a Texto JSON
    });

    // --- Mecanismo de Refresh Token ---
    if (response.status === 401) {
      await refreshToken();
      response = await fetch(`${url}/${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie.obtener("access_token")}`,
        },
        body: JSON.stringify(datos),
      });

      if (response.status === 401) {
        alerta.alertaError("Sesion Expirada");
        window.location.href = "#/";
        localStorage.clear();
        return null;
      }
    }

  
    return await response.json();
  } catch (error) {
    console.error("Error en POST:", error);
    return null;
  } finally {
    spinner.cerrarSpinner();
  }
};

/**
 * PUT (Actualización Compleja): Actualiza/Sobrescribe los datos de un recurso ya existente.
 */
export const put = async (endpoint, datos) => {
  try {
    spinner.abrirSpinner();
    let response = await fetch(`${url}/${endpoint}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${cookie.obtener("access_token")}`,
      },
      body: JSON.stringify(datos),
    });

    // --- Mecanismo de Refresh Token ---
    if (response.status === 401) {
      await refreshToken();
      response = await fetch(`${url}/${endpoint}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie.obtener("access_token")}`,
        },
        body: JSON.stringify(datos),
      });

      if (response.status === 401) {
        alerta.alertaError("Sesion Expirada");
        window.location.href = "#/";
        localStorage.clear();
        return null;
      }
    }

  
    return await response.json();
  } catch (error) {
    console.error("Error en PUT:", error);
    return null;
  } finally {
    spinner.cerrarSpinner()
  }
};

/**
 * PATCH (Actualización Parcial): Actualiza de forma atómica uno o varios 
 * datos sin tocar el resto (ej. Solo subir el estado o el nombre de alguien).
 */
export const patch = async (endpoint, datos) => {
  try {
    spinner.abrirSpinner()
    let response = await fetch(`${url}/${endpoint}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${cookie.obtener("access_token")}`,
      },
      body: JSON.stringify(datos),
    });

    // --- Mecanismo de Refresh Token ---
    if (response.status === 401) {
      await refreshToken();
      response = await fetch(`${url}/${endpoint}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie.obtener("access_token")}`,
        },
        body: JSON.stringify(datos),
      });

      if (response.status === 401) {
        alerta.alertaError("Sesion Expirada");
        window.location.href = "#/";
        localStorage.clear();
        return null;
      }
    }

    // A diferencia de los demás métodos, comprueba estado "400" (Bad Request)
    if (response.status === 400) {
      let error = await response.json() // Extraiga lo que falló en validación API
      alerta.alertaError(error.message); // Dispara toast error con el motivo
      return null;
    }


    return await response.json();

  } catch (error) {
    console.error("Error en PATCH:", error);
    return null;
  } finally {
    spinner.cerrarSpinner()
  }
};

/**
 * DELETE (Borrar registro): Solicita a la API eliminar físicamente / de forma lógica el elemento especificado.
 * No requiere Body, el identificador va implícito en la URL del endpoint.
 */
export const delet = async (endpoint) => {
  try {
    spinner.abrirSpinner();
    let response = await fetch(`${url}/${endpoint}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${cookie.obtener("access_token")}`,
      },
    });

    // --- Mecanismo de Refresh Token ---
    if (response.status === 401) {
      await refreshToken();
      response = await fetch(`${url}/${endpoint}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie.obtener("access_token")}`,
        },
      });

      if (response.status === 401) {
        alerta.alertaError("Sesion Expirada");
        window.location.href = "#/";
        localStorage.clear();
        return null;
      }
    }


    return await response.json();
  } catch (error) {
    console.error("Error en DELETE:", error);
    return null;
  } finally {
    spinner.cerrarSpinner()
  }
};

export const bulkPost = async (endpoint, datos) => {
  try {
    spinner.abrirSpinner();

    const opciones = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${cookie.obtener("access_token")}`,
      },
      body: JSON.stringify(datos), // Obligatorio para este método
    };

    let response = await fetch(`${url}/${endpoint}`, opciones);

    // --- Mecanismo de Refresh Token ---
    if (response.status === 401) {
      await refreshToken();

      opciones.headers.Authorization = `Bearer ${cookie.obtener("access_token")}`;
      response = await fetch(`${url}/${endpoint}`, opciones);

      if (response.status === 401) {
        
        alerta.alertaError("Sesion Expirada");
        window.location.href = "#/";
        localStorage.clear();
        return null;
      }
    }

    return await response.json();

  } catch (error) {

    console.error("Error en BULK POST:", error);
    return null;

  } finally {
    spinner.cerrarSpinner();
  }
};

/***
 * DELETE_BULK (se borra de forma masiva)
 */

export const bulkDelete = async (endpoint, datos) => {
  try {
    spinner.abrirSpinner();

    const opciones = {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${cookie.obtener("access_token")}`,
      },
      body: JSON.stringify(datos), // Obligatorio para este método
    };

    let response = await fetch(`${url}/${endpoint}`, opciones);

    // --- Mecanismo de Refresh Token ---
    if (response.status === 401) {
      await refreshToken();

      opciones.headers.Authorization = `Bearer ${cookie.obtener("access_token")}`;
      response = await fetch(`${url}/${endpoint}`, opciones);

      if (response.status === 401) {
        
        alerta.alertaError("Sesion Expirada");
        window.location.href = "#/";
        localStorage.clear();
        return null;
      }
    }

    return await response.json();

  } catch (error) {

    console.error("Error en BULK DELETE:", error);
    return null;

  } finally {
    spinner.cerrarSpinner();
  }
};

/**
 * GET (Paginación estructurada): Especial para tablas y listas muy largas.
 * Espera que la API mande no solo "data", sino también los metadatos numéricos 
 * de la paginación (Página actual, total registros, links predeterminados).
 */
export const getPaginacion = async (endpoint) => {
  try {

    spinner.abrirSpinner()    

    let response = await fetch(`${url}/${endpoint}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${cookie.obtener("access_token")}`,
      },
    });
    

    // --- Mecanismo de Refresh Token ---
    if (response.status === 401) {

      await refreshToken();
      response = await fetch(`${url}/${endpoint}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie.obtener("access_token")}`,
        },
      });

      
      if (response.status === 401) {
        alerta.alertaError("Sesion Expirada");
        window.location.href = "#/";
        localStorage.clear();
        spinner.cerrarSpinner()
        return null;
      }
    }
    
    // Procesa el Request Json
    const obtenciones = await response.json();

    return { data: obtenciones.data, paginate: obtenciones.paginate };
  } catch (error) {
    console.error("Error en GET:", error);
    return null;
  } finally {
    spinner.cerrarSpinner()
  }
};

/**
 * GET (Descarga de Reportes/PDF): Petición híbrida que descarga un Buffer biario (Blob)
 * para forzar la ventana automática tipo "Descargar y Guardar Como" en el navegador de los reportes.
 */
export const getPdf = async (endpoint, filename = "archivo.pdf") => {
  try {
    spinner.abrirSpinner();
    let response = await fetch(`${url}/${endpoint}`, {
      method: "GET",
      credentials: "include",
      // Ojo: No se especifica tipo JSON en Content-Type aquí para prevenir corromper el binario PDF
      headers: {
        Authorization: `Bearer ${cookie.obtener("access_token")}`,
      },
    });

    // --- Mecanismo de Refresh Token ---
    if (response.status === 401) {
      await refreshToken();
      response = await fetch(`${url}/${endpoint}`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${cookie.obtener("access_token")}`,
        },
      });

      if (response.status === 401) {
        alerta.alertaError("Sesión expirada");
        window.location.href = "#/";
        localStorage.clear();
        return null;
      }
    }

    // Convierte en bruto la respuesta en un dato binario tipo (PDF / blob)
    const blob = await response.blob();

    // Crear URL en memoria Cache temporal del navegador compatible para descargas
    const urlBlob = window.URL.createObjectURL(blob);
    const a = document.createElement("a"); // Crea tag <a href> invisible
    a.href = urlBlob; // Lo ata al binario en caché
    a.download = filename; // Pone nombre del archivo al forzar evento guardar as
    document.body.appendChild(a); 
    a.click(); // Autoclick automático para lanzar el modal de descargas en Chrome/Firefox
    a.remove(); // Borra la meta etiqueta basura después de usada
    window.URL.revokeObjectURL(urlBlob); // Libera RAM cachada de la PC usada para el Blob

  } catch (error) {
    console.error("Error descargando PDF:", error);
    alerta.alertaError(error.message || error);
  } finally {
    spinner.cerrarSpinner()
  }
};

/**
 * GET (PDF Blob): Realiza una petición GET autenticada para descargar y retornar
 * el contenido binario (Blob) de un reporte o PDF sin forzar la descarga en el equipo.
 * Se encarga de instanciar un Blob con tipo de contenido explícito 'application/pdf'.
 */
export const getPdfBlob = async (endpoint) => {
  try {
    spinner.abrirSpinner();
    let response = await fetch(`${url}/${endpoint}`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${cookie.obtener("access_token")}`,
      },
    });

    // --- Mecanismo de Refresh Token ---
    if (response.status === 401) {
      await refreshToken();
      response = await fetch(`${url}/${endpoint}`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${cookie.obtener("access_token")}`,
        },
      });

      if (response.status === 401) {
        alerta.alertaError("Sesión expirada");
        window.location.href = "#/login";
        localStorage.clear();
        return null;
      }
    }

    if (!response.ok) return null;

    // Se extraen los bytes en bruto para sanitizar las cabeceras de Content-Disposition
    const arrayBuffer = await response.arrayBuffer();
    // Se retorna un Blob explícito para habilitar la visualización en iframe
    return new Blob([arrayBuffer], { type: "application/pdf" });

  } catch (error) {
    console.error("Error al obtener PDF Blob:", error);
    return null;
  } finally {
    spinner.cerrarSpinner();
  }
};

/**
 * REFRESH TOKEN (Renovación Silenciosa): Función pilar que contacta al endpoint seguro de "/refresh-token"

 * enviando el token secundario. Su propósito es interceptar caídas 401, conseguir un nuevo token (access_token) válido,
 * incrustarlo en las cookies, y dejarle continuar normalmente su petición a las funciones principales invisíblemente.
 */
export const refreshToken = async () => {
  try {
    // Llama en POST silenciosamente pidiendo validación de su refresh tag
    await fetch(`${url}/refresh-token`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        // Envía explícitamente el refresh_token guardado apartemente
        Authorization: `Bearer ${cookie.obtener("refresh_token")}`,
      },
      body: JSON.stringify([]),
    });
    // Nota: Se infiere que el Backend actualiza la cache / cookies directamente desde el header de respuesta
  } catch (error) {
    console.error("Error al refrescar token:", error);
  }
};
