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

    // listaInputs[cont].value = valores[nombreValores[cont]];

    let valor = valores[nombreValores[cont]];

    // Normaliza ISO datetime a yyyy-MM-dd para <input type="date">
    if (listaInputs[cont].type === "date" && valor) {
      valor = valor.split("T")[0]; // "2023-02-22T00:00:00.000000Z" → "2023-02-22"
    }
    
    listaInputs[cont].value = valor ?? "";
  }
};
