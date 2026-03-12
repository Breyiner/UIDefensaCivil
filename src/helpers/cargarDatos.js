/**
 * Helper de Auto-Relleno de Formularios (cargarDatos.js)
 * Script auxiliar diseñado para consumir un endpoint (ej: verUnRegistro)
 * e inyectar sus valores ordenadamente en un Arreglo de Inputs HTML dado. 
 */
import * as api from "./api";

// Recibe URL, Referencias al DOM (listaInputs) y el mapeo literal de los JSON keys del backend (nombreValores)
export const cargarDatos = async (endpoint, listaInputs, nombreValores) => {
  const valores = await api.get(endpoint);  
  
  // Recorre el arreglo de nodos por índice sincronizando JSON llave -> HTML Input
  for (let cont = 0; cont < listaInputs.length; cont++) {
    listaInputs[cont].value = valores[nombreValores[cont]];
    
    // Si la propiedad JSON es defectuosa o ni existe, sanitiza blanqueando la caja
    if (valores[nombreValores[cont]] == undefined) {
      listaInputs[cont].value = "";
    }
  }
};
