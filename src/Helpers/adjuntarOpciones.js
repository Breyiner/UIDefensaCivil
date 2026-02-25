import * as api from "./api";

export const adjuntar = async (combox, endpoint) => {
  const datos = await api.get(endpoint);
  datos.forEach((dat) => {
    if (dat.is_active == 1) {
      const option = document.createElement("option");
      option.value = dat.id;
      option.textContent = `${dat.name}`;
      combox.appendChild(option);
    }
  });
};

export const adjuntarNoValida = async (combox, endpoint) => {
  const datos = await api.get(endpoint);
  datos.forEach((dat) => {
    const option = document.createElement("option");
    option.value = dat.id;
    option.textContent = `${dat.name}`;
    combox.appendChild(option);
  });
};

export const adjuntarInfo = async (combox, endpoint, infoDato) => {
  const datos = await api.get(endpoint);
  datos.forEach((dat) => {
    if (dat.is_active == 1) {
      const option = document.createElement("option");
      option.value = dat.id;
      option.textContent = `${dat[infoDato]} - ${dat.name}`;
      combox.appendChild(option);
    }
  });
};

export const adjuntarDouble = async (combox, endpoint,input,infoDato) => {
  const datos = await api.get(endpoint);
  datos.forEach((dat) => {
    if (dat.is_active == 1) {
      const option = document.createElement("option");
      option.value = dat.id;
      option.textContent = `${dat.name}`;
      combox.appendChild(option);
    }
  });
  combox.addEventListener("change", () => {
    const seleccionado = combox.value;
    const seleccionadoInfo = datos.find((dat) => dat.id == seleccionado);
    input.value = seleccionadoInfo[infoDato];
    input.dispatchEvent(new Event("blur"));
  });
};

export const adjuntarMiembros = async (combox, endpoint) => {
  const datos = await api.get(endpoint);
  datos.forEach((dat) => {
    const option = document.createElement("option");
    option.value = dat.id;
    option.textContent = `${dat.full_name} - ${dat.document_number}(${dat.kinship})`;
    combox.appendChild(option);
  });
};

export const adjuntarFactorRiesgo = async (combox, endpoint) => {
  const datos = await api.get(endpoint);
  datos.forEach((dat) => {
    const option = document.createElement("option");
    option.value = dat.id;
    option.textContent = `${dat.threat_type_name} - ${dat.description}`;
    combox.appendChild(option);
  });
};

export const adjuntarReseteo = async (combox, endpoint) => {  
  const datos = await api.get(endpoint);

  const tom = combox.tomselect;

  if (!tom) return;

  tom.disable(); // lo deshabilitas mientras carga

  tom.clear();
  tom.clearOptions();

  datos.forEach((dat) => {
    if (dat.is_active == 1) {
      tom.addOption({
        value: dat.id,
        text: dat.name
      });
    }
  });

  tom.refreshOptions(false);

  tom.enable(); // 🔥 lo vuelves a activar
};

export const adjuntarReseteoNoValida = async (combox, endpoint) => {
  const datos = await api.get(endpoint);

  // 🔥 Si tiene TomSelect
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
    // 🔹 Si es un select normal
    combox.options.length = 0;
    combox.disabled = false;

    datos.forEach((dat) => {
      const option = document.createElement("option");
      option.value = dat.id;
      option.textContent = dat.name;
      combox.appendChild(option);
    });
  }
};
