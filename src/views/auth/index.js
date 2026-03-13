/**
 * Índice de Controladores de Autenticación (Auth)
 * Archivo Barril (Barrel File) que exporta de manera centralizada los controladores
 * de todo este módulo, como el inicio de sesión, registro de usuarios y contraseñas.
 */

// Importa los módulos internos resueltos
import loginController from "./login/loginController.js";
import registerController from "./register/registerController.js";
import forgotPasswordController from "./forgotPassword/forgotController.js";
import changePasswordController from "./changePassword/changePasswordController.js";
import verifyCodeController from "./verifyCode/verifyCodeController.js";

// Exporta masivamente en objeto para destructurar luego 'import {loginController} from...'
export { loginController, registerController, forgotPasswordController, changePasswordController, verifyCodeController  };
