const historial = async (datosHistorial, datoMaestro, nombreSubDato, nombreDB, subnombreDB) => {

    
    const container = document.querySelector('.container-historial');

    const listHistorial = document.createElement('div');
    listHistorial.classList.add('list-Historial');

    
    datosHistorial.forEach(dato => {
        
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

        const sideHistorial = document.createElement('div');
        sideHistorial.classList.add('historial-side');

        const sidePunto = document.createElement('div');
        sidePunto.classList.add('historial-sideElement');

        const sideLine = document.createElement('div');
        sideLine.classList.add('historial-sideElement');
        
        const historialNameAct = document.createElement('div');
        historialNameAct.classList.add('historial-nameAction');
        
        const name = document.createElement('p');
        name.classList.add('name-Historial');
        name.textContent = datoMaestro[nombreDB];
        
        if(nombreDB=="description") {
            
            name.classList.add('name-Description');
        };
        
        const actionContainer = document.createElement('div');
        actionContainer.classList.add('action-Cont');
        
        const action = document.createElement('p');
        action.classList.add('action-Historial');
        action.textContent = 'Acción: ' + dato.action_execute;
        
        sideHistorial.append(sidePunto, sideLine);

        historialNameAct.append(name);

        let subname = null;

        if(subnombreDB!=null){

            subname = document.createElement('p');
            subname.classList.add('subname-Historial');
            subname.textContent = `${nombreSubDato}: ${subnombreDB}`;

            historialNameAct.append(subname);
        }

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