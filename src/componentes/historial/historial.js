const historial = async (datos, dato_Nombre) => {

    
    const container = document.querySelector('.container-historial');

    const listHistorial = document.createElement('div');
    listHistorial.classList.add('list-Historial');

    
    datos.forEach(dato => {
        
        //elementos creados
        // USER_________________________________________________________
        const card = document.createElement ('div');
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
    
        const historialContainer = document.createElement('div');
        historialContainer.classList.add('historial-Cont');
    
        const name = document.createElement('p');
        name.classList.add('name-Historial');
        name.textContent = dato_Nombre.name;
    
        const actionContainer = document.createElement('div');
        actionContainer.classList.add('action-Cont');

        const actionIcon = document.createElement('i');
        actionIcon.classList.add('ri-corner-down-right-line');

        const action = document.createElement('p');
        action.classList.add('action-Historial');
        action.textContent = 'Acción: ' + dato.action_execute;

        actionContainer.append(actionIcon, action);

        historialContainer.append(name, actionContainer);

        if (dato.status_new !== null) {

            const statusContainer = document.createElement('div');
            statusContainer.classList.add('status-Cont');

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
            statusContainer.append(statusColor, status);

            historialContainer.append(statusContainer);
        }

        if (dato.status_old !== null) {
            const statusContainer = document.createElement('div');
            statusContainer.classList.add('status-Cont');

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

            statusContainer.append(statusColor, status);

            historialContainer.append(statusContainer);
        } 


        // FECHA_________________________________________________________
    
        const dateContainer = document.createElement('div');
        dateContainer.classList.add('date-Cont');
    
        const date = document.createElement('p');
        date.classList.add('date-Historial');
        date.textContent =  dato.date_time;
    
        const dateIcon = document.createElement('i');
        dateIcon.classList.add('ri-calendar-event-fill');
    
        dateContainer.append(dateIcon, date);
    
    
        // append general
        card.append(userContainer, historialContainer, dateContainer);

        listHistorial.appendChild(card);
    });

    container.appendChild(listHistorial);
};

export default historial;