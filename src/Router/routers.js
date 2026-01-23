import * as auth from "../Views/Auth/index.js"
import homeController from "../Views/Home/controller.js";
import * as planFamiliar from "../Views/PlanFamiliar/index.js";
import * as verPlan from "../Views/VerPlanFamiliar/index.js";

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
  verPlanFamiliar:{
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
  }
};
