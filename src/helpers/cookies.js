/**
 * Helper de Cookies (cookies.js)
 * Provee funciones para leer y comprobar la existencia de cookies almacenadas en el navegador,
 * utilizado principalmente para extraer los tokens JWT.
 */

// Extrae el valor de una cookie específica buscando por su nombre ("name")
export const obtener = (name) => {
  // Obtiene el string completo con todas las cookies ("key=value; key2=value2")
  let stringCookies = document.cookie;

  // Las divide en un arreglo usando el separador estándar "; "
  let arrayCookies = stringCookies.split("; ");

  let cookie = null;

  // Busca dentro de cada elemento cuál coincide con el parámetro name solicitado
  arrayCookies.forEach((elemento) => {
    let [key, value] = elemento.split("="); // Divide la clave del valor ("name"="john")

    if (key == name) cookie = value; // Si la llave es la buscada, guarda su valor
  });

  // Retorna el valor decodificando caracteres especiales de URL (ej: %20 a espacios)
  return decodeURIComponent(cookie);
};

// Comprueba si el navegador tiene alguna cookie guardada en general
export const existe = () => {
  const cookie = document.cookie;
  if (!cookie) {
    return false; // Retorna falso si el string está vacío
  }
  return true; // Retorna verdadero si detectó al menos una cookie
};
