import * as cookie from "../../Helpers/Cookies";

const listSinBack = ['voluntario-home','administrador-home','supervisor-home']

export const componenteHeader = () => { 
    const indicador = document.querySelector(".header__indicador");
    const botonAtras = document.querySelector(".header__boton");
    const hash = location.hash.slice(2);
    indicador.classList.remove('invisible');
    botonAtras.classList.remove('invisible');

    const indicadorNumero = Number(indicador.textContent);    
    if (indicadorNumero === 0)
    {
        indicador.classList.add('invisible');
    }
    else if (indicadorNumero >= 10)
    {
        indicador.textContent = '9+';
    }
    if(listSinBack.includes(hash))
    {
        botonAtras.classList.add('invisible');
    }
};

