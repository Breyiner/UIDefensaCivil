export const eliminarCookies = () => {
document.cookie.split(";").forEach(cookie => {
const nombre = cookie.split("=")[0].trim();
document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${location.pathname}`;
});
}