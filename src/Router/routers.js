import * as auth from "../Views/Auth/index.js"
import homeController from "../Views/Voluntario/Home/controller.js";
import * as planFamiliar from "../Views/Voluntario/PlanFamiliar/index.js";
import * as verPlan from "../Views/Voluntario/VerPlanFamiliar/index.js";
import * as Planintegrante from "../Views/Voluntario/PlanIntegrante/index.js";
import * as planMascota from "../Views/Voluntario/PlanMascota/index.js";
import * as planRiesgo from "../Views/Voluntario/PlanRiesgo/index.js";
import * as PlanEntorno from "../Views/Voluntario/PlanEntorno/index.js";
import * as HomepageSupervisor from "../Views/Supervisor/homepage/homepage.js"

export const routes = {
  login: {
    path: `Auth/Login/index.html`,
    controlador: auth.loginController,
    private: false,
  },
  register: {
    path: `Auth/Register/index.html`,
    controlador: auth.registerController,
    private: false,
  },
  forgotPassword: {
    path: `Auth/ForgotPassword/index.html`,
    controlador: auth.forgotPasswordController,
    private: false,
  },

  home: {
    path: `Voluntario/Home/index.html`,
    controlador: homeController,
    private: true,
    can: "home-frontend.voluntario",
  },

  "voluntario-planFamiliar": {
    crear: {
      path: `Voluntario/PlanFamiliar/Crear/index.html`,
      controlador: planFamiliar.CrearController,
      private: true,
      can: "family-plans.store",
    },
    identificacion: {
      path: `Voluntario/PlanFamiliar/Identificacion/index.html`,
      controlador: planFamiliar.IdentiController,
      private: true,
      can: "family-plans.identify",
    },
    georeferenciacion: {
      path: `Voluntario/PlanFamiliar/Georeferenciacion/index.html`,
      controlador: planFamiliar.GeoreController,
      private: true,
      can: "family-plans.destroy",
    },
    testVunerabilidad: {
      path: `Voluntario/PlanFamiliar/TestVulnerabilidad/index.html`,
      controlador: planFamiliar.TestVulController,
      private: true,
      can: "family-plans.destroy",
    }
  },

  "voluntario-verPlanFamiliar": {
    "/": {
      path: `Voluntario/VerPlanFamiliar/index.html`,
      controlador: verPlan.VerPlanFamiliar,
      private: true,
      can: "family-plans.show",
    },
    menu: {
      path: `Voluntario/VerPlanFamiliar/Menu/index.html`,
      controlador: verPlan.MenuController,
      private: true,
      can: "family-plans.show",
    },
  },

  "voluntario-planIntegrante": {
    ver: {
      path: `Voluntario/PlanIntegrante/index.html`,
      controlador: Planintegrante.verPlanIntegrantes,
      private: true,
      can: "family-plans.show",
    },
    crear: {
      path: `Voluntario/PlanIntegrante/Crear/index.html`,
      controlador: Planintegrante.crearController,
      private: true,
      can: "family-plans.store",
    },
    editar: {
      path: `Voluntario/PlanIntegrante/Editar/index.html`,
      controlador: Planintegrante.editarController,
      private: true,
      can: "family-plans.store",
    },
  },

  "voluntario-planMascota": {
    ver: {
      path: `Voluntario/PlanMascota/index.html`,
      controlador: planMascota.verPlanMascota,
      private: true,
      can: "family-plans.show",
    },
    crear: {
      path: `Voluntario/PlanMascota/Crear/index.html`,
      controlador: planMascota.crearController,
      private: true,
      can: "family-plans.store",
    },
    editar: {
      path: `Voluntario/PlanMascota/Editar/index.html`,
      controlador: planMascota.editarController,
      private: true,
      can: "family-plans.store",
    },
  },

  "voluntario-planRiesgo":{
    ver: {
      path: `Voluntario/PlanRiesgo/index.html`,
      controlador: planRiesgo.verPlanRiesgo,
      private: true,
      can: "family-plans.show",
    },
    crear: {
      path: `Voluntario/PlanRiesgo/Crear/index.html`,
      controlador: planRiesgo.crearController,
      private: true,
      can: "family-plans.store",
    },
    editar: {
      path: `Voluntario/PlanRiesgo/Editar/index.html`,
      controlador: planRiesgo.editarController,
      private: true,
      can: "family-plans.store",
    },
  },

  "voluntario-planEntorno":{
    editar:{
      path: `Voluntario/PlanEntorno/Editar/index.html`,
      controlador: PlanEntorno.EditarController,
      private: true,
      can: "home-frontend.voluntario",
    },
  },

  //supervisor
  "supervisor-Homepage": {
    "ver": {
      path:`supervisor/homepage/index.html`,
      controlador: HomepageSupervisor,
      private: false
    }
  }

};
