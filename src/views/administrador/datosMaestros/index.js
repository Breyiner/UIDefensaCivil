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
import departamentoController from "./departamentos/departamentoController.js";
import ciudadesController from "./ciudades/ciudadesController.js";
import vulnerabilidadesController from "./vulnerabilidades/vulnerabilidadesController.js";


import historialSeccional from "./seccionales/historial/historialSeccional.js";
import historialOrganizacion from "./organizaciones/historial/historialOrganizacion.js";
import historialPreguntas from "./preguntasVulnerabilidad/historial/historialPreguntas.js";
import historialDocumentos from "./tiposDocumento/historial/historialDocumentos.js";
import historialVivienda from "./calidadesVivienda/historial/historialVivienda.js";
import historialSectores from "./sectores/historial/historialSectores.js";
import historialNacionalidades from "./nacionalidades/historial/historialNacionalidades.js";
import historialAmenaza from "./tiposAmenaza/historial/historialAmenaza.js";
import historialEspecies from "./especies/historial/historialEspecies.js";
import historialRecursos from "./recursos/historial/historialRecursos.js";
import historialVulnerabilidades from "./vulnerabilidades/historial/historialVulnerabilidades.js";
import historialCiudad from "./ciudades/historial/historialCiudad.js";
import historialDepartamento from "./departamentos/historial/historialDepartamento.js";

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
  departamentoController,
  ciudadesController,
  vulnerabilidadesController,
  
  historialSeccional,
  historialOrganizacion,
  historialPreguntas,
  historialDocumentos,
  historialVivienda,
  historialSectores,
  historialNacionalidades,
  historialAmenaza,
  historialEspecies,
  historialRecursos,
  historialVulnerabilidades,
  historialCiudad,
  historialDepartamento,
};
