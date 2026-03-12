/**
 * Helper de LocalStorage y Sesión (localStorage.js)
 * Contiene funciones para respaldar variables temporalmente en el caché local del navegador,
 * restaurarlas a inputs del DOM, y eliminar los historiales/cookies en cierres de sesión.
 */

// Guarda un arreglo de objetos (ej. de un Formulario) en la variable local "identificacion"
export const envioLocalStorage = (arrayDatos) => {
  const local = []; // Arreglo vacío a poblar
  
  // Itera cada input / dato del arreglo original
  arrayDatos.forEach((datos) => {
    let storage = {};
    if (datos.value) { // Solo guarda si el input tiene algún valor escrito
      storage.nombre = datos.name; // Atributo 'name' del input
      storage.valor = datos.value; // Contenido ingresado por el usuario
      local.push(storage);
    }
  });
  
  // Convierte el arreglo final a string y lo graba en el LocalStorage
  localStorage.setItem("identificacion", JSON.stringify(local));
};

// Lee la variable local guardada, la parsea y rellena automáticamente los inputs del DOM
export const importacionLocalStorage = (nombreLocal) => {
  // Chequea si existe una clave previamente guardada con ese nombre ("identificacion")
  if (localStorage.getItem(nombreLocal)) {
    // Parsea su texto devuelta a un Objeto JSON Javascript
    const datos = JSON.parse(localStorage.getItem("identificacion"));
    
    // Itera por los datos respaldados
    datos.forEach((dato) => {
      // Busca en el documento HTML el input que coincida con ese atributo name
      const input = document.querySelector(`[name="${dato.nombre}"]`);
      if (input) input.value = dato.valor; // Le inyecta o restaura su valor anterior
    });
    
    // Borra la variable del LocalStorage para que no siga estorbando a futuro
    localStorage.removeItem(nombreLocal);
  }
};

// Limpia absolutamente TODA la caché almacenada por la página en LocalStorage (Borrado de sesión)
export const eliminarLocalStorage = () => {
  localStorage.clear();
};

// Forza la expiración y borrado manual de todas las cookies atadas al dominio actual
export const eliminarCookiesVanilla = () => {
  // Separa todas las cookies por el delimitador estándar
  document.cookie.split(";").forEach((cookie) => {
    // Obtiene solo el nombre base de la cookie limpiando los espacios trim()
    const nombre = cookie.split("=")[0].trim();

    // Sobrescribe la cookie poniéndole una fecha de caducidad en el pasado (Enero 1970) obligando al navegador a devorarla
    document.cookie = `${nombre}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });
};
