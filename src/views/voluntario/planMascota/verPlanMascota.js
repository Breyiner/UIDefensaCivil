/**
 * Controlador: Listar y Gestionar Mascotas (verPlanMascota.js)
 * Fetcher asíncrono para renderizar las tarjetas de cada animal perteneciente al núcleo familiar.
 * Usa lógica condicional Switch Case para pintar Iconos SVG según 'Especie' de la Mascota.
 */
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { api } from "@/helpers/index.js";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { alertas as alerta } from "@/helpers/index.js";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { mascota as modalMascota } from "@/helpers/modales/index.js";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { paginacion } from "@/helpers/index.js";

export default async () => {

    // Nodos Base Nav
    const crear = document.getElementById("crear"); // Redirige a Nuevo
    const botonBack = document.getElementById("botonBack"); // Regresa a Menu Modulos
    const id = location.hash.split("=")[1]; // PK id Padre Plan Familiar General

    // Contenedor Inyección Dom Cuadrícula Mascotas
    const contenedor = document.querySelector(".container__paginas");

    // Concurrency Lock UI Multiple Fetch limit
    if (window.procesoPeticion === undefined) { window.procesoPeticion = true; }
    window.procesoPeticion = true;

    // Regresar
    botonBack.onclick = () => {
        if (window.procesoPeticion) return;
        location.href = `#/voluntario/plan_familiar/familia?id=${id}`;
    };

    // Redirección Insertar
    crear.addEventListener("click", async () => {
        location.href = `#/voluntario/plan_familiar/mascotas/crear?familia_id=${id}`;
    });

    let mensajeVacio = "No tienes ninguna mascota registrada de la familia...";

    /**
     * Componente UI Card Factory Mascota 
     */
    const carta = async (info) => {

        // Diccionario Helper Local: Transforma Especie DB Literal a Ruta SVG Local Asset
        function adaptarIcono(animal) {
            switch (animal) {
                case "Perro": return "Perro";
                case "Gato": return "Gato";
                case "Conejo": return "Conejo";
                case "Ruedor": return "Ruedor";
                case "Ave": return "Ave";
                case "Insecto": return "Insecto";
                case "Pez": return "Pez";
                case "Rana": return "Rana";
                case "Serpiente": return "Serpiente";
                case "Tortuga": return "Tortuga";
                default: return "Pata"; // Generic fallback Icon
            }
        }

        let cartaInfo = document.createElement('div');
        cartaInfo.classList.add("verMascotas"); // Card Wrapper BEM CSS Grid

        // Bloque Condicional Interesante: animal_gender_id == 1 is Macho(AZUL). Else Hembra(ROSA CSS Class Modifier)
        cartaInfo.innerHTML = `
            <div class="verMascotas__icono">
                <img src="icon/${adaptarIcono(info.species_name)}.svg">
            </div>
            <div class="verMascotas__nombre">${info.name}</div>
            <div class="verMascotas__datos">${info.species_name} - ${info.breed}</div>
            <div class="verMascotas__edad">${info.age} años</div>
            <div class="verMascotas__generoIcono ${info.animal_gender_id == 1 ? "" : "verMascotas__generoIcono--hembra"}">
                <i class="ri-${info.animal_gender_id == 1 ? 'men' : 'women'}-line"></i>
            </div>
            <div class="verMascotas__genero">
                <span>${info.animal_gender_name}</span>
            </div>
            <button class="boton boton--azul verMascotas__boton--editar" data-id="${info.id}">Editar</button>
            <button class="boton boton--azul verMascotas__boton--eliminar" data-id="${info.id}">Eliminar</button>
            <button class="boton verMascotas__boton--verMas" data-id="${info.id}">Ver más</button>
        `;

        return cartaInfo; // Div Node Retorno
    };

    // 🔥 MÉTODO RECARGAR CONTAINER Paginado Virtual Helper
    const recargarContainer = async () => {
        contenedor.innerHTML = "";
        await paginacion(`pets/familyPlan/${id}`, mensajeVacio, carta);
    };

    // DELEGADOR MAIN Contenedor Eventos (Performance Optimization)
    contenedor.addEventListener("click", async (e) => {

        // Branch 1: Modificar Raza/Nombre/Edad o Anexar Vacunas a Mascota
        if (e.target.classList.contains("verMascotas__boton--editar")) {
            // Router CSV args URL (Plan ID , Pet ID)
            window.location.href = `#/voluntario/plan_familiar/mascotas/editar?familia_id=${id}&mascota_id=${e.target.dataset.id}`;
        }

        // Branch 2: Borrar de Existencia Mascota (Cascade de vacunas Backend)
        if (e.target.classList.contains("verMascotas__boton--eliminar")) {

            const petId = e.target.dataset.id; // DB PK

            // Alert Doble check Delete
            const confirmacion = await alerta.alertaQuest(
                "¿Seguro que deseas eliminar esta mascota de la familia?"
            );

            if (!confirmacion.isConfirmed) return;

            // Delete API
            const eliminado = await api.delet(`pets/${petId}`);

            if (eliminado.success) {
                await alerta.alertaOK(eliminado.message);
                await recargarContainer(); // 🔥 Force Refresh Virtual Grid Local Client Side
            } else {
                alerta.alertaError(eliminado.message);
            }
        }

        // Branch 3: Sweet Alert Expansor (Ver Vacunas Historial Específico si no quiero entrar a editar)
        if (e.target.classList.contains("verMascotas__boton--verMas")) {
            const petId = e.target.dataset.id;
            modalMascota.ver(petId);
        }
    });

    // Auto Run on Build
    await recargarContainer();
};