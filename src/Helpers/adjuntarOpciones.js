import * as api from "./api";

export const adjuntar = async (combox,endpoint) => 
{
const datos = await api.getPublic(endpoint);
datos.forEach(dat => {
    if (dat.is_active == 1)
    {   
        const option = document.createElement('option');
        option.value = dat.id;
        option.textContent = `${dat.name}`;
        combox.appendChild(option);
    }
});
}

export const adjuntarInfo = async (combox,endpoint,infoDato) => 
{
const datos = await api.getPublic(endpoint);
datos.forEach(dat => {
    if (dat.is_active == 1)
    {   
        const option = document.createElement('option');
        option.value = dat.id;
        option.textContent = `${dat[infoDato]} - ${dat.name}`;//se utiliza corchetes y no . para hacerlo dinamico
        combox.appendChild(option);
    }
});
}

export const adjuntarReseteo = async (combox,endpoint) => 
{
    const datos = await api.getPublic(endpoint);
    combox.options.length = 0;
    combox.disabled = false;
    datos.forEach(dat => {
    if (dat.is_active == 1)
    {   
        const option = document.createElement('option');
        option.value = dat.id;
        option.textContent = `${dat.name}`;
        combox.appendChild(option);
    }
});
}