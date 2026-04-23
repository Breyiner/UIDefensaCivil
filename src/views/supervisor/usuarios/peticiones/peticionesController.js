/**
 * Controlador: Peticiones de Usuario (peticionesController.js)
 * Renderiza y pagina la bandeja de entrada de nuevos voluntarios que esperan aprobación.
 * Al interactuar, levanta el modal especializado que permite Aprobar o Rechazar el ingreso.
 */
import * as alerta from "../../../../helpers/alertas";
import * as api from "../../../../helpers/api";
import paginacion from "../../../../helpers/paginacion";
import * as modalUsuario from "../../../../helpers/modales/usuario";

export default async () => {

    // Instancia el botón de retroceso superior
    const botonBack = document.getElementById("botonBack");
    
    // Contenedor principal que alojará las tarjetas renderizadas por paginación
    const contenedor = document.querySelector(".container__paginas");

    // Lógica bloqueante anti-múltiples clics por retardos asincronos
    if (window.procesoPeticion === undefined) window.procesoPeticion = false;
    window.procesoPeticion = false;

    // Enganche para volverse al dashboard menú general
    botonBack.onclick = () => {
        if (window.procesoPeticion) return;
        location.href = `#/supervisor/`;
    };

    // Leyenda mostrada cuando la cuenta se vacía de tareas por resolver
    const mensajeVacio = "No hay ninguna peticion de activacion";

    // Fabricante dinámico de las tarjetas DOM a inyectar al Container Parent
    const carta = async (info) => {
        const div = document.createElement("div"); // Contenedor principal
        div.classList.add("verUsuario"); // clase del contenedor

        // hijo 1
        const usuarioDocCont = document.createElement("div");
        usuarioDocCont.classList.add('verUsuario__documento');

        const iconoDoc = document.createElement('i');
        iconoDoc.classList.add("ri-id-card-line");
        const numberDoc = document.createElement("div")
        numberDoc.textContent = info.document_number;

        usuarioDocCont.append(iconoDoc, numberDoc);

        //hijo 2
        const usuarioRolCont = document.createElement("div");
        usuarioRolCont.classList.add('verUsuario__rol');

        const tituloRol = document.createElement('span');
        tituloRol.classList.add("titulo__rol")
        
        usuarioRolCont.append(tituloRol);

        //hijo 3
        const usuarioNombreCont = document.createElement("div");
        usuarioNombreCont.classList.add("verUsuario__nombre")

        const iconoNom = document.createElement('i');
        iconoNom.classList.add("ri-jewelry-line");
        const fullName = document.createElement("div");
        fullName.textContent =info.full_name;

        usuarioNombreCont.append (iconoNom, fullName);

        //hijo 4
        const usuarioCorreoCont = document.createElement("div");
        usuarioCorreoCont.classList.add("verUsuario__correo")

        const iconoCorr = document.createElement('i');
        iconoCorr.classList.add("ri-mail-line");
        const email = document.createElement("div");
        email.textContent =info.email;

        usuarioCorreoCont.append (iconoCorr, email);

        //hijo 5
        const usuarioSeccionalCont = document.createElement("div");
        usuarioSeccionalCont.classList.add("verUsuario__seccional");

        const iconoSec = document.createElement('i');
        iconoSec.classList.add("ri-team-line");
        const seccional = document.createElement("div");
        seccional.textContent =info.sectional;

        usuarioSeccionalCont.append (iconoSec, seccional);

        //hijo 6
        const usuarioOrgCont = document.createElement("div");
        usuarioOrgCont.classList.add("verUsuario__organizacion");

        const iconoOrg = document.createElement("i");
        iconoOrg.classList.add("ri-parent-line");
        const org = document.createElement("div");
        org.textContent = info.organization;

        usuarioOrgCont.append(iconoOrg, org);

        //hijo 7
        const usuarioBtnCont = document.createElement("div");
        usuarioBtnCont.classList.add("verUsuario__botones");

        const btnCont = document.createElement("button");
        btnCont.classList.add("boton", "boton--azul", "verUsuario__botonPeticion");
        btnCont.setAttribute("data-id", info.id);
        btnCont.textContent = "Ver informacion";

        usuarioBtnCont.appendChild(btnCont);


        //Agregar al contenedor principal
        div.append(usuarioDocCont, usuarioRolCont, usuarioNombreCont, usuarioCorreoCont, usuarioSeccionalCont, usuarioOrgCont, usuarioBtnCont);

        // div.innerHTML = `
        //     <div class="verUsuario__documento">
        //         <i class="ri-id-card-line"></i>${info.document_number}
        //     </div>
        //     <div class="verUsuario__rol">
        //         <span>Peticion</span>
        //     </div>
        //     <div class="verUsuario__nombre">
        //         <i class="ri-jewelry-line"></i>${info.full_name}
        //     </div>
        //     <div class="verUsuario__correo">
        //         <i class="ri-mail-line"></i>${info.email}
        //     </div>
        //     <div class="verUsuario__seccional">
        //         <i class="ri-team-line"></i>${info.sectional}
        //     </div>
        //     <div class="verUsuario__organizacion">
        //         <i class="ri-parent-line"></i>${info.organization}
        //     </div>
        //     <div class="verUsuario__botones">
        //         <button class="boton boton--azul verUsuario__botonPeticion"
        //                 data-id="${info.id}">
        //             Ver informacion
        //         </button>
        //     </div>
        // `;

        return div; // Entrega la carta completa texturizada
    };

    // Orquestador encapsulado para Refresh / Update Table sin refresco general de la pag SPA web
    const recargarContainer = async () => {
        contenedor.innerHTML = ""; // Hard reset
        
        // El script helpers Paginador consume un endpoint exclusivo 'requestsSupervisors' 
        // Pasando su propia lógica de Fetch Pages + el template `carta`
        await paginacion(`users/requestsSupervisors`, mensajeVacio, carta); 
    };

    // Proxy atrapador de eventos clic de gran cobertura
    contenedor.addEventListener("click", async (e) => {
        // Ignora toda la periferia exceptuando la zona de un botón <button>
        const boton = e.target.closest("button");
        if (!boton) return;

        // Fija precisión en la clase específica boton
        if (!boton.classList.contains("verUsuario__botonPeticion")) return;

        // Se adhiere al Atributo data-* custom que plantamos
        const userId = boton.dataset.id;

        // Pasamos la función de recarga al modal
        // Lanza Pop-Up (usuario.js). (Modo 'Ver Peticion' == True) 
        modalUsuario.ver(userId, recargarContainer, true, true);
    });

    // Llenado automático primera carga en memoria SPA
    await recargarContainer();
};