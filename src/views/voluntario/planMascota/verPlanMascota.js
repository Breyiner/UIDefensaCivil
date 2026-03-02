import * as api from "../../../Helpers/api";
import * as alerta from "../../../Helpers/alertas";
import * as modalMascota from "../../../Helpers/modales/mascota";
import paginacion from "../../../Helpers/paginacion";

export default async () => {
    const crear = document.getElementById("crear");
    const botonBack = document.getElementById("boton-back");
    const id = location.hash.split("=")[1];

    if (window.procesoPeticion === undefined) { window.procesoPeticion = true; }
    window.procesoPeticion = true;

    botonBack.onclick = () => {
        if (window.procesoPeticion) return;
        location.href = `#/voluntario-verPlanFamiliar/menu/id=${id}`;
    };

    crear.addEventListener("click", async () => {location.href = `#/voluntario-planMascota/crear/id=${id}`;});

    let mensajeVacio = "No tienes ninguna mascota registrada de la familia...";

    const carta = async (info) => {
        function adaptarIcono(animal) {
            switch (animal) {
                case "Perro":
                    return "Perro";
                case "Gato":
                    return "Gato";
                case "Conejo":
                    return "Conejo";
                case "Ruedor":
                    return "Ruedor";
                case "Ave":
                    return "Ave";
                case "Insecto":
                    return "Insecto";
                case "Pez":
                    return "Pez";
                case "Rana":
                    return "Rana";
                case "Serpiente":
                    return "Serpiente";
                case "Tortuga":
                    return "Tortuga";
                default:
                    return "Pata";
            }
        };

        let cartaInfo = document.createElement('div');
        cartaInfo.classList.add("verMascotas");
        cartaInfo.innerHTML = `
            <div class="verMascotas__icono"><img src="icon/${await adaptarIcono(info.species_name)}.svg"></div>
            <div class="verMascotas__nombre">${info.name}</div>
            <div class="verMascotas__datos">${info.species_name} - ${info.breed}</div>
            <div class="verMascotas__edad">${info.age} años</div>
            <div class="verMascotas__generoIcono ${info.animal_gender_id == 1 ? "" : "verMascotas__generoIcono--hembra"}"><i class="ri-${info.animal_gender_id == 1 ? 'men' : 'women'}-line"></i></div>
            <div class="verMascotas__genero"><span>${info.animal_gender_name}</span></div>
            <button class="boton boton--azul verMascotas__boton--editar" data-id="${info.id}">Editar</button>
            <button class="boton boton--azul verMascotas__boton--eliminar" data-id="${info.id}">Eliminar</button>
            <button class="boton verMascotas__boton--verMas" data-id="${info.id}">Ver más</button>
            `;
        return cartaInfo;
    }

    const funcionBotones = async (e) => {
        if (e.target.classList.contains("verMascotas__boton--editar")) {
        window.location.href = `#/voluntario-planMascota/editar/id=${id},${e.target.dataset.id}`;
        }

        if (e.target.classList.contains("verMascotas__boton--eliminar")) {
            const id = e.target.dataset.id;
            const confirmacion = await alerta.alertaQuest(
                "¿Seguro que deseas eliminar esta mascota de la familia?",
            );
            if (!confirmacion.isConfirmed) return;

            const eliminado = await api.delet(`pets/${id}`);
            if (eliminado.success) {
                await alerta.alertaOK(eliminado.message);
                location.reload();
            } else alerta.alertaError(eliminado.message);
        }

        if (e.target.classList.contains("verMascotas__boton--verMas")) {
            const id = e.target.dataset.id;
            modalMascota.ver(id);
        }
    }

    await paginacion(`pets/familyPlan/${id}`, mensajeVacio, carta, funcionBotones);
}