/**
 * Índice de Controladores de Mascotas Familiares (Voluntario)
 * Archivo Barril que exporta los submódulos CRUD para registrar
 * animales de compañía, razas, edades y sus vacunas.
 */
import verPlanMascota from "./verPlanMascota";
import crearController from "./crear/crearController";
import editarController from "./editar/editarController";

export { verPlanMascota, crearController, editarController };