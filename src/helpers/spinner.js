let spinnerDiv = null;

// variable que cuenta cuantas peticiones se estan haciendo para evitar el lag en el spinner
let requestActivas = 0;

// temporizador para que el spinner no aparezca como parpadeo
let timer = null;

const layout = document.querySelector(".layout")

export const abrirSpinner = () => {
    requestActivas ++;

    if (requestActivas === 1) {

        timer = setTimeout(() => {
    
            if (!spinnerDiv){
                spinnerDiv = document.createElement("div");
                spinnerDiv.className = "spinner-background"
                spinnerDiv.innerHTML = `<div class="spinner-background__spinner"></div>`
                layout.append(spinnerDiv)
            }
        }, 200);
    }

    
}

export const cerrarSpinner = () => {
    

    if (requestActivas > 0){
        requestActivas --;
    }
    // validar que no haya ninguna request y que el div del spinner exista para removerlo
    if (requestActivas === 0){

        clearTimeout(timer);

        if (spinnerDiv){

            spinnerDiv.remove();
            spinnerDiv = null;
        }
    }

}