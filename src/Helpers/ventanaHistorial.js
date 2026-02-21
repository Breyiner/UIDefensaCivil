export default async (data, contenedor) => {
    contenedor.innerHTML = "";
    data.forEach(item => {
        const divItem = document.createElement("div");
        divItem.innerHTML = `
            <div class="ventanaHistorial__item">
                <p><strong>Nombre:</strong> ${item.name_model}</p>
                <p><strong>Acción:</strong> ${item.action_execute}</p>
                <p><strong>Usuario:</strong> ${item.user_name}</p>
                <p><strong>Rol:</strong> ${item.rol}</p>
                <p><strong>Fecha:</strong> ${item.date_time}</p>
                ${
                    item.status_old != item.status_new
                        ? `<p><strong>Cambio de estado a:</strong> ${item.status_new}</p>`
                        : ""
                }
                <hr>
            </div>
        `;
        contenedor.appendChild(divItem);
    });
};