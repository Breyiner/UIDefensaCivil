export const obtener = (name) => {
  let stringCookies = document.cookie;

  let arrayCookies = stringCookies.split("; ");

  let cookie = null;

  arrayCookies.forEach((elemento) => {
    let [key, value] = elemento.split("=");

    if (key == name) cookie = value;
  });

  return decodeURIComponent(cookie);
};

export const existe = () => {
  const cookie = document.cookie;
  if (!cookie) {
    return false;
  }
  return true;
};
