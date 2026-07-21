import * as api from "../api";
import * as alerta from "../alertas";

/* =====================================================
   CREAR
==================================================== */
// Permite a usuarios con roles administrativos crear una nueva ciudad dependiente de un departamento
const ciudad = async (recargarContainer) => {

    // Obtener los departamentos (dropdown parametrizado) de la BD para popular el campo <select>
    const departamentos = await api.get("departments");

    const explicacionDiv = document.createElement("div");
    explicacionDiv.classList.add("modal-edicion__cabecera");

    const tituloP = document.createElement("p");
    tituloP.classList.add("modal-edicion__titulo");
    tituloP.textContent = "Crear Ciudad";
    explicacionDiv.appendChild(tituloP);

    const formDiv = document.createElement("div");
    formDiv.classList.add("form");

    const inputBoxDiv = document.createElement("div");
    inputBoxDiv.classList.add("form__inputBox", "modal-50");

    const iconBuilding = document.createElement("i");
    iconBuilding.classList.add("ri-map-pin-fill");

    const inputNombre = document.createElement("input");
    inputNombre.type = "text";
    inputNombre.classList.add("form__input", "form__nombre");
    inputNombre.placeholder = "Nombre de la ciudad";
    inputNombre.autocomplete = "off";

    inputBoxDiv.append(iconBuilding, inputNombre);
    formDiv.appendChild(inputBoxDiv);

    const selectBoxDiv = document.createElement("div");
    selectBoxDiv.classList.add("form__inputBox");

    const iconArticle = document.createElement("i");
    iconArticle.classList.add("ri-map-2-fill");

    const select = document.createElement("select");
    select.classList.add("form__input", "form__departamento");

    departamentos.forEach(dep => {
        const opt = document.createElement("option");
        opt.value = dep.id;
        opt.textContent = dep.name;
        select.appendChild(opt);
    });

    selectBoxDiv.append(iconArticle, select);
    formDiv.appendChild(selectBoxDiv);

    const container = document.createElement("div");
    container.append(explicacionDiv, formDiv);

    // Envía configuración base a la pantalla de alertas
    alerta.Crear(container, async () => {

        // Adquiere los campos escritos u opciones escogidas del DOM temporal (SweetAlert window)
        const nombre = document.querySelector(".form__nombre").value;
        const departamento = document.querySelector(".form__departamento").value;

        // Trata de insertar por POST en la API mandando Name + Primary Key foránea de Departamento
        const data = await api.post("cities", { name: nombre, department_id: departamento });

        if (data.success) {
            await alerta.alertaOK(data.message); // Creación aprobada
            await recargarContainer(); // Actualiza
        } else {
            alerta.alertaWarning(data.message, data.errors); // Alerta y expone array de errores devuelto por la Request
        }

    });
};

export default ciudad;