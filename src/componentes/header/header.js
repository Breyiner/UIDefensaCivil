const listSinBack = ['voluntario-home', 'administrador-home', 'supervisor-home'];

export const componenteHeader = () => {
    const indicador = document.querySelector(".header__indicador");
    const botonAtras = document.getElementById("botonBack");
    const botonHome = document.getElementById("botonHome");
    const botonNoti = document.getElementById("botonNotificaciones")
    const botonPerfil = document.getElementById("botonPerfil");
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

    botonNoti.addEventListener("click", () => {
        if (hash == 'usuarios/notificaciones') return
        location.hash = "#/usuarios/notificaciones";
    });

};