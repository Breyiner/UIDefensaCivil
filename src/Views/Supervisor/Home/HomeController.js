export default () => {
    const explicaciontitulo = document.querySelector(".explicacion__titulo");
    const nombre = localStorage.getItem("full_name");
    const genero = localStorage.getItem("gender_id");

    if (genero == 2) {
        explicaciontitulo.innerHTML += "a " + nombre;
    } else {
            explicaciontitulo.innerHTML += " " + nombre;
    }

    const botonVoluntarios = document.getElementById("voluntarios");
    const botonPeticiones = document.getElementById("peticiones");
    const botonPlanFamiliar = document.getElementById("planFamiliar");

    botonVoluntarios.addEventListener("click", () => {
        window.location.href = `#/supervisor-usuarios/gestion`;
    });
    botonPeticiones.addEventListener("click", () => {
        window.location.href = `#/supervisor-usuarios/peticiones`;
    });
    botonPlanFamiliar.addEventListener("click", () => {
        window.location.href = `#/supervisor-revisionPlan/`;
    });
};
