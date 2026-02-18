import * as cookie from "../../Helpers/Cookies";

const listConNoti = ['home',]
const listSinBack = ['home','administrador-home']

export const componenteHeader = () => { 
    const header = document.querySelector(".header");
    const noti = document.querySelector(".header__notification");
    const burbuja = document.querySelector(".header__burbuja");
    const numerito = document.querySelector(".header__numerito");
    const back = document.querySelector(".header__boton");
    const hash = location.hash.slice(2);

    if(!cookie.existe()){
        header.classList.add("invisible");
    }
    else{
        header.classList.remove("invisible");
    }
    if (listConNoti.includes(hash))
    {
        noti.classList.remove('invisible');
        let peticion = 2;
        if (peticion > 1)
        {
            burbuja.classList.remove('invisible');   
            numerito.textContent = peticion;
        }
    }
    else{
        noti.classList.add('invisible');
        burbuja.classList.add('invisible');       
    }
    if(listSinBack.includes(hash))
    {
        back.classList.add('invisible');
    }
    else
    {
        back.classList.remove('invisible');
    }
};