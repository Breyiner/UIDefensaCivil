import { paginacion } from "@/helpers/index.js";
import * as alerta from "../../helpers/alertas";
import * as api from "../../helpers/api";

const historial = async (endpoint, nombreSubDato) => {

    
    const container = document.querySelector('.container__paginas');
    const mensajeVacio = "No hay registros en el historial para este elemento.";

    let selectedAuditIds = [];
    let opcionesCont = null;
    let contadorSpan = null;

    const opcionesEliminar = async () => {

        if (document.querySelector('.container-eliminar-panel')) return; 
        //Antes de crear el panel de eliminación, busca si ya existe uno en la pantalla.
        // Si ya existe, salte de la función (return) inmediatamente y no hagas nada más

        opcionesCont = document.createElement('div');
        opcionesCont.classList.add('container-eliminar-panel', 'oculto');

        const btnCerrar = document.createElement('button');
        btnCerrar.classList.add('btnCerrar', 'ri-close-large-line')

        contadorSpan = document.createElement('span');
        contadorSpan.textContent = "Elementos seleccionados: 0";

        const botonera = document.createElement('div');
        botonera.classList.add('botonera--panel__Eliminacion')
        
        const btnSelectAll = document.createElement('button')
        btnSelectAll.textContent='seleccionar todo';

        const btnBorrar = document.createElement('button')
        btnBorrar.classList.add('btn_borrar');

        const borrarIcono = document.createElement('i');
        borrarIcono.classList.add('ri-delete-bin-2-fill');

        const borrarText = document.createElement('p');
        borrarText.textContent = 'Borrar datos';

        btnBorrar.append(borrarIcono, borrarText);

        botonera.append(btnSelectAll, btnBorrar);

        opcionesCont.append(btnCerrar, contadorSpan, botonera);

        container.before(opcionesCont);

        // 1. Botón Cerrar (Limpia toda la selección actual) ______________________________________
        btnCerrar.addEventListener('click', () => {
            selectedAuditIds = [];
            const checkboxes = container.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(chk => {
                chk.checked = false;
                const icon = chk.parentElement.querySelector('.ri-check-line');
                if (icon) icon.classList.add('oculto');
            });
            actualizarPanelSeleccion();
        });

        // 2. Botón Seleccionar Todo ______________________________________________________________
        btnSelectAll.addEventListener('click', () => {

            const checkboxes = container.querySelectorAll('input[type="checkbox"]');
            const todosMarcados = Array.from(checkboxes).every(chk => chk.checked);

            checkboxes.forEach(chk => {
                if (todosMarcados) {
                    // Si ya todos estaban marcados en la página, desmarca
                    if (chk.checked) {
                        chk.checked = false;
                        chk.dispatchEvent(new Event('change'));
                    }
                } else {
                    // Si faltaba alguno, márcalos todos
                    if (!chk.checked) {
                        chk.checked = true;
                        chk.dispatchEvent(new Event('change'));
                    }
                }
            });
        });

        // 3. Botón Borrar Masivo (Borra concurrentemente todos los IDs recolectados)___________________________________
        btnBorrar.addEventListener("click", async () => {
          const totalElementos = selectedAuditIds.length;
          const confirmacion = await alerta.alertaQuest(
            `¿Estás seguro de que deseas eliminar los ${totalElementos} registros seleccionados del historial?`,
          );

          if (!confirmacion.isConfirmed) return;

          try {

            const resultado = await api.bulkDelete("audits/bulk_delete", {
              audit_ids: selectedAuditIds,
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

          selectedAuditIds = [];
          await recargarContainer();
        });

        // btnBorrar.addEventListener('click', async () => {
        //     const totalElementos = selectedAuditIds.length;
        //     const confirmacion = await alerta.alertaQuest(`¿Estás seguro de que deseas eliminar los ${totalElementos} registros seleccionados del historial?`);
            
        //     if (!confirmacion.isConfirmed) return;

        //     try {
        //         let fallos = 0;
        //         // Ejecutamos las peticiones de borrado de forma paralela
        //         await Promise.all(selectedAuditIds.map(async (id) => {
        //             const eliminado = await api.delet(`audits/${id}/delete_audit`);
        //             if (!eliminado.success) fallos++;
        //         }));

        //         if (fallos === 0) {
        //             await alerta.alertaOK("Los registros seleccionados se eliminaron con éxito.");
        //         } else {
        //             await alerta.alertaError(`Se procesó la solicitud, pero no se pudieron eliminar ${fallos} registros.`);
        //         }
        //     } catch (error) {
        //         await alerta.alertaError("Ocurrió un error inesperado al procesar el borrado masivo.");
        //     }

        //     selectedAuditIds = []; // Limpiamos la memoria de seleccionados
        //     await recargarContainer();
        // });
        
        
    }

    const actualizarPanelSeleccion = () => {
        if (contadorSpan) {
            contadorSpan.textContent = "Elementos seleccionados: " + selectedAuditIds.length;
        }

        if (opcionesCont) {
            if (selectedAuditIds.length > 0) {
                opcionesCont.classList.remove('oculto');
            } else {
                opcionesCont.classList.add('oculto');
            }
        }
    };

    const cargarHistorial = async () => {
        container.innerHTML = "";

        await opcionesEliminar();

        await paginacion(endpoint, mensajeVacio, cardHistorial);

        actualizarPanelSeleccion();
    };
    
    const recargarContainer = async () => {
        await cargarHistorial();
    };

    const cardHistorial = (dato) => {
        
        // USER_________________________________________________________
        const card = document.createElement('div');
        card.classList.add('card-Cont');
    
        const userContainer = document.createElement('div');
        userContainer.classList.add('user-Cont');
        
        const userDiv = document.createElement('div');
        userDiv.classList.add('user-div');
    
        const userIcon = document.createElement('i');
        userIcon.classList.add('ri-user-3-fill');
    
        const userInfo = document.createElement('div');
        userInfo.classList.add('user-info');
    
        const userName = document.createElement('p');
        userName.classList.add('user-name');
        userName.textContent = dato.user_name;
    
        const userRol = document.createElement('p');
        userRol.classList.add('user-rol');
        userRol.textContent = dato.rol;
    
        userDiv.append(userIcon);
        userInfo.append(userName, userRol);
        userContainer.append(userDiv, userInfo);
    
        // HISTORIAL_________________________________________________________
        const uniqueId = `checkHistorial-${dato.id}`;
        
        const historialContainer = document.createElement('div');
        historialContainer.classList.add('historial-Cont');

        const sideHistorial = document.createElement('div');
        sideHistorial.classList.add('historial-side');

        const sidePunto = document.createElement('div');
        sidePunto.classList.add('historial-sideElement');

        const checkHistorial = document.createElement('input');
        checkHistorial.type = 'checkbox';
        checkHistorial.id = uniqueId;
        checkHistorial.classList.add('oculto');
        
        // Ahora sí puede leer selectedAuditIds sin romper el código
        checkHistorial.checked = selectedAuditIds.includes(dato.id);

        const labelHistorial = document.createElement('label');
        labelHistorial.htmlFor = uniqueId;
        labelHistorial.style.display = 'block';
        labelHistorial.style.cursor = 'pointer';
        labelHistorial.style.width = '100%';
        labelHistorial.style.height = '100%';

        const iconCheck = document.createElement('i');
        iconCheck.className = 'ri-check-line';

        labelHistorial.appendChild(iconCheck);
        sidePunto.append(checkHistorial, labelHistorial);
        
        // Estado inicial del icono de check
        iconCheck.classList.toggle("oculto", !checkHistorial.checked);
        
        // Evento que reacciona al hacer click en el LABEL
        checkHistorial.addEventListener("change", function () {

            const isChecked = this.checked;
            
            iconCheck.classList.toggle("oculto", !isChecked);

            if (isChecked) {
                selectedAuditIds.push(dato.id);
            } else {
                selectedAuditIds = selectedAuditIds.filter(id => id !== dato.id);
            }

            actualizarPanelSeleccion();
        });

        const sideLine = document.createElement('div');
        sideLine.classList.add('historial-sideElement');
        
        const historialNameAct = document.createElement('div');
        historialNameAct.classList.add('historial-nameAction');
        
        const name = document.createElement('p');
        name.classList.add('name-Historial');
        name.textContent = dato.data_new ?? dato.data_old ?? "Sin registro";

        historialNameAct.append(name);

        
        if (dato.data_old !== null && dato.data_old !== undefined && dato.data_old !== dato.data_new) {
            const oldName = document.createElement("p");
            oldName.classList.add("oldName-Historial");
            oldName.textContent = "Anteriormente: " + dato.data_old;
            historialNameAct.append(oldName);
        }
        
        let subname = null;
        if (dato.subData_new != null) {
            subname = document.createElement('p');
            subname.classList.add('subname-Historial');
            subname.textContent = `${nombreSubDato}: ${dato.subData_new ?? dato.subData_old ?? "Sin registro"}`;
            
            historialNameAct.append(subname);
            
            if (dato.subData_old !== null && dato.subData_old !== undefined) {
                const oldSubname = document.createElement("p");
                oldSubname.textContent = `Anteriormente ${nombreSubDato}: ${dato.subData_old}`;
                historialNameAct.append(oldSubname);
            }
        }
        
        const actionContainer = document.createElement('div');
        actionContainer.classList.add('action-Cont');
        
        const action = document.createElement('p');
        action.classList.add('action-Historial');
        action.textContent = 'Acción: ' + dato.action_execute;
        
        sideHistorial.append(sidePunto, sideLine);
        historialNameAct.append(action);
        historialContainer.append(sideHistorial, historialNameAct);

        const statusContainer = document.createElement('div');
        statusContainer.classList.add('status-Cont');
        
        if (dato.status_new !== null) {
            const statusElement = document.createElement('div');
            statusElement.classList.add('status-Element');
            
            const statusColor = document.createElement('div');
            statusColor.classList.add('status-color');
            
            if (dato.status_new === 'Activo') {
                statusColor.classList.add('status-activo');
            }
            if (dato.status_new === 'Inactivo') {
                statusColor.classList.add('status-inactivo');
            }
            
            const status = document.createElement('p');
            status.classList.add('status-Historial');
            status.textContent = 'Estado nuevo: ' + dato.status_new;

            statusElement.append(statusColor, status);
            statusContainer.append(statusElement);
        }
        
        if (dato.status_old !== null) {
            const statusElement = document.createElement('div');
            statusElement.classList.add('status-Element');
            
            const statusColor = document.createElement('div');
            statusColor.classList.add('status-color');
            
            if (dato.status_old === 'Activo') {
                statusColor.classList.add('status-activo');
            }
            if (dato.status_old === 'Inactivo') {
                statusColor.classList.add('status-inactivo');
            }
            
            const status = document.createElement('p');
            status.classList.add('status-Historial');
            status.textContent = 'Estado anterior: ' + dato.status_old;
            
            statusElement.append(statusColor, status);
            statusContainer.append(statusElement);
        }

        historialContainer.append(statusContainer);
        
        // FECHA_________________________________________________________
        const dateContainer = document.createElement('div');
        dateContainer.classList.add('date-Cont');
    
        const date = document.createElement('p');
        date.classList.add('date-Historial');
        date.textContent = dato.date_time;
    
        const dateIcon = document.createElement('i');
        dateIcon.classList.add('ri-calendar-event-fill');
    
        dateContainer.append(dateIcon, date);

        // BOTON BORRAR DATO_____________________________________________
        // const borrarbtn = document.createElement('button');
        // borrarbtn.classList.add('borrarHistorial');

        // const borrarIcono = document.createElement('i');
        // borrarIcono.classList.add('ri-delete-bin-2-fill');

        // const borrarText = document.createElement('p');
        // borrarText.textContent = 'Borrar dato del historial';

        // borrarbtn.append(borrarIcono, borrarText);

        // borrarbtn.addEventListener('click', async () => {

        //     const confirmacion = await alerta.alertaQuest('¿Estás seguro de que deseas eliminar este registro del historial?');

        //     if (!confirmacion.isConfirmed) return;

        //     const eliminado = await api.delet(`audits/${dato.id}/delete_audit`);

        //     if (eliminado.success) {

        //       await alerta.alertaOK(eliminado.message);

        //       await recargarContainer();

        //     } else {

        //       await alerta.alertaError(
        //         eliminado?.message || "No se pudo eliminar el registro.",
        //       );
        //     }
        // });

        card.append(userContainer, historialContainer, dateContainer);

        return card;
    };

    await cargarHistorial();
};

export default historial;