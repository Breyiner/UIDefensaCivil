/**
 * Helper Renderizador de Historial Físico (ventanaHistorial.js)
 * Alternativa al Historial SweetAlert. 
 * Consibe un string gigante inyectando los registros de auditoría y lo plasma 
 * directamente dentro del Nodo DOM (contenedor) pasado por argumento.
 */
export default async (data, contenedor) => {
    // Limpia el contenedor
    contenedor.innerHTML = "";

    // Recorre cada registro de auditoría
    data.forEach(item => {
        // Crea el div contenedor del item con su clase
        const itemDiv = document.createElement("div");
        itemDiv.className = "ventanaHistorial__item";

        // Pares etiqueta-valor para renderizar
        const fields = [
            ["Nombre:", item.name_model],
            ["Acción:", item.action_execute],
            ["Usuario:", item.user_name],
            ["Rol:", item.rol],
            ["Fecha:", item.date_time],
        ];

        // Crea un <p> por cada campo: <strong>etiqueta</strong> valor
        fields.forEach(([label, value]) => {
            const p = document.createElement("p");
            const strong = document.createElement("strong");
            strong.textContent = label + " ";
            p.appendChild(strong);
            p.appendChild(document.createTextNode(value));
            itemDiv.appendChild(p);
        });

        // Si hubo cambio de estado, agrega un <p> extra
        if (item.status_old !== item.status_new) {
            const p = document.createElement("p");
            const strong = document.createElement("strong");
            strong.textContent = "Cambio de estado a: ";
            p.appendChild(strong);
            p.appendChild(document.createTextNode(item.status_new));
            itemDiv.appendChild(p);
        }

        // Línea separadora
        const hr = document.createElement("hr");
        itemDiv.appendChild(hr);

        // Inserta el item en el contenedor principal
        contenedor.appendChild(itemDiv);
    });
};