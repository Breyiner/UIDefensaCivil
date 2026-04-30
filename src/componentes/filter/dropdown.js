import * as api from "../../helpers/api";
// crear un dropdown para filtrar

export const dropdownFiltro = async() => {
    const dropdown = document.createElement("select");
    dropdown.classList.add("dropdown-filtro");

    // crear una opción para mostrar independientemente del estado
    const todos = document.createElement("option");
    todos.textContent = "Todos"
    todos.value = 0;

    dropdown.append(todos);

    // agarrar los estados de planes familiares desde la DB
    const estados = await api.get("statusPlans")

    estados.forEach(estado => {
        const option = document.createElement("option");
        option.textContent = estado.name;
        option.value = estado.id
        option.classList.add("dropdown-filtro__item")
        dropdown.append(option)
    })

    console.log(estados)

    return dropdown
}

