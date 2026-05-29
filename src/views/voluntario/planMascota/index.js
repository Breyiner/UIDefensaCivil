/**
 * Índice de Controladores de Mascotas Familiares (Voluntario)
 * Archivo Barril que exporta los submódulos CRUD para registrar
 * animales de compañía, razas, edades y sus vacunas.
 */

import verPlanMascota from "./verPlanMascota.js";
import crearController from "./crear/crearController.js";
import editarController from "./editar/editarController.js";

export { verPlanMascota, crearController, editarController };