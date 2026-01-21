import { loginController } from "../Views/Auth/Login/loginController.js";
import { registerController } from "../Views/Auth/Register/registerController.js";
import { forgotPasswordController } from "../Views/Auth/ForgotPassword/ForgotPasswordController.js";
import { homeController } from "../Views/Home/HomeController.js";
import * as planFamiliar from "../Views/PlanFamiliar/index.js";

export const routes = {
  login: {
    path: `Auth/Login/index.html`,
    controlador: loginController,
    private: false,
  },
  register: {
    path: `Auth/Register/index.html`,
    controlador: registerController,
    private: false,
  },
  forgotPassword: {
    path: `Auth/ForgotPassword/index.html`,
    controlador: forgotPasswordController,
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
};
