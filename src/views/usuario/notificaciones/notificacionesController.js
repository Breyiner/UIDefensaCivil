/**
 * Controlador: Notificaciones (notificacionesController.js)
 * Maneja la lógica base de la vista de notificaciones del usuario.
 * Permite la funcionalidad simple de regresar a la página anterior.
 */
export default async () => {
    // Referencia al botón de retroceso general
    const botonBack = document.getElementById("botonBack");
    botonBack.onclick = () => {
        history.back();
    };
}