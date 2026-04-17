/**
 * Controlador: Gestión de Usuarios Activos (gestionController.js)
 * Responsable de listar y paginar a todos los voluntarios bajo el cargo del supervisor.
 * Usa el helper de Paginación para crear cartas dinámicas e invoca el modalUsuario 
 * para visualizar los detalles de cada miembro.
 */
import * as alerta from "../../../../helpers/alertas";
import * as api from "../../../../helpers/api";
import paginacion from "../../../../helpers/paginacion";
import * as modalUsuario from "../../../../helpers/modales/usuario";

export default async () => {

    // Extrae apuntadores a los botones de navegación generales
    const botonBack = document.getElementById("botonBack");
    
    // Contenedor dinámico principal donde se incrustarán las Cards de usuarios paginados
    const contenedor = document.querySelector(".container__paginas");

    // Prevención de clics múltiples bloqueando interacción si la red está operando
    if (window.procesoPeticion === undefined) {
        window.procesoPeticion = false;
    }
    window.procesoPeticion = false;

    // Regla global retroceder al hub Dashboard del supervisor
    botonBack.onclick = () => {
        if (window.procesoPeticion) return;
        location.href = `#/supervisor/`;
    };

    // Fallback string para el helper de paginación
    const mensajeVacio = "No hay ninguna peticion de activacion";

    // Función constructora (Inyector visual): Recibe un objeto literal (Dato DB) y arma un cuadro HTML
    const carta = async (info) => {

        // Crea un div envolvente por memoria RAM
        const div = document.createElement("div");
        div.classList.add("verUsuario"); // Prepara estilización CSS grid de cartas

        // Operador ternario doble para definir el tinte (Color del Rol) del contenedor. 
        // Identifica el estado 2 (Activo), de lo contrario Desactivado, o segmenta por rango
        const rolClase =
            info.state_user_id != 2
                ? info.rol == "Supervisor"
                    ? "verUsuario__rol--supervisor"
                    : "verUsuario__rol--voluntario"
                : "verUsuario__rol--desactivado";

        // HTML interno de la tarjeta. Interpolando íconos Remix con valores de Base de Datos DB
        div.innerHTML = `
            <div class="verUsuario__documento">
                <i class="ri-id-card-line"></i>${info.document_number}
            </div>

            <div class="verUsuario__rol ${rolClase}">
                <span>${info.rol} - ${info.status}</span>
            </div>

            <div class="verUsuario__nombre">
                <i class="ri-jewelry-line"></i>${info.full_name}
            </div>

            <div class="verUsuario__correo">
                <i class="ri-mail-line"></i>${info.email}
            </div>

            <div class="verUsuario__seccional">
                <i class="ri-team-line"></i>${info.sectional}
            </div>

            <div class="verUsuario__organizacion">
                <i class="ri-parent-line"></i>${info.organization}
            </div>

            <div class="verUsuario__botones">
                <button class="boton boton--azul verUsuario__botonPeticion"
                        data-id="${info.id}">
                    Ver informacion
                </button>
            </div>
        `;

        // Retorna el elemento ensamblado para que el orquestador Paginación lo append() al contenedor principal
        return div;
    };

    // Función Helper delegada a la clase UI para limpiar rastros y rehacer peticiones (Actualizar lista post-modal)
    const recargarContainer = async () => {
        contenedor.innerHTML = ""; // Barrido
        
        // Petición al endpoint "userForSupervisor" encargada de los filtros, emitiendo objeto Paginated JSON 
        // Pasando el esqueleto constructor `carta`
        await paginacion(`users`, mensajeVacio, carta);
    };

    // Escucha pasiva delegada al contenedor padre (Técnica Event Delegation optimizada RAM)
    contenedor.addEventListener("click", async (e) => {

        // Verifica si el clic recayó exacto sobre, o dentro (Span/icon), de un <button> HTML
        const boton = e.target.closest("button");
        if (!boton) return; // Rompe si tocó pared vacía

        // Doble check de clase CSS target (Solo el botón ver info)
        if (!boton.classList.contains("verUsuario__botonPeticion")) return;

        // Recuperar Meta-ID guardado en tiempo de inyección (data-id)
        const userId = boton.dataset.id;

        // Lanza función "Ver" contenida en "modales/usuario.js" pasando 
        // la ID identificadora, el refresco padre y las booleánicas de poder de rol Administrativo o Supervisor Local
        // Pasamos la función limpia al modal
        modalUsuario.ver(userId, recargarContainer, false, true);
    });

    // Arranque de rutina nativo al desplegar esta vista la primera vez
    await recargarContainer();
};