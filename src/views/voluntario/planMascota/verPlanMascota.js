/**
 * Controlador: Listar y gestionar mascotas de la familia.
 * Fetcher asíncrono para renderizar las tarjetas de cada animal perteneciente al núcleo familiar.
 * Usa lógica condicional Switch Case para pintar Iconos SVG según 'Especie' de la Mascota.
 */
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { api, alertas as alerta, formatearFecha } from "@/helpers/index.js";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { paginacion } from "@/helpers/index.js";
import { mascotaDetalleModal } from "@/componentes/mascotas/index.js";


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

        const divIcono = document.createElement("div");
        divIcono.classList.add("verMascotas__icono");
        const img = document.createElement("img");
        img.src = `icon/${adaptarIcono(info.species_name)}.svg`;
        divIcono.appendChild(img);
        cartaInfo.appendChild(divIcono);

        const divNombre = document.createElement("div");
        divNombre.classList.add("verMascotas__nombre");
        divNombre.textContent = info.name;
        cartaInfo.appendChild(divNombre);

        const divDatos = document.createElement("div");
        divDatos.classList.add("verMascotas__datos");
        divDatos.textContent = `${info.species_name} - ${info.breed}`;
        cartaInfo.appendChild(divDatos);

        const divEdad = document.createElement("div");
        divEdad.classList.add("verMascotas__edad");
        divEdad.textContent = `${info.age} años`;
        cartaInfo.appendChild(divEdad);

        const divGeneroIcono = document.createElement("div");
        divGeneroIcono.classList.add("verMascotas__generoIcono");
        if (info.animal_gender_id != 1) {
            divGeneroIcono.classList.add("verMascotas__generoIcono--hembra");
        }
        const iGenero = document.createElement("i");
        iGenero.classList.add(`ri-${info.animal_gender_id == 1 ? "men" : "women"}-line`);
        divGeneroIcono.appendChild(iGenero);
        cartaInfo.appendChild(divGeneroIcono);

        const divGenero = document.createElement("div");
        divGenero.classList.add("verMascotas__genero");
        const spanGenero = document.createElement("span");
        spanGenero.textContent = info.animal_gender_name;
        divGenero.appendChild(spanGenero);
        cartaInfo.appendChild(divGenero);

        const btnEditar = document.createElement("button");
        btnEditar.classList.add("boton", "boton--azul", "verMascotas__boton--editar");
        btnEditar.dataset.id = info.id;
        btnEditar.textContent = "Editar";
        cartaInfo.appendChild(btnEditar);

        const btnEliminar = document.createElement("button");
        btnEliminar.classList.add("boton", "boton--azul", "verMascotas__boton--eliminar");
        btnEliminar.dataset.id = info.id;
        btnEliminar.textContent = "Eliminar";
        cartaInfo.appendChild(btnEliminar);

        const btnVerMas = document.createElement("button");
        btnVerMas.classList.add("boton", "verMascotas__boton--verMas");
        btnVerMas.dataset.id = info.id;
        btnVerMas.textContent = "Ver más";
        cartaInfo.appendChild(btnVerMas);

        return cartaInfo;
    };

    // Recargar el listado de mascotas
    const recargarContainer = async () => {
        contenedor.innerHTML = "";
        await paginacion(`pets/familyPlan/${id}`, mensajeVacio, carta);
    };

    // Delegador de eventos para las acciones sobre mascotas
    contenedor.addEventListener("click", async (e) => {

        // Editar mascota
        const btnEditar = e.target.closest(".verMascotas__boton--editar");
        if (btnEditar) {
            window.location.href = `#/voluntario/plan_familiar/mascotas/editar?familia_id=${id}&mascota_id=${btnEditar.dataset.id}`;
            return;
        }

        // Eliminar mascota de forma permanente
        const btnEliminar = e.target.closest(".verMascotas__boton--eliminar");
        if (btnEliminar) {
            const petId = btnEliminar.dataset.id;

            // Confirmación de eliminación
            const confirmacion = await alerta.alertaQuest(
                "¿Seguro que deseas eliminar esta mascota de la familia?"
            );

            if (!confirmacion.isConfirmed) return;

            // Petición de borrado
            const eliminado = await api.delet(`pets/${petId}`);

            if (eliminado.success) {
                await alerta.alertaOK(eliminado.message);
                await recargarContainer();
            } else {
                alerta.alertaError(eliminado.message);
            }
            return;
        }

        // Mostrar modal con detalles y vacunas de la mascota
        const btnVerMas = e.target.closest(".verMascotas__boton--verMas");
        if (btnVerMas) {
            const petId = btnVerMas.dataset.id;
            const [petData, vaccines] = await Promise.all([
                api.get(`pets/${petId}`),
                api.get(`petVaccines/pet/${petId}`)
            ]);
            if (!petData) return;

            const modal = mascotaDetalleModal({ petData, vaccines: vaccines || [] });
            document.body.appendChild(modal);

            const btnCerrar = modal.querySelector(".modal-edicion__btn--secundario");
            const closeModal = () => {
                modal.close();
                modal.remove();
            };
            btnCerrar.addEventListener("click", closeModal);
            modal.addEventListener("click", (e) => {
                if (e.target === modal) closeModal();
            });

            modal.showModal();
        }
    });

    // Auto Run on Build
    await recargarContainer();
};