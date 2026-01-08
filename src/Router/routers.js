import { loginController } from '../Views/Auth/Login/loginController.js' 
import { registerController } from '../Views/Auth/Register/registerController.js' 
import { forgotPasswordController } from '../Views/Auth/ForgotPassword/ForgotPasswordController.js' 
import { homeController } from '../Views/Home/HomeController.js'

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
    private: false,
  }
};