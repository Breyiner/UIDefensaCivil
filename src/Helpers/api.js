import * as alerta from "./alertas";
import * as cookie from "./Cookies";

const url = "http://localhost:8000/api";
const urlStorage = "http://localhost:8000/storage";

export const getExiste = async (endpoint) => {
  try {
    let response = await fetch(`${url}/${endpoint}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.obtener("access_token")}`,
      },
    });
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
        window.location.href = "#/login";
        localStorage.clear();
        return null;
      }
    }
    const obtenciones = await response.json();
    const info = obtenciones.data;
    if (info.length > 0) return true;
    else return false;
  } catch (error) {
    console.error("Error en GET:", error);
    return null;
  }
};

export const postImagen = async (endpoint, datos) => {
  try {
    let response = await fetch(`${url}/${endpoint}`, {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${cookie.obtener("access_token")}`,
      },
      body: datos,
    });

    if (response.status === 401) {
      await refreshToken();
      response = await fetch(`${url}/${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${cookie.obtener("access_token")}`,
        },
        body: datos,
      });

      if (response.status === 401) {
        alerta.alertaError("Sesion Expirada");
        window.location.href = "#/login";
        localStorage.clear();
        return null;
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Error en POST:", error);
    return null;
  }
};

export const getImagen = async (endpoint) => {
  try {
    let response = await fetch(`${url}/${endpoint}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.obtener("access_token")}`,
      },
    });

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
        window.location.href = "#/login";
        localStorage.clear();
        return null;
      }
    }
    const obtenciones = await response.json();
    const imagenNombre = obtenciones.data[0].path;
    const imagen = `${urlStorage}/${imagenNombre}`;
    return imagen;
  } catch (error) {
    console.error("Error en GET:", error);
    return null;
  }
};

export const get = async (endpoint) => {
  try {
    let response = await fetch(`${url}/${endpoint}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.obtener("access_token")}`,
      },
    });

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
        window.location.href = "#/login";
        localStorage.clear();
        return null;
      }
    }
    const obtenciones = await response.json();
    return obtenciones.data;
  } catch (error) {
    console.error("Error en GET:", error);
    return null;
  }
};

export const post = async (endpoint, datos) => {
  try {
    let response = await fetch(`${url}/${endpoint}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.obtener("access_token")}`,
      },
      body: JSON.stringify(datos),
    });

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
        window.location.href = "#/login";
        localStorage.clear();
        return null;
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Error en POST:", error);
    return null;
  }
};

export const put = async (endpoint,datos) => {
  try {
    let response = await fetch(`${url}/${endpoint}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.obtener("access_token")}`,
      },
      body: JSON.stringify(datos),
    });

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
        window.location.href = "#/login";
        localStorage.clear();
        return null;
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Error en PUT:", error);
    return null;
  }
};

export const patch = async (endpoint,datos) => {
  try {
    let response = await fetch(`${url}/${endpoint}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.obtener("access_token")}`,
      },
      body: JSON.stringify(datos),
    });

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
        window.location.href = "#/login";
        localStorage.clear();
        return null;
      }
    }
    
    if (response.status === 400)
    {
      let error = await response.json()
      alerta.alertaError(error.message);
      return null;
    }
    return await response.json();
    
  } catch (error) {
    console.error("Error en PATCH:", error);
    return null;
  }
};

export const delet = async (endpoint) => {
  try {
    let response = await fetch(`${url}/${endpoint}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.obtener("access_token")}`,
      },
    });

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
        window.location.href = "#/login";
        localStorage.clear();
        return null;
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Error en DELETE:", error);
    return null;
  }
};

export const getPaginacion = async (endpoint) => {
  try {
    let response = await fetch(`${url}/${endpoint}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.obtener("access_token")}`,
      },
    });

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
        window.location.href = "#/login";
        localStorage.clear();
        return null;
      }
    }
    const obtenciones = await response.json();
    return {data: obtenciones.data, paginate: obtenciones.paginate};
  } catch (error) {
    console.error("Error en GET:", error);
    return null;
  }
};

export const getPdf = async (endpoint, filename = "archivo.pdf") => {
  try {
    let response = await fetch(`${url}/${endpoint}`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${cookie.obtener("access_token")}`,
      },
    });

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

    // Convertir la respuesta en blob (PDF)
    const blob = await response.blob();

    // Crear URL temporal para descargar
    const urlBlob = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlBlob;
    a.download = filename; // nombre del PDF
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(urlBlob);

  } catch (error) {
    console.error("Error descargando PDF:", error);
    alerta.alertaError(error.message || error);
  }
};

export const refreshToken = async () => {
  try {
    await fetch(`${url}/refresh-token`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.obtener("refresh_token")}`,
      },
      body: JSON.stringify([]),
    });
  } catch (error) {
    console.error("Error al refrescar token:", error);
  }
};
