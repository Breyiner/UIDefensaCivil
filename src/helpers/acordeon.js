export default async () => {
  document.querySelectorAll(".acordeon__nombre").forEach((boton) => {
    boton.addEventListener("click", () => {
      const acordeonContenido = boton.nextElementSibling; //devuelve el siguiente

      if (acordeonContenido.classList.contains("acordeon__contenido--oculto")) {
        acordeonContenido.className = "acordeon__contenido";
      } else if (acordeonContenido.classList.contains("acordeon__contenido")) {
        acordeonContenido.className = "acordeon__contenido--oculto";
      }
    });
  });
}
