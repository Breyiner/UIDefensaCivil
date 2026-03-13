/**
 * Índice de Gráficos (canvas.js)
 * Archivo distribuidor (Barrel file). Recolecta todos los scripts individuales de gráficos 
 * (barras, donas, temporales) en un mismo nodo y los vuelve a exportar, facilitando
 * la importación limpia en una sola línea de código dentro de los controladores.
 */
import barra from "./canvas/barra.js";
import dona from "./canvas/dona.js"
import lineaTemporal from "./canvas/lineaTemporal.js";

export {barra,dona,lineaTemporal};