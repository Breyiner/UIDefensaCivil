/**
 * Une un array de strings con comas, y "y" antes del último elemento.
 * Ej: ["A", "B", "C"] -> "A, B y C"
 * Ej: ["A", "B"] -> "A y B"
 * Ej: ["A"] -> "A"
 */
export const separarLista = (items) => {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];

    const ultimo = items[items.length - 1];
    const resto = items.slice(0, -1);

    return `${resto.join(', ')} y ${ultimo}`;
}

export const formatearLista = (items) => {

    return items.map(item => `${item}`).join('<br>');
}