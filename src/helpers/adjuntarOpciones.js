/**
 * Helper Generador de Dropdowns/Selects (adjuntarOpciones.js)
 * Colección de utilidades para poblar etiquetas <select> o listas 'TomSelect' usando endpoints de la API.
 */
import * as api from "./api";

// Carga un select HTML nativo trayendo del endpoint SOLAMENTE los registros activos (is_active == 1)
export const adjuntar = async (combox, endpoint) => {
  const datos = await api.get(endpoint);
  datos.forEach((dat) => {
    if (dat.is_active == 1) {
      const option = document.createElement("option");
      option.value = dat.id; // ID oculto de sistema
      option.textContent = `${dat.name}`; // Label visual legible del usuario
      combox.appendChild(option);
    }
  });
};

// Variante igual a 'adjuntar' pero IGNORA el estado is_active. Trae Inactivos y Activos juntos.
export const adjuntarNoValida = async (combox, endpoint) => {
  const datos = await api.get(endpoint);
  datos.forEach((dat) => {
    const option = document.createElement("option");
    option.value = dat.id;
    option.textContent = `${dat.name}`;
    combox.appendChild(option);
  });
};

// Adjunta opciones concatenando más de una propiedad en el label visual para enriquecer (Ej: Nombre - Cédula)
export const adjuntarInfo = async (combox, endpoint, infoDato) => {
  const datos = await api.get(endpoint);
  datos.forEach((dat) => {
    if (dat.is_active == 1) {
      const option = document.createElement("option");
      option.value = dat.id;
      // infoDato mapeará dinamicamente otro campo sumado al .name
      option.textContent = `${dat[infoDato]} - ${dat.name}`;
      combox.appendChild(option);
    }
  });
};

// Combina el llenado del combo, y además ata un evento "onChange" para autobloquear otro campo (input) sincronizado.
export const adjuntarDouble = async (combox, endpoint, input, infoDato) => {
  const datos = await api.get(endpoint);
  datos.forEach((dat) => {
    if (dat.is_active == 1) {
      const option = document.createElement("option");
      option.value = dat.id;
      option.textContent = `${dat.name}`;
      combox.appendChild(option);
    }
  });
  // Evento autocompletar input ajeno
  combox.addEventListener("change", () => {
    const seleccionado = combox.value;
    const seleccionadoInfo = datos.find((dat) => dat.id == seleccionado);
    input.value = seleccionadoInfo[infoDato]; // Rellena el input satélite con un dato derivado
    input.dispatchEvent(new Event("blur"));
  });
};

// Custom builder: Puebla el selector de Miembros de familia con info hiper detalla (Nombre, doc y Parentesco)
export const adjuntarMiembros = async (combox, endpoint) => {
  const datos = await api.get(endpoint);
  datos.forEach((dat) => {
    const option = document.createElement("option");
    option.value = dat.id;
    option.textContent = `${dat.full_name} - ${dat.document_number}(${dat.kinship})`;
    combox.appendChild(option);
  });
};

// Custom Builder: Puebla el selector de amenazas de riesgo con código ID textual y concepto
export const adjuntarFactorRiesgo = async (combox, endpoint) => {
  const datos = await api.get(endpoint);
  datos.forEach((dat) => {
    const option = document.createElement("option");
    option.value = dat.id;
    option.textContent = `${dat.threat_type_name} - ${dat.description}`;
    combox.appendChild(option);
  });
};

// Muta y re-carga combos modernizados instanciados con el plugin "TomSelect".
// Válidador de activos solamente.

export const adjuntarReseteo = async (combox, endpoint) => {
  if (endpoint.endsWith('/') || endpoint.endsWith('undefined') || endpoint.endsWith('null')) return;

  const respuestaApi = await api.get(endpoint);

  // DIAGNÓSTICO: Veremos exactamente en la consola el objeto que manda el backend
  // console.log("Respuesta API cruda:", respuestaApi);

  // NORMALIZACIÓN SEGURA: Extrae el array sin importar la envoltura
  let arr = [];
  if (Array.isArray(respuestaApi)) {
    arr = respuestaApi;
  } else if (respuestaApi && Array.isArray(respuestaApi.data)) {
    arr = respuestaApi.data;
  } else if (respuestaApi && respuestaApi.data && Array.isArray(respuestaApi.data.data)) {
    arr = respuestaApi.data.data;
  }

  console.log("Array de organizaciones a iterar:", arr);

  const tom = combox.tomselect; // Extrae API de TomSelect si existe

  // ==========================================
  // OPICIÓN A: SI EL ELEMENTO USA TOMSELECT
  // ==========================================
  if (tom) {
    tom.disable();
    tom.clear();
    tom.clearOptions();

    // CORREGIDO: Se cambia 'datos' por 'arr'
    arr.forEach((dat) => {
      if (dat.is_active == 1) {
        tom.addOption({
          value: dat.id,
          text: dat.name
        });
      }
    });

    tom.refreshOptions(false);
    tom.enable();
  }

  // ==========================================
  // OPCIÓN B: SI ES UN SELECT NATIVO COMÚN
  // ==========================================
  else {

    // 1. Limpiamos las opciones viejas del HTML
    combox.innerHTML = "";

    // 2. Creamos la opción por defecto (Placeholder)
    const optionDefault = document.createElement('option');
    optionDefault.value = "";
    optionDefault.textContent = "Organización";
    optionDefault.disabled = true;
    optionDefault.selected = true;
    combox.appendChild(optionDefault);

    // 3. Inyectamos las organizaciones activas una por una en el DOM
    arr.forEach((dat) => {
      if (dat.is_active == 1) {
        const opt = document.createElement('option');
        opt.value = dat.id;
        opt.textContent = dat.name;
        combox.appendChild(opt);
      }
    });
  }
};

export const adjuntarReseteoNoValida = async (combox, endpoint) => {
  const datos = await api.get(endpoint);

  // if(!datos) return;

  // 🔥 Si tiene la API de TomSelect corriendo allí adentro
  if (combox.tomselect) {
    const tom = combox.tomselect;

    tom.disable();      // opcional mientras carga
    tom.clear();
    tom.clearOptions();

    datos.forEach((dat) => {
      tom.addOption({
        value: dat.id,
        text: dat.name
      });
    });

    tom.refreshOptions(false);
    tom.enable();

  } else {
    // 🔹 Si es un select HTML normal de caja fea 
    combox.options.length = 0; // Borra todos los hijos opción de rompetazo
    combox.disabled = false;

    datos.forEach((dat) => {
      const option = document.createElement("option");
      option.value = dat.id;
      option.textContent = dat.name;
      combox.appendChild(option);
    });
  }
};
