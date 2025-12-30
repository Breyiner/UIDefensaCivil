import { loginController } from '../Views/Auth/Login/loginController.js' 
import { registerController } from '../Views/Auth/Register/registerController.js' 

export const routes = { 
  Login: {
    path: `Auth/Login/index.html`, 
    controlador: loginController,
    private: false,
  },
  Register: {
    path: `Auth/Register/index.html`, 
    controlador: registerController,
    private: false,
  }
};