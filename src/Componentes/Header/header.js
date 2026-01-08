import { validarCookies } from '../../Helpers/validarCookies.js';
export const componenteHeader = () => { 
    const header = document.querySelector(".header");
    if(!validarCookies()){
        header.classList.add("invisible");
    }
    else{
        header.classList.remove("invisible");
    }
};