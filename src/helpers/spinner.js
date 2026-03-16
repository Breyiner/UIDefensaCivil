let spinnerDiv = null;
const layout = document.querySelector(".layout")

export const abrirSpinner = () => {
    spinnerDiv = document.createElement("div");
    spinnerDiv.className = "spinner-background"
    spinnerDiv.innerHTML = `<div class="spinner-background__spinner"></div>`
    layout.append(spinnerDiv)
}

export const cerrarSpinner = () => {

    // obtener todos los spinners que se estén ejecutando en el momento y cerrarlos
    const spinners = document.querySelectorAll(".spinner-background");

    if (spinners) {
        spinners.forEach(spinner => {
            spinner.remove()
        })
    }

}