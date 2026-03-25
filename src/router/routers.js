/**
 * Módulo de Configuración de Rutas (routers.js)
 * Define el diccionario principal de rutas accesibles en la aplicación.
 * Asocia cada segmento de URL con su respectiva vista HTML, su controlador 
 * JavaScript y sus permisos de acceso (Roles/Privilegios).
 */

// ==========================================
// IMPORTACIÓN DE CONTROLADORES
// ==========================================

// Importa controladores del módulo de Autenticación (Login, Registro, Recuperar Contraseña)
import * as auth from "../views/auth/index.js"

// Importa controladores de los paneles principales (Dashboards) según el rol
import VoluntarioHomeController from "../views/voluntario/home/homeController.js";
import AdministradorHomeController from "../views/administrador/home/homeController.js"
import SupervisorHomeController from "../views/supervisor/home/homeController.js"

// Importa los sub-módulos pertenecientes al flujo del "Plan Familiar" (Rol Voluntario)
import * as planFamiliar from "../views/voluntario/planFamiliar/index.js";
import * as verPlan from "../views/voluntario/verPlanFamiliar/index.js";
import * as planDatos from "../views/voluntario/planDatos/index.js";
import * as Planintegrante from "../views/voluntario/planIntegrante/index.js";
import * as planMascota from "../views/voluntario/planMascota/index.js";
import * as planRiesgo from "../views/voluntario/planRiesgo/index.js";
import * as planRecurso from "../views/voluntario/planRecurso/index.js";
import * as PlanEntorno from "../views/voluntario/planEntorno/index.js";
import * as PlanGrafico from "../views/voluntario/planGrafico/index.js";
import * as planAccion from "../views/voluntario/planAccion/index.js"

// Importa módulos administrativos y de supervisión de Usuarios y Planes
import * as SupervisorUsuarios from "../views/supervisor/usuarios/index.js"
import * as supervisorPlanFamiliar from "../views/supervisor/PlanFamiliar/index.js"
import * as datosMaestros from "../views/administrador/datosMaestros/index.js"
import * as AdministradorUsuarios from "../views/administrador/usuarios/index.js"
import * as usuario from "../views/usuario/index.js"


// Configuraciones predefinidas de permisos para cada ruta
const publicRoute = { private: false, permissions: [] };
const voluntarioRoute = { private: true, permissions: ['voluntario'] };
const supervisorRoute = { private: true, permissions: ['supervisor']  };
const adminRoute = { private: true, permissions: ['admin']};



