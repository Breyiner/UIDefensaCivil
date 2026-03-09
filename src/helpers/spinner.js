let spinner = null;
const layout = document.querySelector(".layout")

export const abrirSpinner = () => {
    spinner = document.createElement("div");
    spinner.className = "spinner"
    layout.append(spinner)
}

export const cerrarSpinner = () => {
    spinner.remove()
}