/**
 * Índice de Controladores de Plan Familiar del Supervisor
 * Archivo Barril (Barrel File) que exporta las dependencias necesarias 
 * para gestionar el dashboard y la revisión individual de planes creados.
 */

// Importa los controladores secundarios desde sus respectivas carpetas internas
import EstadisticaController from "./../Estadistica/EstadisticaController.js";
import RevisionPlanController from "./RevisionPlan/RevisionPlanController.js"
import ListadoPlanController from "./Listado/ListadoPlanController.js";

// Re-exporta como un módulo consolidado permitiendo destructuración más limpia en el enrutador
export {
    EstadisticaController,
    RevisionPlanController,
    ListadoPlanController
};