// ==========================================
// DICCIONARIO DE RUTAS (routes)
// ==========================================
// Estructura: 
// "segmento-url": { 
//    path: "ruta/al/html", 
//    controlador: funcionJS, 
//    private: true/false (Requiere login), 
//    can: "permiso" (Opcional, requiere este rol/permiso) 
// }
export const routes = {
  // === Rutas Públicas (Autenticación) ===
  "": {
    path: `auth/login/index.html`,
    controlador: auth.loginController,
    config: publicRoute,
  },
  "login": {
    path: `auth/login/index.html`,
    controlador: auth.loginController,
    config: publicRoute
  },
  "register": {
    path: `auth/register/index.html`,
    controlador: auth.registerController,
    config: publicRoute,
  },
  "forgotPassword": {
    path: `auth/forgotPassword/index.html`,
    controlador: auth.forgotPasswordController,
    config: publicRoute
  },
  "verifyCode": {
    path: `auth/verifyCode/index.html`,
    controlador: auth.verifyCodeController,
    config: publicRoute
  },
  "changePassword": {
    path: `auth/changePassword/index.html`,
    controlador: auth.changePasswordController,
    config: publicRoute
  },


  // === Rutas de Perfil (Comunes) ===
  "usuarios":{
    "perfil": {
      path: `usuario/perfil/index.html`,
      controlador: usuario.perfilController,
      config: publicRoute
    },
    "notificaciones":{
      path: `usuario/notificaciones/index.html`,
      controlador: usuario.notificacionesController,
      config: publicRoute
    }
  },
  // =========================================================
  // === RUTAS DEL ROL: VOLUNTARIO ===
  // =========================================================
  'voluntario-home': {
    path: `voluntario/home/index.html`,
    controlador: VoluntarioHomeController,
    config: { ...voluntarioRoute, permissions: ["home-frontend.voluntario"] },
  },

  "voluntario-planFamiliar": {
    crear: {
      path: `voluntario/planFamiliar/crear/index.html`,
      controlador: planFamiliar.CrearController,
      config: { ...voluntarioRoute, permissions: ["family-plans.store"] },
    },
    identificacion: {
      path: `voluntario/planFamiliar/identificacion/index.html`,
      controlador: planFamiliar.IdentiController,
      config: { ...voluntarioRoute, permissions: ["family-plans.identify"] },
    },
    georeferenciacion: {
      path: `voluntario/planFamiliar/georeferenciacion/index.html`,
      controlador: planFamiliar.GeoreController,
      config: { ...voluntarioRoute, permissions: ["family-plans.destroy"] },
    },
    testVunerabilidad: {
      path: `voluntario/planFamiliar/testVulnerabilidad/index.html`,
      controlador: planFamiliar.TestController,
      config: { ...voluntarioRoute, permissions: ["family-plans.destroy"] },
    },
  },

  "voluntario-verPlanFamiliar": {
    "": {
      path: `voluntario/verPlanFamiliar/index.html`,
      controlador: verPlan.VerPlanFamiliar,
      config: { ...voluntarioRoute, permissions: ["family-plans.show"] },
    },
    menu: {
      path: `voluntario/verPlanFamiliar/menu/index.html`,
      controlador: verPlan.MenuController,
      config: { ...voluntarioRoute, permissions: ["family-plans.show"] },
    },
  },

  "voluntario-planDatos": {
    ver: {
      path: `voluntario/planDatos/editar/index.html`,
      controlador: planDatos.EditarController,
      config: { ...voluntarioRoute, permissions: ["family-plans.show"] },
    },
  },

  "voluntario-planIntegrante": {
    ver: {
      path: `voluntario/planIntegrante/index.html`,
      controlador: Planintegrante.verPlanIntegrantes,
      config: { ...voluntarioRoute, permissions: ["family-plans.show"] },
    },
    crear: {
      path: `voluntario/planIntegrante/crear/index.html`,
      controlador: Planintegrante.crearController,
      config: { ...voluntarioRoute, permissions: ["family-plans.store"] },
    },
    editar: {
      path: `voluntario/planIntegrante/editar/index.html`,
      controlador: Planintegrante.editarController,
      config: { ...voluntarioRoute, permissions: ["family-plans.store"] },
    },
  },

  "voluntario-planMascota": {
    ver: {
      path: `voluntario/planMascota/index.html`,
      controlador: planMascota.verPlanMascota,
      config: { ...voluntarioRoute, permissions: ["family-plans.show"] },
    },
    crear: {
      path: `voluntario/planMascota/crear/index.html`,
      controlador: planMascota.crearController,
      config: { ...voluntarioRoute, permissions: ["family-plans.store"] },
    },
    editar: {
      path: `voluntario/planMascota/editar/index.html`,
      controlador: planMascota.editarController,
      config: { ...voluntarioRoute, permissions: ["family-plans.store"] },
    },
  },

  "voluntario-planRiesgo": {
    ver: {
      path: `voluntario/planRiesgo/index.html`,
      controlador: planRiesgo.verPlanRiesgo,
      config: { ...voluntarioRoute, permissions: ["family-plans.show"] },
    },
    crear: {
      path: `voluntario/planRiesgo/crear/index.html`,
      controlador: planRiesgo.crearController,
      config: { ...voluntarioRoute, permissions: ["family-plans.store"] },
    },
    editar: {
      path: `voluntario/planRiesgo/editar/index.html`,
      controlador: planRiesgo.editarController,
      config: { ...voluntarioRoute, permissions: ["family-plans.store"] },
    },
  },

  "voluntario-planRecurso": {
    ver: {
      path: `voluntario/planRecurso/index.html`,
      controlador: planRecurso.verController,
      config: { ...voluntarioRoute, permissions: ["family-plans.show"] },
    },
    crear: {
      path: `voluntario/planRecurso/crear/index.html`,
      controlador: planRecurso.crearController,
      config: { ...voluntarioRoute, permissions: ["family-plans.store"] },
    },
    editar: {
      path: `voluntario/planRecurso/Editar/index.html`,
      controlador: planRecurso.editarController,
      config: { ...voluntarioRoute, permissions: ["family-plans.store"] },
    },
  },

  "voluntario-planEntorno": {
    editar: {
      path: `voluntario/planEntorno/editar/index.html`,
      controlador: PlanEntorno.EditarController,
      config: { ...voluntarioRoute, permissions: ["home-frontend.voluntario"] },
    },
  },

  "voluntario-planGrafico": {
    ver: {
      path: `voluntario/planGrafico/index.html`,
      controlador: PlanGrafico.verController,
      config: { ...voluntarioRoute, permissions: ["home-frontend.voluntario"] },
    },
    crear: {
      path: `voluntario/planGrafico/crear/index.html`,
      controlador: PlanGrafico.crearController,
      config: { ...voluntarioRoute, permissions: ["home-frontend.voluntario"] },
    },
    editar: {
      path: `voluntario/planGrafico/editar/index.html`,
      controlador: PlanGrafico.editarController,
      config: { ...voluntarioRoute, permissions: ["home-frontend.voluntario"] },
    },
  },

  "voluntario-planAccion":{
    antes: {
      path: `Voluntario/planAccion/index.html`,
      controlador: planAccion.antes,
      config: { ...voluntarioRoute, permissions: ["home-frontend.voluntario"] },
    },
    durante: {
      path: `Voluntario/planAccion/index.html`,
      controlador: planAccion.durante,
      config: { ...voluntarioRoute, permissions: ["home-frontend.voluntario"] },
    },
    despues: {
      path: `Voluntario/planAccion/index.html`,
      controlador: planAccion.despues,
      config: { ...voluntarioRoute, permissions: ["home-frontend.voluntario"] },
    }
  },

  "supervisor-usuarios": {
    peticiones: {
      path: `supervisor/usuarios/peticiones/index.html`,
      controlador: SupervisorUsuarios.PeticionesController,
      config: { ...supervisorRoute, permissions: ["home-frontend.voluntario"] },
    },
    gestion: {
      path: `supervisor/usuarios/gestion/index.html`,
      controlador: SupervisorUsuarios.GestionController,
      config: { ...supervisorRoute, permissions: ["home-frontend.voluntario"] },
    },
  },

  "administrador-home": {
    path: `administrador/home/index.html`,
    controlador: AdministradorHomeController,
    config: { ...adminRoute, permissions: ["home-frontend.voluntario"] },
  },

  "administrador-datosMaestros": {
    "": {
      path: `administrador/datosMaestros/index.html`,
      controlador: datosMaestros.verController,
      config: { ...adminRoute, permissions: ["home-frontend.voluntario"] },
    },
    seccionales: {
      path: `administrador/datosMaestros/seccionales/index.html`,
      controlador: datosMaestros.seccionalesController,
      config: { ...adminRoute, permissions: ["home-frontend.voluntario"] },
    },
    organizaciones: {
      path: `administrador/datosMaestros/organizaciones/index.html`,
      controlador: datosMaestros.organizacionesController,
      config: { ...adminRoute, permissions: ["home-frontend.voluntario"] },
    },
    tiposDocumento: {
      path: `administrador/datosMaestros/tiposDocumento/index.html`,
      controlador: datosMaestros.tiposDocumentoController,
      config: { ...adminRoute, permissions: ["home-frontend.voluntario"] },
    },
    calidadesVivienda: {
      path: `administrador/datosMaestros/calidadesVivienda/index.html`,
      controlador: datosMaestros.calidadesViviendaController,
      config: { ...adminRoute, permissions: ["home-frontend.voluntario"] },
    },
    sectores: {
      path: `administrador/datosMaestros/sectores/index.html`,
      controlador: datosMaestros.sectoresController,
      config: { ...adminRoute, permissions: ["home-frontend.voluntario"] },
    },
    preguntasVulnerabilidad: {
      path: `administrador/datosMaestros/preguntasVulnerabilidad/index.html`,
      controlador: datosMaestros.preguntasVulnerabilidadController,
      config: { ...adminRoute, permissions: ["home-frontend.voluntario"] },
    },
    nacionalidades: {
      path: `administrador/datosMaestros/nacionalidades/index.html`,
      controlador: datosMaestros.nacionalidadesController,
      config: { ...adminRoute, permissions: ["home-frontend.voluntario"] },
    },
    tiposAmenaza: {
      path: `administrador/datosMaestros/tiposAmenaza/index.html`,
      controlador: datosMaestros.tiposAmenazaController,
      config: { ...adminRoute, permissions: ["home-frontend.voluntario"] },
    },
    especies: {
      path: `administrador/datosMaestros/especies/index.html`,
      controlador: datosMaestros.especiesController,
      config: { ...adminRoute, permissions: ["home-frontend.voluntario"] },
    },
    recursos: {
      path: `administrador/datosMaestros/recursos/index.html`,
      controlador: datosMaestros.recursosController,
      config: { ...adminRoute, permissions: ["home-frontend.voluntario"] },
    },
    vulnerabilidades: {
      path: `administrador/datosMaestros/vulnerabilidades/index.html`,
      controlador: datosMaestros.vulnerabilidadesController,
      config: { ...adminRoute, permissions: ["home-frontend.voluntario"] },
    },
    departamentos: {
      path: `administrador/datosMaestros/departamentos/index.html`,
      controlador: datosMaestros.departamentoController,
      config: { ...adminRoute, permissions: ["home-frontend.voluntario"] },
    },
  },

  "administrador-usuarios": {
    peticiones: {
      path: `administrador/usuarios/peticiones/index.html`,
      controlador: AdministradorUsuarios.PeticionesController,
      config: { ...adminRoute, permissions: ["home-frontend.voluntario"] },
    },
    gestion: {
      path: `administrador/usuarios/gestion/index.html`,
      controlador: AdministradorUsuarios.GestionController,
      config: { ...adminRoute, permissions: ["home-frontend.voluntario"] },
    },
  },
}