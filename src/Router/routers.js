import * as auth from "../Views/Auth/index.js"
import homeController from "../Views/Home/controller.js";
import * as planFamiliar from "../Views/PlanFamiliar/index.js";
import * as verPlan from "../Views/VerPlanFamiliar/index.js";
import * as Planintegrante from "../Views/PlanIntegrante/index.js";
import * as planMascota from "../Views/PlanMascota/index.js";
import * as PlanEntorno from "../Views/PlanEntorno/index.js";
import * as planRiesgo from "../Views/PlanRiesgo/index.js";

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
    path: `Home/index.html`,
    controlador: homeController,
    private: true,
    can: "home-frontend.voluntario",
  },
  planFamiliar: {
    crear: {
      path: `PlanFamiliar/Crear/index.html`,
      controlador: planFamiliar.CrearController,
      private: true,
      can: "family-plans.store",
    },
    identificacion: {
      path: `PlanFamiliar/Identificacion/index.html`,
      controlador: planFamiliar.IdentiController,
      private: true,
      can: "family-plans.identify",
    },
    georeferenciacion: {
      path: `PlanFamiliar/Georeferenciacion/index.html`,
      controlador: planFamiliar.GeoreController,
      private: true,
      can: "family-plans.destroy",
    },
    testVunerabilidad: {
      path: `PlanFamiliar/TestVulnerabilidad/index.html`,
      controlador: planFamiliar.TestVulController,
      private: true,
      can: "family-plans.destroy",
    }
  },
  verPlanFamiliar: {
    "/": {
      path: `VerPlanFamiliar/index.html`,
      controlador: verPlan.VerPlanFamiliar,
      private: true,
      can: "family-plans.show",
    },
    menu: {
      path: `VerPlanFamiliar/Menu/index.html`,
      controlador: verPlan.MenuController,
      private: true,
      can: "family-plans.show",
    },
  },
  planIntegrante: {
    ver: {
      path: `PlanIntegrante/index.html`,
      controlador: Planintegrante.verPlanIntegrantes,
      private: true,
      can: "family-plans.show",
    },
    crear: {
      path: `PlanIntegrante/Crear/index.html`,
      controlador: Planintegrante.crearController,
      private: true,
      can: "family-plans.store",
    },
    editar: {
      path: `PlanIntegrante/Editar/index.html`,
      controlador: Planintegrante.editarController,
      private: true,
      can: "family-plans.store",
    },
  },
  planMascota: {
    ver: {
      path: `PlanMascota/index.html`,
      controlador: planMascota.verPlanMascota,
      private: true,
      can: "family-plans.show",
    },
    crear: {
      path: `PlanMascota/Crear/index.html`,
      controlador: planMascota.crearController,
      private: true,
      can: "family-plans.store",
    },
    editar: {
      path: `PlanMascota/Editar/index.html`,
      controlador: planMascota.editarController,
      private: true,
      can: "family-plans.store",
    },
  },
  planRiesgo: {
    ver: {
      path: `PlanRiesgo/index.html`,
      controlador: planRiesgo.verPlanRiesgo,
      private: true,
      can: "family-plans.show",
    },
    crear: {
      path: `PlanRiesgo/Crear/index.html`,
      controlador: planRiesgo.crearController,
      private: true,
      can: "family-plans.store",
    },
    editar: {
      path: `PlanRiesgo/Editar/index.html`,
      controlador: planRiesgo.editarController,
      private: true,
      can: "family-plans.store",
    },
  },
  
  planEntorno: {
    Editar: {
      path: `PlanEntorno/Editar/index.html`,
      controlador: PlanEntorno.EditarController,
      private: true,
      can: "home-frontend.voluntario",
    },
  },
};
