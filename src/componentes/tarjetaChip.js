/**
 * Componente UI Reutilizable: Tarjeta Chip (tarjetaChip.js)
 * Renderiza una etiqueta compacta interactiva con soporte para edición y eliminación directa.
 * Sigue estrictamente la restricción de usar exclusivamente classList para manipulación de clases.
 * 
 * @param {Object} params
 * @param {string} params.labelText - Texto o información a mostrar en la tarjeta
 * @param {string|number} [params.id] - ID único del recurso
 * @param {boolean} [params.esSupervisor=false] - Oculta la opción de eliminar si es supervisor
 * @param {Function} [params.onEdit] - Callback disparado al hacer click en el cuerpo de la tarjeta
 * @param {Function} [params.onDelete] - Callback disparado al presionar el botón de eliminar
 * @returns {HTMLElement} Elemento DOM del chip
 */
export const tarjetaChip = ({ labelText, id, esSupervisor = false, onEdit, onDelete }) => {
  const tag = document.createElement("div");
  if (id) tag.setAttribute("data-id", id);
  tag.classList.add("gestionarAfecciones__afeccion", "gestionarAfecciones__afeccion--editable");

  const label = document.createElement("span");
  label.classList.add("gestionarAfecciones__tipoNombre");
  label.textContent = labelText;
  tag.appendChild(label);

  tag.addEventListener("click", (e) => {
    if (e.target.closest("button") || e.target.closest("i.ri-close-line")) return;
    if (onEdit) onEdit();
  });

  if (!esSupervisor) {
    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.classList.add("vacuna-tag__eliminar");
    
    const xIcon = document.createElement("i");
    xIcon.classList.add("ri-close-line");
    btnEliminar.appendChild(xIcon);
    
    btnEliminar.addEventListener("click", (e) => {
      e.stopPropagation();
      if (onDelete) onDelete();
    });

    tag.appendChild(btnEliminar);
  }

  return tag;
};

export default tarjetaChip;
