/**
 * Índice de Controladores de Usuarios para el Administrador
 * Exporta el gestor general de usuarios activos y el aprobador de peticiones.
 */
import PeticionesController from "./peticiones/peticionesController.js";
import GestionController from "./gestion/gestionController.js"
import historialUsuario from "./gestion/historial/historialUsuario.js";

export {PeticionesController, GestionController, historialUsuario};