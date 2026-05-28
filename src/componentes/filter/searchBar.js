// Crea una barra de búsqueda (input) dinámicamente y le asocia un evento de escucha para detectar cuando el usuario escribe.
// Recibe la función callback 'onInput' que se ejecuta al escribir, y un 'placeholder' opcional para el texto de ayuda.
export const searchBar = (onInput, placeholder = "Buscar...") => {
    // Instancia un elemento de entrada de texto en el DOM para que el usuario escriba su búsqueda
    const bar = document.createElement("input");
    bar.classList.add("searchbar")
    bar.placeholder = placeholder;

    bar.addEventListener("input", onInput)

    return bar
}

