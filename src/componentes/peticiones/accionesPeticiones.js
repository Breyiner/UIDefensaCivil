import * as alerta from "../../helpers/alertas";
import * as api from "../../helpers/api.js";

export const panelAcciones = (contenedor, ids) => {

    if (document.querySelector('.acciones-panel')) return;

    let selectedUserIds = [];

    const opcionesPanel = document.createElement('div');
    opcionesPanel.classList.add('acciones-panel', 'ocultar_opciones');

    const opcionesCont = document.createElement('div');
    opcionesCont.classList.add('container-acciones-panel');

    const btnCerrar = document.createElement('button');
    btnCerrar.classList.add('btnCerrar', 'ri-close-large-line');

    const contadorSpan = document.createElement('span');
    contadorSpan.classList.add('contadorSpan');
    contadorSpan.textContent = "Elementos seleccionados: 0";

    const botonera = document.createElement('div');
    botonera.classList.add('botonera--panel__Acciones');

    const btnAprobar = document.createElement('button');
    btnAprobar.classList.add('btn_aprobar');
    btnAprobar.innerHTML = '<i class="ri-check-line"></i><p>Aprobar</p>';

    const btnRechazar = document.createElement('button');
    btnRechazar.classList.add('btn_rechazar');
    btnRechazar.innerHTML = '<i class="ri-close-line"></i><p>Rechazar</p>';
    
    const btnSelectAll = document.createElement('button');
    btnSelectAll.classList.add('btn_selectAll');
    btnSelectAll.innerHTML = '<p>Seleccionar todos</p>';
    
    botonera.append(btnSelectAll, btnAprobar, btnRechazar);
    opcionesCont.append(btnCerrar, contadorSpan, botonera);
    opcionesPanel.append(opcionesCont);

    contenedor.before(opcionesPanel);

        contenedor.addEventListener("change", (e) => {
        if (!e.target.matches('input[type="checkbox"]')) return;

        const id = e.target.value; // el checkbox tiene value = info.id

        if (e.target.checked) {
            if (!selectedUserIds.includes(id)) selectedUserIds.push(id);
        } else {
            selectedUserIds = selectedUserIds.filter(uid => uid !== id);
        }

        actualizarPanel();
    });

    const actualizarPanel = () => {
        contadorSpan.textContent = "Elementos seleccionados: " + selectedUserIds.length;
        opcionesPanel.classList.toggle('ocultar_opciones', selectedUserIds.length === 0);
    };

    btnCerrar.addEventListener('click', () => {
        selectedUserIds = [];
        contenedor.querySelectorAll('input[type="checkbox"]').forEach(chk => chk.checked = false);
        actualizarPanel();
    });

    btnSelectAll.addEventListener("click", () => {
        const checkboxes = contenedor.querySelectorAll('input[type="checkbox"]');
        const todosMarcados = Array.from(checkboxes).every((chk) => chk.checked);

        checkboxes.forEach((chk) => {
            if (todosMarcados) {
                if (chk.checked) {
                    chk.checked = false;
                    // ÚNICO CAMBIO: Agregar { bubbles: true }
                    chk.dispatchEvent(new Event("change", { bubbles: true }));
                }
            } else {
                if (!chk.checked) {
                    chk.checked = true;
                    // ÚNICO CAMBIO: Agregar { bubbles: true }
                    chk.dispatchEvent(new Event("change", { bubbles: true }));
                }
            }
        });
    });

    btnRechazar.addEventListener("click", async () => {

        console.log("IDs a rechazar:", selectedUserIds);
        const totalElementos = selectedUserIds.length;
        const confirmacion = await alerta.alertaQuest(`¿Estás seguro de que deseas eliminar los ${totalElementos} registros seleccionados del historial?`);
    
        if (!confirmacion.isConfirmed) return;
    
        try {
    
            const resultado = await api.bulkDelete("users/reject-delete", {
                user_ids: selectedUserIds.map(Number)
            });
    
            if (resultado.success) {
    
                await alerta.alertaOK("Los registros seleccionados se eliminaron con éxito.",);
    
            } else {
                // Si el backend devuelve un error controlado (ej. código 422 o 500)
                await alerta.alertaError(resultado.message || "No se pudieron eliminar los registros.",);
            }
                
        } catch (error) {

            await alerta.alertaError("Ocurrió un error inesperado al procesar el borrado masivo.",);
        }

        selectedUserIds = [];
        // await recargarContainer();
    });
    
    
};