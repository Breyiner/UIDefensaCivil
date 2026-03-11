/**
 * Helper de Menú Acordeón (acordeon.js)
 * Script global que rastrea todos los botones de clase `.acordeon__nombre` en la vista actual
 * y les asigna el evento de ocultar o mostrar su panel de detalles adjunto intercalando CSS.
 */
export default async () => {
  document.querySelectorAll(".acordeon__nombre").forEach((boton) => {
    boton.addEventListener("click", () => {
      // Agarra el nodo inmediatamente inferior en el árbol HTML (El contenedor de la información)
      const acordeonContenido = boton.nextElementSibling; 

      // Efecto Toggle manual (Encendido/Apagado) de las clases CSS de visibilidad
      if (acordeonContenido.classList.contains("acordeon__contenido--oculto")) {
        acordeonContenido.className = "acordeon__contenido";
      } else if (acordeonContenido.classList.contains("acordeon__contenido")) {
        acordeonContenido.className = "acordeon__contenido--oculto";
      }
    });
  });
}
