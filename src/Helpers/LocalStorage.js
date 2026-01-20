export const envioLocalStorage = (arrayDatos) => {
    const local = [];
    arrayDatos.forEach(datos => {
        let storage = {};
        if (datos.value)
        {
            storage.nombre = datos.name;
            storage.valor = datos.value
            local.push(storage);    
        }
    });
    localStorage.setItem("identificacion",JSON.stringify(local));
}

export const importacionLocalStorage = (nombreLocal) => {
    if (localStorage.getItem(nombreLocal))
    {
        const datos = JSON.parse(localStorage.getItem('identificacion'));
        datos.forEach(dato => {
            const input = document.querySelector(`[name="${dato.nombre}"]`);
            if (input) input.value = dato.valor;    
        })
        localStorage.removeItem(nombreLocal);
    };
}

export const eliminarLocalStorage = () => 
{
    window.localStorage.clear();
}

export const eliminarCookiesVanilla = () => {
  document.cookie.split(";").forEach(cookie => {
    const nombre = cookie.split("=")[0].trim();

    document.cookie = `${nombre}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });
};