let spinnerDiv = null;

// variable que cuenta cuantas peticiones se estan haciendo para evitar el lag en el spinner
let requestActivas = 0;

// temporizador para que el spinner no aparezca como parpadeo
let timer = null;

export const abrirSpinner = () => {
    requestActivas++;

    if (requestActivas === 1) {
        timer = setTimeout(() => {
            if (!spinnerDiv) {
                const layout = document.querySelector(".layout");
                spinnerDiv = document.createElement("div");
                spinnerDiv.className = "spinner-background";
                const spinnerHijo = document.createElement("div");
                spinnerHijo.classList.add("spinner-background__spinner");
                spinnerDiv.append(spinnerHijo);
                layout.append(spinnerDiv);
            }
        }, 200);
    }
};

export const cerrarSpinner = () => {
    if (requestActivas > 0) {
        requestActivas--;
    }

    // validar que no haya ninguna request y que el div del spinner exista para removerlo
    if (requestActivas === 0) {
        clearTimeout(timer);

        setTimeout(() => {
            if (requestActivas === 0 && spinnerDiv) {
                spinnerDiv.remove();
                spinnerDiv = null;
            }
        }, 100); // ← espera 100ms antes de cerrar
    }

    // if (requestActivas === 0){

    //     clearTimeout(timer);

    //     if (spinnerDiv){

    //         spinnerDiv.remove();
    //         spinnerDiv = null;
    //     }
    // }
};
