import { loginController } from '../Views/Auth/Login/loginController.js' 

export const routes = { 
  Login: {
    path: `Auth/Login/index.html`, 
    controlador: loginController,
    private: false,
  },
};