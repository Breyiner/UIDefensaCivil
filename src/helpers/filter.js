/**
 * Filtra un array de objetos según criterios dinámicos.
 * @param {Object[]} datos        - Array de objetos a filtrar
 * @param {Object}   criterios    - { propiedad: valor, ... }  (valor null/undefined = ignorar ese criterio)
 * @param {Object}   [opciones]
 * @param {boolean}  [opciones.busquedaParcial=true]  - Si true, "name" usa includes() en lugar de ===
 * @returns {Object[]}
 */

export const filtrarDatos = (datos, criterios, { busquedaParcial = true } = {}) => {
  return datos.filter((item) =>
    Object.entries(criterios).every(([clave, valor]) => {
      // Ignorar criterios vacíos
      if (valor === null || valor === undefined || valor === "" || valor == 0) return true;
      
      const valorItem = item[clave];

      // Búsqueda parcial solo para strings cuando la opción está activa
      if (busquedaParcial && typeof valorItem === "string") {
        return valorItem.toLowerCase().includes(String(valor).toLowerCase());
      }

      // Comparación estricta para números/IDs
      return String(valorItem) === String(valor);
    })
  );
};