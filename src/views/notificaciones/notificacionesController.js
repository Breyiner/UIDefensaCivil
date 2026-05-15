import * as api from "../../helpers/api";

const notificacionesController = async () => {
    // console.log('localstorage: ',localStorage)
    // console.log(sessionStorage)
    // console.log(document.cookie)

    const roleId = localStorage.getItem('role_id');
    const userId = localStorage.getItem('id');

    // Administrador ve todas, supervisor/voluntario solo las suyas
    const esAdmin = roleId === '1';

    const endpoint = esAdmin
        ? 'notifications'
        : `notifications/user/${userId}`;

    const data = esAdmin
        ? await api.get(endpoint)
        : await api.getPaginacion(endpoint);

    console.log('Notificaciones:', data);

}

export default notificacionesController;