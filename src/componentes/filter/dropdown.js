import * as api from "../../helpers/api";
// crear un dropdown para filtrar

// items es un array de objetos.
// cada objeto debe tener almenos una propiedad name y otra id

export const dropdownFiltro = async(onChange) => {
    const dropdown = document.createElement("select");
    dropdown.classList.add("dropdown-filtro");

    // crear una opción para mostrar independientemente del estado
    const todos = document.createElement("option");
    todos.textContent = "Todos"
    todos.value = 0;

    dropdown.append(todos);

    dropdown.addEventListener("change", onChange)

    return dropdown
}
 

