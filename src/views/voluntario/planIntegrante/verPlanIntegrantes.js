/**
 * Controlador: Listar y Gestionar Integrantes (verPlanIntegrantes.js)
 * Renderiza dinámicamente el listado de todos los miembros (personas)
 * que componen una familia usando paginación infinita o listado clásico.
 * Permite Eliminar, Crear nuevos o Editar los datos personales y médicos de los mismos.
 */
import * as api from "../../../helpers/api";
import * as alerta from "../../../helpers/alertas";
import * as modalIntegrante from "../../../helpers/modales/integrante";
import paginacion from "../../../helpers/paginacion";

export default async () => {

    // Nodos Interfaz Base Nav
    const crear = document.getElementById("crear"); // Boton flotante o fijo 'Añadir Integrante'
    const botonBack = document.getElementById("botonBack");
    const id = location.hash.split("=")[1]; // PK Famliy Plan ID
    
    // Contenedor Inyección grid Tarjetas
    const contenedor = document.querySelector(".container__paginas");

    // Bloqueador Clics masivos Front
    if (window.procesoPeticion === undefined) { window.procesoPeticion = true; }
    window.procesoPeticion = true;

    // Regresar Atrás (Menu Principal Dashboard Casa)
    botonBack.onclick = () => {
        if (window.procesoPeticion) return;
        location.href = `#/voluntario-verPlanFamiliar/menu/id=${id}`;
    };

    // Redirección Crear nuevo miembro
    crear.addEventListener("click", async () => {
        location.href = `#/voluntario-planIntegrante/crear/id=${id}`;
    });

    let mensajeVacio = "No tienes ningun miembro de la familia...";

    /**
     * Componente Dinámico Generador de Tarjetas HTML de Integrante
     * Recibe Entidad Miembro DB {full_name, blood_group, etc}
     */
    const carta = async (info) => {
        let cartaInfo = document.createElement('div');
        cartaInfo.classList.add("verIntegrante"); // Grid wrapper
        
        // Plantilla UI con iconos RemixIcon y clases BEM
        cartaInfo.innerHTML = `
            <div class="verIntegrante__nombre"><p class="tarjeta__titulo">${info.full_name}</p></div>
            <div class="verIntegrante__sangre"><p class="tarjeta__titulo">${info.blood_group}</p></div>
            <div class="verIntegrante__documento"><i class="ri-passport-line"></i><p class="tarjeta__contenido">${info.document_number}</p></div>
            <div class="verIntegrante__telefono"><i class="ri-phone-line"></i><p class="tarjeta__contenido">${info.phone}</p></div>
            <div class="verIntegrante__parentesco"><i class="ri-parent-line"></i><p class="tarjeta__contenido">${info.kinship}</p></div>
            <div class="verIntegrante__edad"><i class="ri-cake-2-line"></i><p class="tarjeta__contenido">${info.birth_date}</p></div>
            <button class="boton boton--azul boton__editar" data-id="${info.id}">Editar</button>
            <button class="boton boton--azul boton__eliminar" data-id="${info.id}">Eliminar</button>
            <button class="boton boton__vermas" data-id="${info.id}">Ver más</button>`;
        return cartaInfo; // Node Retrun
    };

    // 🔥 MÉTODO RECARGAR CONTAINER (Core Fetcher & Renderer usando Helper Global Arquitectura)
    const recargarContainer = async () => {
        contenedor.innerHTML = "";
        await paginacion(`members/familyPlan/${id}`, mensajeVacio, carta); // Consume Controller Backend Laravel Get
    };

    // DELEGACIÓN EVENTOS GLOBALES DE CUADRÍCULA (Evitar memory leak por N listeners)
    contenedor.addEventListener("click", async (e) => {

        // ACTION: Editar Perfil Persona
        if (e.target.classList.contains("boton__editar")) {
            // Rutas Complejas CSV Parameters ID Plan , ID Miembro
            window.location.href = `#/voluntario-planIntegrante/editar/id=${id},${e.target.dataset.id}`;
        }

        // ACTION: Borrar Físicamente al Miembro del DB Root 
        if (e.target.classList.contains("boton__eliminar")) {
            const memberId = e.target.dataset.id; // Target PK

            // Confirmator UI Obligatorio Letal Delete
            const confirmacion = await alerta.alertaQuest(
                "¿Seguro que deseas eliminar este miembro de la familia?"
            );

            if (!confirmacion.isConfirmed) return;

            // Exec API DELETE 
            const eliminado = await api.delet(`members/${memberId}`);

            if (eliminado.success) {
                await alerta.alertaOK(eliminado.message); // Notificar
                await recargarContainer(); // Forzar Re-render visual que desaparece la Tarjeta borrada
            }
            else {
                alerta.alertaError(eliminado.message); // SQL Constrain foreign keys ?
            }
        }

        // ACTION: Modal Expansivo (Afecciones y datos completos)
        if (e.target.classList.contains("boton__vermas")) {
            const memberId = e.target.dataset.id;
            modalIntegrante.ver(memberId); // Popup flotante helper view
        }
    });

    // Auto-Run Init Load
    await recargarContainer();
};