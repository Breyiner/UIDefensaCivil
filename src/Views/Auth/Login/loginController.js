import Swal from 'sweetalert2';

export const loginController = () => {
const form = document.querySelector('.form');
const correo = document.querySelector('.input__correo');
const contrasena = document.querySelector('.input_contrasena');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const datosUsuario = {
        email: correo.value,
        password: contrasena.value
    };
    console.log(datosUsuario);

    try {
        const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosUsuario)
        });

        const data = await response.json();
        
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: 'OK',
                text: data.message || 'Login correcto'
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.message || 'Credenciales incorrectas'
            });
        }

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo conectar con el servidor'
        });
        console.error(error);
    }
});
}