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


export const routes = {
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

  // ================= VOLUNTARIO =================
  'voluntario-home': {
    path: `voluntario/home/index.html`,
    controlador: VoluntarioHomeController,
    config: { ...voluntarioRoute, permissions: ["home-frontend.voluntario"] },
  },

  "voluntario-planFamiliar": {
    crear: {
      path: `voluntario/planFamiliar/crear/index.html`,
      controlador: planFamiliar.CrearController,
      config: { ...voluntarioRoute, permissions: ["home-frontend.voluntario"] },
    },
    identificacion: {
      path: `voluntario/planFamiliar/identificacion/index.html`,
      controlador: planFamiliar.IdentiController,
      config: { ...voluntarioRoute, permissions: ["home-frontend.voluntario"] },
    },
    georeferenciacion: {
      path: `voluntario/planFamiliar/georeferenciacion/index.html`,
      controlador: planFamiliar.GeoreController,
      config: { ...voluntarioRoute, permissions: ["home-frontend.voluntario"] },
    },
    testVunerabilidad: {
      path: `voluntario/planFamiliar/testVulnerabilidad/index.html`,
      controlador: planFamiliar.TestController,
      config: { ...voluntarioRoute, permissions: ["home-frontend.voluntario"] },
    },
  },

  "voluntario-verPlanFamiliar": {
    "": {
      path: `voluntario/verPlanFamiliar/index.html`,
      controlador: verPlan.VerPlanFamiliar,
      config: { ...voluntarioRoute, permissions: ["home-frontend.voluntario"] },
    },
    menu: {
      path: `voluntario/verPlanFamiliar/menu/index.html`,
      controlador: verPlan.MenuController,
      config: { ...voluntarioRoute, permissions: ["home-frontend.voluntario"] },
    },
  },

  "voluntario-planDatos": {
    ver: {
      path: `voluntario/planDatos/editar/index.html`,
      controlador: planDatos.EditarController,
      config: { ...voluntarioRoute, permissions: ["home-frontend.voluntario"] },
    },
  },

  "voluntario-planIntegrante": {
    ver: {
      path: `voluntario/planIntegrante/index.html`,
      controlador: Planintegrante.verPlanIntegrantes,
      config: { ...voluntarioRoute, permissions: ["home-frontend.voluntario"] },
    },
    crear: {
      path: `voluntario/planIntegrante/crear/index.html`,
      controlador: Planintegrante.crearController,
      config: { ...voluntarioRoute, permissions: ["home-frontend.voluntario"] },
    },
    editar: {
      path: `voluntario/planIntegrante/editar/index.html`,
      controlador: Planintegrante.editarController,
      config: { ...voluntarioRoute, permissions: ["home-frontend.voluntario"] },
    },
  },

  "voluntario-planMascota": {
    ver: {
      path: `voluntario/planMascota/index.html`,
      controlador: planMascota.verPlanMascota,
      config: { ...voluntarioRoute, permissions: ["home-frontend.voluntario"] },
    },
    crear: {
      path: `voluntario/planMascota/crear/index.html`,
      controlador: planMascota.crearController,
      config: { ...voluntarioRoute, permissions: ["home-frontend.voluntario"] },
    },
    editar: {
      path: `voluntario/planMascota/editar/index.html`,
      controlador: planMascota.editarController,
      config: { ...voluntarioRoute, permissions: ["home-frontend.voluntario"] },
    },
  },

  "voluntario-planRiesgo": {
    ver: {
      path: `voluntario/planRiesgo/index.html`,
      controlador: planRiesgo.verPlanRiesgo,
      config: { ...voluntarioRoute, permissions: ["home-frontend.voluntario"] },
    },
    crear: {
      path: `voluntario/planRiesgo/crear/index.html`,
      controlador: planRiesgo.crearController,
      config: { ...voluntarioRoute, permissions: ["home-frontend.voluntario"] },
    },
    editar: {
      path: `voluntario/planRiesgo/editar/index.html`,
      controlador: planRiesgo.editarController,
      config: { ...voluntarioRoute, permissions: ["home-frontend.voluntario"] },
    },
  },

  // ================= SUPERVISOR =================
  "supervisor-home": {
    "": {
      path: `supervisor/home/index.html`,
      controlador: SupervisorHomeController,
      config: { ...supervisorRoute, permissions: ["home-frontend.supervisor"] },
    },
  },

  "supervisor-usuarios": {
    peticiones: {
      path: `supervisor/usuarios/peticiones/index.html`,
      controlador: SupervisorUsuarios.PeticionesController,
      config: { ...supervisorRoute, permissions: ["home-frontend.supervisor"] },
    },
    gestion: {
      path: `supervisor/usuarios/gestion/index.html`,
      controlador: SupervisorUsuarios.GestionController,
      config: { ...supervisorRoute, permissions: ["home-frontend.supervisor"] },
    },
  },

  // ================= ADMIN =================
  "administrador-home": {
    path: `administrador/home/index.html`,
    controlador: AdministradorHomeController,
    config: { ...adminRoute, permissions: ["home-frontend.administrador"] },
  },

  "administrador-datosMaestros": {
    "": {
      path: `administrador/datosMaestros/index.html`,
      controlador: datosMaestros.verController,
      config: { ...adminRoute, permissions: ["home-frontend.administrador"] },
    },
    
    seccionales: {
      path: `administrador/datosMaestros/seccionales/index.html`,
      controlador: datosMaestros.seccionalesController,
      config: { ...adminRoute, permissions: ["home-frontend.administrador"] },
  },
    "historial-seccional": {
      path: `administrador/datosMaestros/seccionales/historial/index.html`,
      controlador: datosMaestros.historialSeccional,
      config: { ...adminRoute, permissions: ["home-frontend.administrador"] },
    },
  
    "organizaciones": {
      path: `administrador/datosMaestros/organizaciones/index.html`,
      controlador: datosMaestros.organizacionesController,
      config: { ...adminRoute, permissions: ["home-frontend.administrador"] },
    },
  
    "historial-organizacion": {
      path: `administrador/datosMaestros/organizaciones/historial/index.html`,
      controlador: datosMaestros.historialOrganizacion,
      config: { ...adminRoute, permissions: ["home-frontend.administrador"] },
    },
  
    "tiposDocumento": {
      path: `administrador/datosMaestros/tiposDocumento/index.html`,
      controlador: datosMaestros.tiposDocumentoController,
      config: { ...adminRoute, permissions: ["home-frontend.administrador"] },
    },

    "historial-tiposDocumento":{
      path: `administrador/datosMaestros/tiposDocumento/historial/index.html`,
      controlador: datosMaestros.historialDocumentos,
      private: true,
      can: "home-frontend.voluntario",
    },
  
    "calidadesVivienda": {
      path: `administrador/datosMaestros/calidadesVivienda/index.html`,
      controlador: datosMaestros.calidadesViviendaController,
      config: { ...adminRoute, permissions: ["home-frontend.administrador"] },
    },

    "historial-calidadesVivienda":{

      path: `administrador/datosMaestros/calidadesVivienda/historial/index.html`,
      controlador: datosMaestros.historialVivienda,
      private: true,
      can: "home-frontend.voluntario",
    },

    "sectores": {
      path: `administrador/datosMaestros/sectores/index.html`,
      controlador: datosMaestros.sectoresController,
      config: { ...adminRoute, permissions: ["home-frontend.administrador"] },
    },

    "historial-sectores":{
      path: `administrador/datosMaestros/sectores/historial/index.html`,
      controlador: datosMaestros.historialSectores,
      private: true,
      can: "home-frontend.voluntario",
    },

  
    "preguntasVulnerabilidad": {
      path: `administrador/datosMaestros/preguntasVulnerabilidad/index.html`,
      controlador: datosMaestros.preguntasVulnerabilidadController,
      config: { ...adminRoute, permissions: ["home-frontend.administrador"] },
    },

    "historial-preguntas": {
      path: `administrador/datosMaestros/preguntasVulnerabilidad/historial/index.html`,
      controlador: datosMaestros.historialPreguntas,
      private: true,
      can: "home-frontend.voluntario",
    },

  
    "nacionalidades": {
      path: `administrador/datosMaestros/nacionalidades/index.html`,
      controlador: datosMaestros.nacionalidadesController,
      config: { ...adminRoute, permissions: ["home-frontend.administrador"] },
    },

    "historial-nacionalidades":{
      path: `administrador/datosMaestros/nacionalidades/historial/index.html`,
      controlador: datosMaestros.historialNacionalidades,
      private: true,
      can: "home-frontend.voluntario",
    },

  
    "tiposAmenaza": {
      path: `administrador/datosMaestros/tiposAmenaza/index.html`,
      controlador: datosMaestros.tiposAmenazaController,
      config: { ...adminRoute, permissions: ["home-frontend.administrador"] },
    },

    "historial-tiposAmenaza":{
      path: `administrador/datosMaestros/tiposAmenaza/historial/index.html`,
      controlador: datosMaestros.historialAmenaza,
      private: true,
      can: "home-frontend.voluntario",      
    },

  
    "especies": {
      path: `administrador/datosMaestros/especies/index.html`,
      controlador: datosMaestros.especiesController,
      config: { ...adminRoute, permissions: ["home-frontend.administrador"] },
    },

    "historial-especies":{
      path: `administrador/datosMaestros/especies/historial/index.html`,
      controlador: datosMaestros.historialEspecies,
      private: true,
      can: "home-frontend.voluntario",
    },

  
    "recursos": {
      path: `administrador/datosMaestros/recursos/index.html`,
      controlador: datosMaestros.recursosController,
      config: { ...adminRoute, permissions: ["home-frontend.administrador"] },
    },

    "historial-recursos":{
      path: `administrador/datosMaestros/recursos/historial/index.html`,
      controlador: datosMaestros.historialRecursos,
      private: true,
      can: "home-frontend.voluntario",
    },

  
    "vulnerabilidades": {
      path: `administrador/datosMaestros/vulnerabilidades/index.html`,
      controlador: datosMaestros.vulnerabilidadesController,
      config: { ...adminRoute, permissions: ["home-frontend.administrador"] },
    },

    "historial-vulnerabilidades":{
      path: `administrador/datosMaestros/vulnerabilidades/historial/index.html`,
      controlador: datosMaestros.historialVulnerabilidades,
      private: true,
      can: "home-frontend.voluntario",
    },
    
  
    "departamentos": {
      path: `administrador/datosMaestros/departamentos/index.html`,
      controlador: datosMaestros.departamentoController,
      config: { ...adminRoute, permissions: ["home-frontend.administrador"] },
    },

    "historial-departamento":{
      path: `administrador/datosMaestros/departamentos/historial/index.html`,
      controlador: datosMaestros.historialDepartamento,
      private: true,
      can: "home-frontend.voluntario",
    },
  },

// ================= ADMIN USUARIOS =================
  "administrador-usuarios": {
  peticiones: {
    path: `administrador/usuarios/peticiones/index.html`,
    controlador: AdministradorUsuarios.PeticionesController,
    config: { ...adminRoute, permissions: ["home-frontend.administrador"] },
  },
  gestion: {
    path: `administrador/usuarios/gestion/index.html`,
    controlador: AdministradorUsuarios.GestionController,
    config: { ...adminRoute, permissions: ["home-frontend.administrador"] },
  },},}