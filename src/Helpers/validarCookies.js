export const validarCookies = () => { 
 const cookie = document.cookie;
 if (!cookie)
 {
    return false;
 }
 return true;
};