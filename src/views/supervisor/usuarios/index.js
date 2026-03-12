/**
 * Índice de Controladores de Usuarios para Supervisor
 * Exporta el controlador de gestión de activos y el de peticiones entrantes.
 */

// Importación referenciada de los módulos controladores
import PeticionesController from "./peticiones/peticionesController";
import GestionController from "./gestion/gestionController"

// Export múltiple (Barrel pattern)
export {PeticionesController,GestionController};