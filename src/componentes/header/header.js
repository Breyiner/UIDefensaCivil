import * as api from "@/helpers/api";

export const componenteHeader = async () => {
    const indicador = document.querySelector(".header__indicador");
    const botonAtras = document.getElementById("botonBack");
    const botonHome = document.getElementById("botonHome");
    const botonNoti = document.getElementById("botonNotificaciones");
    const botonPerfil = document.getElementById("botonPerfil");
    const rolId = localStorage.getItem("role_id");
    const userId = localStorage.getItem("id");
    const hash = location.hash.slice(2);

    // indicador.classList.remove('invisible');

    // const indicadorNumero = Number(indicador.textContent);

    // if (indicadorNumero === 0) {
    //     indicador.classList.add('invisible');
    // }
    // else if (indicadorNumero >= 10) {
    //     indicador.textContent = '9+';
    // }

    const cargarIndicador = async () => {

        if (!userId) return;
        
        const data = await api.get(`notifications/user/count/${userId}`);
        const count = data?.unread_notifications ?? 0;

        if (count === 0) {
            indicador.classList.add('invisible');
        } else {
            indicador.classList.remove('invisible');
            indicador.textContent = count >= 10 ? '9+' : count;
        }
    };

    // botón HOME: se agregó una validacion antes del evento ya que primero cargaba el controller y no el html lo cual hacia que el boton en ese instante no existiera, lo cual no nos dejaba cargar la pagina correctamente
    if(botonHome){
    botonHome.addEventListener("click", () => {
        if (rolId == 1) location.href = `#/administrador`
        else if(rolId == 2) location.href = `#/supervisor`
        else if(rolId == 3)location.href = `#/voluntario`
    });
    }

    // botón PERFIL
    if(botonPerfil){
        botonPerfil.addEventListener("click", () => {
        if (hash == 'usuarios/perfil') return
        location.hash = "#/usuarios/perfil";
    });
    }

    if(botonNoti){
    botonNoti.addEventListener("click", () => {

        if (rolId == 1) {
            location.hash = "#/administrador/notificaciones";
        }
        if (rolId == 2) {
            location.hash = "#/supervisor/notificaciones";
        }
        if (rolId == 3) {
            location.hash = "#/voluntario/notificaciones";
        }
    });
    }

    await cargarIndicador();

};