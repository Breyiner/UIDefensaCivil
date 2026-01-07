const url = "http://localhost:8000/api/";

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