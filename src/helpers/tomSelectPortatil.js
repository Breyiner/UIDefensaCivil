import TomSelect from 'tom-select';

export const initTomSelectPortatil = () => {
    const elements = document.querySelectorAll(".selector-portatil");

    elements.forEach(el => {

        if (el.tomselect) return;

        new TomSelect(el, {
            create: false,
            sortField: { field: "text", direction: "asc" }
        });
    });
};