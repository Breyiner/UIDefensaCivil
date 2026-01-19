import * as alerta from "./alertas";
import * as cookie from "./Cookies";

const url = "http://localhost:8000/api";
const urlStorage = "http://localhost:8000/storage/"

export const getExiste = async (endpoint) => {
  const respuesta = await fetch(url + endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  const datos = await respuesta.json();
  const info = datos.data;
  if (info.length > 0) return true;
  else return false;
}

export const postImagen = async (endpoint,objeto) =>
{
    const respuesta = await fetch(url + endpoint, {
    method: 'POST',
    body: objeto,
    credentials: 'include'
  });
  const datos = await respuesta.json();
  return datos;
}

export const getImagen= async (endpoint) => {
  const respuesta = await fetch(url + endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  const datos = await respuesta.json();
  const imagenNombre = datos.data[0].path;
  const imagen = urlStorage+imagenNombre;
  return imagen;
}

export const get = async (endpoint) => {
    try {
        let response = await fetch(`${urlBase}/${endpoint}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('access_token')}`
            },
        });

        if (response.status === 401) {
            await refreshToken();
            response = await fetch(`${urlBase}/${endpoint}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('access_token')}`
                },
            });

            if (response.status === 401) {
                cerrarTodos();
                error("Sesión expirada");
                window.location.href = '#/login';
                return null;
            }
        }

        return await response.json();
    } catch (error) {
        console.error('Error en GET:', error);
        return null;
    }
};

export const post = async (endpoint,datos) => {
    try {
        console.log(`Bearer ${cookie.obtener('access_token')}`);
        
        let response = await fetch(`${url}/${endpoint}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookie.obtener('access_token')}`
            },
            body: JSON.stringify(datos)
        });

        if (response.status === 401) {
            await refreshToken();
            response = await fetch(`${url}/${endpoint}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookie.obtener('access_token')}`
                },
                body: JSON.stringify(datos)
            });

            if (response.status === 401) {
                alerta.alertaError("Sesion Expirada");
                window.location.href = '#/login';
                return null;
            }
        }

        return await response.json();
    } catch (error) {
        console.error('Error en POST:', error);
        return null;
    }
};

export const put = async (datos, endpoint) => {
    try {
        let response = await fetch(`${urlBase}/${endpoint}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('access_token')}`
            },
            body: JSON.stringify(datos)
        });

        if (response.status === 401) {
            await refreshToken();
            response = await fetch(`${urlBase}/${endpoint}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('access_token')}`
                },
                body: JSON.stringify(datos)
            });

            if (response.status === 401) {
                
                cerrarTodos();
                error("Sesión expirada");
                window.location.href = '#/login';
                return null;
            }
        }

        return await response.json();
    } catch (error) {
        console.error('Error en PUT:', error);
        return null;
    }
};

export const patch = async (datos, endpoint) => {
    try {
        let response = await fetch(`${urlBase}/${endpoint}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('access_token')}`
            },
            body: JSON.stringify(datos)
        });

        if (response.status === 401) {
            await refreshToken();
            response = await fetch(`${urlBase}/${endpoint}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('access_token')}`
                },
                body: JSON.stringify(datos)
            });

            if (response.status === 401) {
                
                cerrarTodos();
                error("Sesión expirada");
                window.location.href = '#/login';
                return null;
            }
        }

        return await response.json();
    } catch (error) {
        console.error('Error en PATCH:', error);
        return null;
    }
};

export const delet = async (endpoint) => {
    try {
        let response = await fetch(`${urlBase}/${endpoint}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('access_token')}`
            }
        });

        if (response.status === 401) {
            await refreshToken();
            response = await fetch(`${urlBase}/${endpoint}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('access_token')}`
                }
            });

            if (response.status === 401) {
                
                cerrarTodos();
                error("Sesión expirada");
                window.location.href = '#/login';
                return null;
            }
        }

        return await response.json();
    } catch (error) {
        console.error('Error en DELETE:', error);
        return null;
    }
};

export const refreshToken = async () => {
    try {
        await fetch(`${url}/refresh-token`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookie.obtener('refresh_token')}`
            },
            body: JSON.stringify([])
        });
    } catch (error) {
        console.error('Error al refrescar token:', error);
    }
};