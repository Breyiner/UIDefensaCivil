/**
 * Helper Renderizador de Historial Físico (ventanaHistorial.js)
 * Alternativa al Historial SweetAlert. 
 * Consibe un string gigante inyectando los registros de auditoría y lo plasma 
 * directamente dentro del Nodo DOM (contenedor) pasado por argumento.
 */
export default async (data, contenedor) => {
    contenedor.innerHTML = ""; // Purga el contenedor original de HTML
    // Transita sobre el arreglo arrojado por el JSON del endpoint "Tabla/history"
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
                    // Pequeña variante inyectada en string literal: Si detectó una mutación real de estado la describe (Ej: Activo a Suspendido)
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