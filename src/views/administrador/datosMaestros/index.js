/**
 * Índice de Controladores de Datos Maestros (Administrador)
 * Actúa como un Hub (exportador centralizado) para todos los controladores
 * encargados del mantenimiento (CRUD) de las tablas paramétricas del sistema.
 */
import verController from "./verController.js";
import seccionalesController from "./seccionales/seccionalesController.js";
import organizacionesController from "./organizaciones/organizacionesController.js";
import tiposDocumentoController from "./tiposDocumento/tiposDocumentoController.js";
import calidadesViviendaController from "./calidadesVivienda/calidadesViviendaController.js";
import sectoresController from "./sectores/sectoresController.js";
import preguntasVulnerabilidadController from "./preguntasVulnerabilidad/preguntasVulnerabilidadController.js";
import nacionalidadesController from "./nacionalidades/nacionalidadesController.js";
import tiposAmenazaController from "./tiposAmenaza/tiposAmenazaControlles.js";
import especiesController from "./especies/especiesController.js";
import recursosController from "./recursos/recursosController.js";
import vulnerabilidadesController from "./vulnerabilidades/vulnerabilidadesController.js";

export {
  verController,
  seccionalesController,
  organizacionesController,
  tiposDocumentoController,
  calidadesViviendaController,
  sectoresController,
  preguntasVulnerabilidadController,
  nacionalidadesController,
  tiposAmenazaController,
  especiesController,
  recursosController,
  vulnerabilidadesController
};
