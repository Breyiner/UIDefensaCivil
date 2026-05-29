/**
 * Índice de Controladores de Recursos Disponibles (Voluntario)
 * Archivo Barril que exporta los módulos del CRUD para listar
 * y gestionar los recursos cercanos a la vivienda familiar (hospitales, policia, etc).
 */

import verController from "./verPlanRecurso.js";
import crearController from "./crear/crearController.js";
import editarController from "./editar/editarController.js";

export { verController, crearController, editarController };