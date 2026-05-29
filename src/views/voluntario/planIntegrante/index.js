/**
 * Índice de Controladores de Integrantes de la Familia (Voluntario)
 * Archivo Barril que exporta los módulos del CRUD para gestionar 
 * a cada persona que compone el núcleo familiar (Miembros).
 */
import verPlanIntegrantes from "./verPlanIntegrantes.js";
import crearController from "./crear/crearController.js";
import editarController from "./editar/editarController.js";

export { verPlanIntegrantes, crearController, editarController };