/**
 * Controlador: Listar y Gestionar Integrantes (verPlanIntegrantes.js)
 * Renderiza dinámicamente el listado de todos los miembros (personas)
 * que componen una familia usando paginación infinita o listado clásico.
 * Permite Eliminar, Crear nuevos o Editar los datos personales y médicos de los mismos.
 */
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { api } from "@/helpers/index.js";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { alertas as alerta } from "@/helpers/index.js";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { integrante as modalIntegrante } from "@/helpers/modales/index.js";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { paginacion } from "@/helpers/index.js";

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
        location.href = `#/voluntario/plan_familiar/familia?id=${id}`;
    };

    // Redirección Crear nuevo miembro
    crear.addEventListener("click", async () => {
        location.href = `#/voluntario/plan_familiar/integrantes/crear?familia_id=${id}`;
    });

    let mensajeVacio = "No tienes ningun miembro de la familia...";

    /**
     * Componente Dinámico Generador de Tarjetas HTML de Integrante
     * Recibe Entidad Miembro DB {full_name, blood_group, etc}
     */
    const carta = async (info) => {
        let cartaInfo = document.createElement('div');
        cartaInfo.classList.add("verIntegrante"); // Grid wrapper
        
        const divNombre = document.createElement("div");
        divNombre.className = "verIntegrante__nombre";
        const pNombre = document.createElement("p");
        pNombre.className = "tarjeta__titulo";
        pNombre.textContent = info.full_name;
        divNombre.appendChild(pNombre);
        cartaInfo.appendChild(divNombre);

        const divSangre = document.createElement("div");
        divSangre.className = "verIntegrante__sangre";
        const pSangre = document.createElement("p");
        pSangre.className = "tarjeta__titulo";
        pSangre.textContent = info.blood_group;
        divSangre.appendChild(pSangre);
        cartaInfo.appendChild(divSangre);

        const fields = [
            { cls: "verIntegrante__documento", icon: "ri-passport-line", val: info.document_number },
            { cls: "verIntegrante__telefono", icon: "ri-phone-line", val: info.phone },
            { cls: "verIntegrante__parentesco", icon: "ri-parent-line", val: info.kinship },
            { cls: "verIntegrante__edad", icon: "ri-cake-2-line", val: info.birth_date },
        ];

        fields.forEach(({ cls, icon, val }) => {
            const div = document.createElement("div");
            div.className = cls;
            const i = document.createElement("i");
            i.className = icon;
            div.appendChild(i);
            const p = document.createElement("p");
            p.className = "tarjeta__contenido";
            p.textContent = val;
            div.appendChild(p);
            cartaInfo.appendChild(div);
        });

        const btnEditar = document.createElement("button");
        btnEditar.className = "boton boton--azul boton__editar";
        btnEditar.dataset.id = info.id;
        btnEditar.textContent = "Editar";
        cartaInfo.appendChild(btnEditar);

        const btnEliminar = document.createElement("button");
        btnEliminar.className = "boton boton--azul boton__eliminar";
        btnEliminar.dataset.id = info.id;
        btnEliminar.textContent = "Eliminar";
        cartaInfo.appendChild(btnEliminar);

        const btnVerMas = document.createElement("button");
        btnVerMas.className = "boton boton__vermas";
        btnVerMas.dataset.id = info.id;
        btnVerMas.textContent = "Ver más";
        cartaInfo.appendChild(btnVerMas);
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
            window.location.href = `#/voluntario/plan_familiar/integrantes/editar?familia_id=${id}&integrante_id=${e.target.dataset.id}`;
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