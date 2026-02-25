import * as api from "./api";

export const cargarDatos = async (endpoint, listaInputs, nombreValores) => {
  const valores = await api.get(endpoint);  
  for (let cont = 0; cont < listaInputs.length; cont++) {
    listaInputs[cont].value = valores[nombreValores[cont]];
    if (valores[nombreValores[cont]] == undefined) {
      listaInputs[cont].value = "";
    }
  }
};
