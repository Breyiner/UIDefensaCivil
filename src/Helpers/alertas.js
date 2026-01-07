import Swal from 'sweetalert2';

export const alertaError = (mensaje) => {
    return Swal.fire({
        icon: "error",
        title: "Error",
        text: mensaje,
        confirmButtonText: 'Ok',
        customClass: {
            confirmButton: 'botonOK'
        }
    });
}

export const alertaOK = (mensaje) => {
    return Swal.fire({
        title: mensaje,
        icon: "success",
        draggable: true,
        confirmButtonText: 'Ok',
        customClass: {
            confirmButton: 'botonOK'
        }
    });
}

export const alertaWarning = (titulo, mensaje) => {
    return Swal.fire({
        icon: "warning",
        title: titulo,
        text: mensaje,
        confirmButtonText: 'Ok',
        customClass: {
            confirmButton: 'botonOK'
        }
    });
}
export const alertaQuest = (mensaje) => {
    return Swal.fire({
        title: "Estas seguro?",
        text: mensaje,
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "No",
        confirmButtonText: "Si",
        customClass: {
            confirmButton: 'botonOK',
            cancelButton: 'botonCancelar'
        }
    });
}

export const alertaMensaje = (mensaje) => {
    return Swal.fire({
        title: mensaje,
        customClass: {
            confirmButton: "botonOK"
        }
    });
}

export const alertaToken = (mensaje) => {
    return Swal.fire({
        position: "top-end",
        icon: "success",
        title: mensaje,
        showConfirmButton: false,
        timer: 500,
    });
}
