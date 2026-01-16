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