/**
 * Índice de Controladores de Plan de Acción (Voluntario)
 * Archivo Barril que consolida la exportación de las 3 fases 
 * del Plan de Acción frente a un riesgo: Antes, Durante y Después.
 */

// Importaciones de los submódulos controladores
import antes from "./antes/antes.js";
import durante from "./durante/durante.js";
import despues from "./despues/despues.js";
import planAccionController from "./planAccionController.js";

// Exportación centralizada
export {antes, durante, despues, planAccionController};