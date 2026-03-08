import * as auth from "../views/auth/index.js"
import VoluntarioHomeController from "../views/voluntario/home/homeController.js";
import AdministradorHomeController from "../views/administrador/home/homeController.js"
import SupervisorHomeController from "../views/supervisor/home/homeController.js"

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

import * as SupervisorUsuarios from "../views/supervisor/usuarios/index.js"
import * as supervisorPlanFamiliar from "../views/supervisor/PlanFamiliar/index.js"
import * as datosMaestros from "../views/administrador/datosMaestros/index.js"
import * as AdministradorUsuarios from "../views/administrador/usuarios/index.js"
import * as usuario from "../views/usuario/index.js"

export const routes = {
  login: {
    path: `auth/login/index.html`,
    controlador: auth.loginController,
    private: false,
  },
  register: {
    path: `auth/register/index.html`,
    controlador: auth.registerController,
    private: false,
  },
  forgotPassword: {
    path: `auth/forgotPassword/index.html`,
    controlador: auth.forgotPasswordController,
    private: false,
  },

  'voluntario-home': {
    path: `voluntario/home/index.html`,
    controlador: VoluntarioHomeController,
    private: true,
    can: "home-frontend.voluntario",
  },

  "voluntario-planFamiliar": {
    crear: {
      path: `voluntario/planFamiliar/crear/index.html`,
      controlador: planFamiliar.CrearController,
      private: true,
      can: "family-plans.store",
    },
    identificacion: {
      path: `voluntario/planFamiliar/identificacion/index.html`,
      controlador: planFamiliar.IdentiController,
      private: true,
      can: "family-plans.identify",
    },
    georeferenciacion: {
      path: `voluntario/planFamiliar/georeferenciacion/index.html`,
      controlador: planFamiliar.GeoreController,
      private: true,
      can: "family-plans.destroy",
    },
    testVunerabilidad: {
      path: `voluntario/planFamiliar/testVulnerabilidad/index.html`,
      controlador: planFamiliar.TestVulController,
      private: true,
      can: "family-plans.destroy",
    },
  },

  "voluntario-verPlanFamiliar": {
    "/": {
      path: `voluntario/verPlanFamiliar/index.html`,
      controlador: verPlan.VerPlanFamiliar,
      private: true,
      can: "family-plans.show",
    },
    menu: {
      path: `voluntario/verPlanFamiliar/menu/index.html`,
      controlador: verPlan.MenuController,
      private: true,
      can: "family-plans.show",
    },
  },
  "voluntario-planDatos": {
    "ver": {
      path: `Voluntario/planDatos/Editar/index.html`,
      controlador: planDatos.EditarController,
      private: true,
      can: "family-plans.show",
    },
  },
  "voluntario-planIntegrante": {
    ver: {
      path: `voluntario/planIntegrante/index.html`,
      controlador: Planintegrante.verPlanIntegrantes,
      private: true,
      can: "family-plans.show",
    },
    crear: {
      path: `voluntario/planIntegrante/crear/index.html`,
      controlador: Planintegrante.crearController,
      private: true,
      can: "family-plans.store",
    },
    editar: {
      path: `voluntario/planIntegrante/editar/index.html`,
      controlador: Planintegrante.editarController,
      private: true,
      can: "family-plans.store",
    },
  },

  "voluntario-planMascota": {
    ver: {
      path: `voluntario/planMascota/index.html`,
      controlador: planMascota.verPlanMascota,
      private: true,
      can: "family-plans.show",
    },
    crear: {
      path: `voluntario/planMascota/crear/index.html`,
      controlador: planMascota.crearController,
      private: true,
      can: "family-plans.store",
    },
    editar: {
      path: `voluntario/planMascota/editar/index.html`,
      controlador: planMascota.editarController,
      private: true,
      can: "family-plans.store",
    },
  },

  "voluntario-planRiesgo": {
    ver: {
      path: `voluntario/planRiesgo/index.html`,
      controlador: planRiesgo.verPlanRiesgo,
      private: true,
      can: "family-plans.show",
    },
    crear: {
      path: `voluntario/planRiesgo/crear/index.html`,
      controlador: planRiesgo.crearController,
      private: true,
      can: "family-plans.store",
    },
    editar: {
      path: `voluntario/planRiesgo/editar/index.html`,
      controlador: planRiesgo.editarController,
      private: true,
      can: "family-plans.store",
    },
  },
  "voluntario-planRecurso": {
    ver: {
      path: `voluntario/planRecurso/index.html`,
      controlador: planRecurso.verController,
      private: true,
      can: "family-plans.show",
    },
    crear: {
      path: `voluntario/planRecurso/crear/index.html`,
      controlador: planRecurso.crearController,
      private: true,
      can: "family-plans.store",
    },
    editar: {
      path: `voluntario/planRecurso/Editar/index.html`,
      controlador: planRecurso.editarController,
      private: true,
      can: "family-plans.store",
    },
  },
  "voluntario-planEntorno": {
    editar: {
      path: `voluntario/planEntorno/editar/index.html`,
      controlador: PlanEntorno.EditarController,
      private: true,
      can: "home-frontend.voluntario",
    },
  },
  "voluntario-planGrafico": {
    ver: {
      path: `voluntario/planGrafico/index.html`,
      controlador: PlanGrafico.verController,
      private: true,
      can: "home-frontend.voluntario",
    },
    crear: {
      path: `voluntario/planGrafico/crear/index.html`,
      controlador: PlanGrafico.crearController,
      private: true,
      can: "home-frontend.voluntario",
    },
    editar: {
      path: `voluntario/planGrafico/editar/index.html`,
      controlador: PlanGrafico.editarController,
      private: true,
      can: "home-frontend.voluntario",
    },
  },
  "voluntario-planAccion":{
    antes: {
      path: `Voluntario/planAccion/index.html`,
      controlador: planAccion.antes,
      private: true,
      can: "home-frontend.voluntario",
    },
    durante: {
      path: `Voluntario/planAccion/index.html`,
      controlador: planAccion.durante,
      private: true,
      can: "home-frontend.voluntario",
    },
    despues: {
      path: `Voluntario/planAccion/index.html`,
      controlador: planAccion.despues,
      private: true,
      can: "home-frontend.voluntario",
    }
  },
  "supervisor-home": {
    "/": {
      path: `supervisor/home/index.html`,
      controlador: SupervisorHomeController,
      private: false,
    },
  },

  "supervisor-planFamiliar": {
    "/": {
      path: `voluntario/verPlanFamiliar/index.html`,
      controlador: verPlan.VerPlanFamiliar,
      private: false
    },
    "revision": {
      path: `supervisor/revisionPlan/index.html`,
      controlador:supervisorPlanFamiliar.RevisionPlanController,
      private: false
    },
    "estadistica":{
      path: `supervisor/PlanFamiliar/estadistica/index.html`,
      controlador:supervisorPlanFamiliar.EstadisticaController,
      private: false
    }
  },

  "supervisor-usuarios": {
    "peticiones": {
      path: `supervisor/usuarios/peticiones/index.html`,
      controlador: SupervisorUsuarios.PeticionesController,
      private: true,
      can: "home-frontend.voluntario",
    },
    "gestion": {
      path: `supervisor/usuarios/gestion/index.html`,
      controlador: SupervisorUsuarios.GestionController,
      private: true,
      can: "home-frontend.voluntario",
    },
  },
    "administrador-home": {
    path: `administrador/home/index.html`,
    controlador: AdministradorHomeController,
    private: true,
    can: "home-frontend.voluntario",
  },

  "administrador-datosMaestros": {
    "/": {
      path: `administrador/datosMaestros/index.html`,
      controlador: datosMaestros.verController,
      private: false,
      can: "home-frontend.voluntario",
    },

    "seccionales": {
      path: `administrador/datosMaestros/seccionales/index.html`,
      controlador: datosMaestros.seccionalesController,
      private: true,
      can: "home-frontend.voluntario",
    },

    "organizaciones": {
      path: `administrador/datosMaestros/organizaciones/index.html`,
      controlador: datosMaestros.organizacionesController,
      private: true,
      can: "home-frontend.voluntario",
    },

    "tiposDocumento": {
      path: `administrador/datosMaestros/tiposDocumento/index.html`,
      controlador: datosMaestros.tiposDocumentoController,
      private: true,
      can: "home-frontend.voluntario",
    },

    "calidadesVivienda": {
      path: `administrador/datosMaestros/calidadesVivienda/index.html`,
      controlador: datosMaestros.calidadesViviendaController,
      private: true,
      can: "home-frontend.voluntario",
    },

    "sectores": {
      path: `administrador/datosMaestros/sectores/index.html`,
      controlador: datosMaestros.sectoresController,
      private: true,
      can: "home-frontend.voluntario",
    },

    "preguntasVulnerabilidad": {
      path: `administrador/datosMaestros/preguntasVulnerabilidad/index.html`,
      controlador: datosMaestros.preguntasVulnerabilidadController,
      private: true,
      can: "home-frontend.voluntario",
    },

    "nacionalidades": {
      path: `administrador/datosMaestros/nacionalidades/index.html`,
      controlador: datosMaestros.nacionalidadesController,
      private: true,
      can: "home-frontend.voluntario",
    },

    "tiposAmenaza": {
      path: `administrador/datosMaestros/tiposAmenaza/index.html`,
      controlador: datosMaestros.tiposAmenazaController,
      private: true,
      can: "home-frontend.voluntario",
    },

    "especies": {
      path: `administrador/datosMaestros/especies/index.html`,
      controlador: datosMaestros.especiesController,
      private: true,
      can: "home-frontend.voluntario",
    },

    "recursos": {
      path: `administrador/datosMaestros/recursos/index.html`,
      controlador: datosMaestros.recursosController,
      private: true,
      can: "home-frontend.voluntario",
    },

    "vulnerabilidades": {
      path: `administrador/datosMaestros/vulnerabilidades/index.html`,
      controlador: datosMaestros.vulnerabilidadesController,
      private: true,
      can: "home-frontend.voluntario",
    },
  },
  "administrador-usuarios": {
    "peticiones": {
      path: `administrador/usuarios/peticiones/index.html`,
      controlador: AdministradorUsuarios.PeticionesController,
      private: true,
      can: "home-frontend.voluntario",
    },
    "gestion": {
      path: `administrador/usuarios/gestion/index.html`,
      controlador: AdministradorUsuarios.GestionController,
      private: true,
      can: "home-frontend.voluntario",
    },
  },
  "usuarios":{
    "perfil": {
      path: `usuario/perfil/index.html`,
      controlador: usuario.perfilController,
      private:false
    },
    "notificaciones":{
      path: `usuario/notificaciones/index.html`,
      controlador: usuario.notificacionesController,
      private:false
    }
  }
};
