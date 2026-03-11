/**
 * Helper de Inicialización Rápida TomSelect (tomSelectPortatil.js)
 * Script global que busca en todo el DOM elementos de etiqueta `<select>` provistos 
 * con la clase `.selector-portatil` y los convierte mágicamente en combos interactivos sofisticados 
 * con buscador incluido, delegando esto a la librería JS 'TomSelect'.
 */
import TomSelect from 'tom-select';

export const initTomSelectPortatil = () => {
    const elements = document.querySelectorAll(".selector-portatil");

    elements.forEach(el => {
        
        // Bloqueo de seguridad: Evita doble-inicializar el mismo componente
        if (el.tomselect) return;

        new TomSelect(el, {
            create: false, // Desactiva que el usuario pueda tipear opciones personalizadas e insertarlas
            sortField: { field: "text", direction: "asc" } // Fuerza el acomodo alfabético A-Z usando los <labels> text
        });
    });
};