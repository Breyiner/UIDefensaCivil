/**
 * Helper de Inicialización Rápida TomSelect (tomSelectPortatil.js)
 * Script global que busca en todo el DOM elementos de etiqueta `<select>` provistos 
 * con la clase `.selector-portatil` y los convierte mágicamente en combos interactivos sofisticados 
 * con buscador incluido, delegando esto a la librería JS 'TomSelect'.
 */
import TomSelect from 'tom-select';

import TomSelectDropdownInput from 'tom-select/dist/esm/plugins/dropdown_input/plugin';

// Registra el plugin globalmente (solo una vez)
TomSelect.define('dropdown_input', TomSelectDropdownInput);

export const initTomSelectPortatil = () => {
    const elements = document.querySelectorAll("select.selector-portatil");

    elements.forEach(el => {
        
        // Bloqueo de seguridad: Evita doble-inicializar el mismo componente
        if (el.tomselect) return;

        new TomSelect(el, {
            create: false, // Desactiva que el usuario pueda tipear opciones personalizadas e insertarlas
            sortField: { field: "text", direction: "asc" }, // Fuerza el acomodo alfabético A-Z usando los <labels> text
            plugins: ['dropdown_input'] // El input de búsqueda vive dentro del dropdown, no superpuesto al control
        });
    });
};