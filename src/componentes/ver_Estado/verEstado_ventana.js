import * as api from "../../helpers/api";
import * as alerta from "../../helpers/alertas";

/* =====================================================
BASE COMÚN
==================================================== */

const verEstadoVentana = (datoMaestro, recargar, urlHistorial, datoText, configurarEdicion) => {

    const overlay = document.createElement("div");
    overlay.classList.add("overlay_verEstado");

    const ventana = document.createElement("div");
    ventana.classList.add("ventana");

    const btnCerrarCont = document.createElement("div");
    btnCerrarCont.classList.add("btn-cerrar-Cont");

    const btnCerrar = document.createElement("button");
    btnCerrar.classList.add("ri-close-line", "btn-cerrar-Estado");
    btnCerrar.onclick = () => overlay.remove();
    btnCerrarCont.append(btnCerrar);

    const btnContEstado = document.createElement("div");
    btnContEstado.classList.add("btnContEstado");

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.classList.add("btn-editar");

    const btnHistorial = document.createElement("button");
    btnHistorial.textContent = "Ver Historial";
    btnHistorial.classList.add("btn-historial");
    btnHistorial.addEventListener("click", () => {
        location.href = urlHistorial;
        overlay.remove();
    });

    const btnDesactivar = document.createElement("button");
    btnDesactivar.textContent = datoMaestro.is_active ? "Desactivar" : "Activar";
    btnDesactivar.classList.add(datoMaestro.is_active ? "btn-desactivar" : "btn-activar");
    btnDesactivar.addEventListener("click", async () => {

        const nuevoEstado = datoMaestro.is_active ? 0 : 1;
        const data = await api.patch(`${datoText.urlDato}/status/${datoMaestro.id}`, { is_active: nuevoEstado });

        if (!data.success) {
            await alerta.alertaError(data.message);
            return;
        }

        await alerta.alertaOK(data.message);
        btnDesactivar.textContent = nuevoEstado === 1 ? "Desactivar" : "Activar";
        btnDesactivar.classList.toggle("btn-desactivar", nuevoEstado === 1);
        btnDesactivar.classList.toggle("btn-activar", nuevoEstado === 0);

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

    // la lógica específica construye el contenido y lo monta en ventana
    configurarEdicion({
        ventana, overlay, btnCerrarCont, btnContEstado,
        btnEditar, btnGuardar, btnCancelar,
        btnDesactivar, btnHistorial
    });

    overlay.appendChild(ventana);
    document.body.appendChild(overlay);

    overlay.onclick = (e) => {
        if (e.target === overlay) overlay.remove();
    };
};

export default verEstadoVentana;