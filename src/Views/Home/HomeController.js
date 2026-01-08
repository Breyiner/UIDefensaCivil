export const homeController = () => {
const eliminarTodasLasCookies = () => {
  document.cookie.split(";").forEach(cookie => {
    const nombre = cookie.split("=")[0].trim();

    // Borrar en path raíz
    document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;

    // Borrar en path actual (por compatibilidad)
    document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${location.pathname}`;
  });
};
window.addEventListener("click", async (e) => {
    if (e.target.matches("#cerrarSesion")) 
        {
            window.location.href = '#/login';
            eliminarTodasLasCookies();
        }
});
}