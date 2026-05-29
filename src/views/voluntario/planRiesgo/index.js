/**
 * Índice de Controladores de Factores de Riesgo (Voluntario)
 * Archivo Barril que exporta los módulos del CRUD para registrar
 * amenazas externas e internas de la vivienda (Inundación, Deslizamientos, etc)
 * así como Vulnerabilidades y Acciones de Mitigación propias.
 */
import verPlanRiesgo from "./verPlanRiesgo.js";
import crearController from "./crear/crearController.js";
import editarController from "./editar/editarController.js";

export {verPlanRiesgo, crearController, editarController };