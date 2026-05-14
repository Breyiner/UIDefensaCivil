// crear una search bar para filtrar

export const searchBar = (filtrado, placeholder) => {
    const bar = document.createElement("input");
    bar.classList.add("searchbar")
    bar.placeholder = placeholder;

    bar.addEventListener("input", e => {
        filtrado(e);
    })

    return bar
}

