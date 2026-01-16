const url = "http://localhost:8000/api/";
const urlStorage = "http://localhost:8000/storage/"

export const postPublic = async (endpoint, objeto) => {
  const respuesta = await fetch(url + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(objeto),
    credentials: 'include'
  });
  const datos = await respuesta.json();
  return datos;
}

export const getPublic = async (endpoint) => {
  const respuesta = await fetch(url + endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  const datos = await respuesta.json();
  return datos.data;
}

export const putPublic = async (endpoint, objeto) => {
  const respuesta = await fetch(url + endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(objeto),
    credentials: 'include'
  });
  const datos = await respuesta.json();
  return datos;
}

export const patchPublic = async (endpoint, objeto) => {
  const respuesta = await fetch(url + endpoint, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(objeto),
    credentials: 'include'
  });
  const datos = await respuesta.json();
  return datos;
}

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

export const destroy = async (endpoint) => {
  const respuesta = await fetch(url + endpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    }
  })
  const datos = await respuesta.json();
  return datos.success;
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
