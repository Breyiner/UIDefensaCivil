/**
 * Índice de Controladores de Inicialización del Plan Familiar (Voluntario)
 * Archivo central que empaca y exporta los módulos necesarios para CREAR un plan 
 * desde cero. Incluye el registro inicial de la familia, su foto georeferenciada, 
 * los datos de contacto y la ejecución de la prueba final de vulnerabilidad.
 */
import CrearController from "./crear/crearController.js";
import IdentiController from "./identificacion/identificacionController.js";
import TestController from "./testVulnerabilidad/testController.js";

// Agrupación de los módulos para enviarlos al archivo principal
export { CrearController, IdentiController, TestController};