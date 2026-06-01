import * as api from "@/helpers/api";

export const componenteHeader = async () => {
    
    const headerCont = document.createElement("header");
    headerCont.classList.add("headerCont");

    const header = document.createElement("div");
    header.classList.add("header"); 
    
    const botonAtras = document.createElement("button");
    botonAtras.classList.add("header__boton", "header__boton--padding", "header__boton--oscuro");
    botonAtras.id = "botonBack";
    const iconBack = document.createElement("i");
    iconBack.classList.add("header__icono", "ri-arrow-left-s-line");
    botonAtras.append(iconBack);
    
    const home = document.createElement("div");
    home.classList.add("header__contenedor");
    
    const logo = document.createElement("img");
    logo.classList.add("header__imagen-logo");
    logo.src="../public/logo.png";
    
    const headerTexto = document.createElement("div");
    headerTexto.classList.add("header__texto");
    
    const textoUno = document.createElement("p");
    textoUno.classList.add("header__subtitulo");
    textoUno.textContent='PLAN FAMILIAR DE';
    
    const textoDos = document.createElement("p");
    textoDos.classList.add("header__titulo");
    textoDos.textContent='EMERGENCIA';
    
    headerTexto.append(textoUno, textoDos);
    
    home.append(logo, headerTexto);
    
    
    const rightHeader = document.createElement("div");
    rightHeader.classList.add("header__contenedor");
    
    const botonNoti = document.createElement("button");
    botonNoti.classList.add("header__boton", "header__boton--padding", "header__boton--notificacion", "header__boton--oscuro");
    const iconNoti = document.createElement("i");
    iconNoti.classList.add("header__icono", "ri-notification-2-fill");
    const indicador = document.createElement("span");
    indicador.classList.add("header__indicador");
    botonNoti.append(iconNoti, indicador);

    const botonPerfil = document.createElement("button");
    botonPerfil.classList.add("header__boton", "header__boton--padding", "header__boton--oscuro");
    const iconPerfil = document.createElement("i");
    iconPerfil.classList.add("header__icono", "ri-user-3-fill");
    botonPerfil.appendChild(iconPerfil);

    rightHeader.append(botonNoti, botonPerfil);

    header.append(botonAtras, home, rightHeader);

    headerCont.appendChild(header)


    const rolId = localStorage.getItem("role_id");
    const userId = localStorage.getItem("id");
    const hash = location.hash.slice(2);

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
    if(home){
    home.addEventListener("click", () => {
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

    const layout = document.querySelector(".layout");

    if (layout) {
        layout.insertAdjacentElement("afterbegin", headerCont);
    }

    await cargarIndicador();

};