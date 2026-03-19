import * as api from "../../helpers/api";
import * as alerta from "../../helpers/alertas";

export const verEstado_ventana = async (datoMaestro, datoNombre, url, recargar) => {

    const overlay = document.createElement("div");
    overlay.classList.add("overlay_verEstado");

    const ventana = document.createElement("div");
    ventana.classList.add("ventana");

    const nombre = document.createElement("p");
    nombre.textContent = `${datoMaestro} de ${datoNombre.name}`;

    const btnCerrar = document.createElement("button");
    btnCerrar.classList.add("ri-close-line", "btn-cerrar-Estado");
    // btnCerrar.innerHTML = `<i class="ri-close-line"></i>`;

    btnCerrar.onclick = () => { overlay.remove(); }

    const btnContEstado = document.createElement("div");
    btnContEstado.classList.add("btnContEstado");

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.classList.add("btn-editar");

    const btnHistorial = document.createElement("button");
    btnHistorial.textContent = "Ver Historial";
    btnHistorial.classList.add("btn-historial");

    btnHistorial.addEventListener("click", () => {

        location.href = `#/administrador-datosMaestros/historial-seccional/id=${datoNombre.id}`;
        overlay.remove();
    });

    const btnDesactivar = document.createElement("button");
    // btnDesactivar.textContent = datoNombre.status === "Activo" ? "Desactivar" : "Activar";
    btnDesactivar.textContent = datoNombre.is_active ? "Desactivar" : "Activar";
    btnDesactivar.classList.add("btn-desactivar");

    btnDesactivar.addEventListener("click", async () => {

        // datoNombre.is_active;

        const nuevoEstado = datoNombre.is_active ? 0 : 1;

        const data = await api.patch(`${url}/status/${datoNombre.id}`, { is_active: nuevoEstado });

        if (!data.success) {
            await alerta.alertaError(data.message);
            return;
        }

        await alerta.alertaOK(data.message);
    
        // Actualizar estado local y texto del botón
        datoNombre.is_active = nuevoEstado;
        btnDesactivar.textContent = nuevoEstado === 1 ? "Desactivar" : "Activar";

        recargar();
        overlay.remove();
    });

    const btnCancelar = document.createElement("button");
    btnCancelar.textContent = "Cancelar";
    btnCancelar.classList.add("btn-cancelar");
    btnCancelar.style.display = "none";


    const btnGuardar = document.createElement("button");
    btnGuardar.textContent = "Guardar";
    btnGuardar.classList.add("btn-guardar");
    btnGuardar.style.display = "none";

    btnContEstado.append(btnEditar, btnHistorial, btnDesactivar, btnCancelar, btnGuardar);

    ventana.append( nombre, btnContEstado, btnCerrar);

    let inputNombre = null; // Variable para almacenar el input de nombre durante la edición

    btnEditar.addEventListener("click", () => {

        //el espacio de nombre pasa a ser placeholder y los botones pasan a ser cancelar y guardar

        inputNombre = document.createElement("input"); // Crear un nuevo input para editar el nombre
        inputNombre.type = "text";
        inputNombre.value = datoNombre.name;

        nombre.replaceWith(inputNombre);

        btnDesactivar.style.display = "none";
        btnHistorial.style.display = "none";
        btnEditar.style.display = "none";
        btnGuardar.style.display = "block";
        btnCancelar.style.display = "block";
        
    });

    btnGuardar.addEventListener("click", async  () => {

        if (!inputNombre?.value.trim()) {
            await alerta.alertaError("El nombre no puede estar vacío");
            return;
        }

        btnGuardar.disabled = true;

        const data = await api.patch(`${url}/${datoNombre.id}`, { name: inputNombre.value });

        btnGuardar.disabled = false;

        if (!data.success) {
            await alerta.alertaError(data.message);
            return;
        }
        
        await alerta.alertaOK(data.message);
        recargar();
        overlay.remove();
    });


    btnCancelar.addEventListener("click", ()=> {

        inputNombre.replaceWith(nombre);
        inputNombre= null; // Limpiar la variable del input al cancelar

        btnDesactivar.style.display = "block";
        btnHistorial.style.display = "block";
        btnEditar.style.display = "block";
        btnGuardar.style.display = "none";
        btnCancelar.style.display = "none";
    });
        

    overlay.appendChild(ventana);
    document.body.appendChild(overlay);

    // al hacer click en overlay, se cierra la ventana
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    }

}