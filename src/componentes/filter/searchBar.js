// crear una search bar para filtrar

export const searchBar = (filtrado) => {
    const bar = document.createElement("input");
    bar.classList.add("searchbar")
    bar.placeholder = "Apellido de la familia"

    bar.addEventListener("input", e => {
        filtrado(e);
    })

    return bar

}

