import * as api from "../../helpers/api";
// crear un dropdown para filtrar

export const dropdownFiltro = async(items, onChange) => {
    const dropdown = document.createElement("select");
    dropdown.classList.add("dropdown-filtro");

    // crear una opción para mostrar independientemente del estado
    const todos = document.createElement("option");
    todos.textContent = "Todos"
    todos.value = 0;

    dropdown.append(todos);

    // agarrar los estados de planes familiares desde la DB

    items.forEach(item => {
        const option = document.createElement("option");
        option.textContent = item.name;
        option.value = item.id
        option.classList.add("dropdown-filtro__item")
        dropdown.append(option)
    })

    dropdown.addEventListener("change", onChange)

    return dropdown
}
 

