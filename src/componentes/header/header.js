const listSinBack = ['voluntario-home', 'administrador-home', 'supervisor-home'];

export const componenteHeader = () => {
    const indicador = document.querySelector(".header__indicador");
    const botonAtras = document.querySelector(".header__boton");
    const botonHome = document.getElementById("boton-home");
    const botonPerfil = document.getElementById("boton-perfil");
    const rolId = localStorage.getItem("role_id");
    const hash = location.hash.slice(2);

    indicador.classList.remove('invisible');
    botonAtras.classList.remove('invisible');

    const indicadorNumero = Number(indicador.textContent);

    if (indicadorNumero === 0) {
        indicador.classList.add('invisible');
    }
    else if (indicadorNumero >= 10) {
        indicador.textContent = '9+';
    }

    if (listSinBack.includes(hash)) {
        botonAtras.classList.add('invisible');
    }

    // botón HOME
    botonHome.addEventListener("click", () => {
        if (rolId == 1) location.href = `#/administrador-home`
        else if(rolId == 2) location.href = `#/supervisor-home`
        else if(rolId == 3)location.href = `#/voluntario-home`
    });

    // botón PERFIL
    botonPerfil.addEventListener("click", () => {
        if (hash == 'usuarios/perfil') return
        location.hash = "#/usuarios/perfil";
    });

};