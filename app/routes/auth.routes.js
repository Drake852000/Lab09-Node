// app/routes/auth.routes.js

// Importa Express para definir rutas
import express from "express";

// Importa las funciones del controlador de autenticación
import { signUp, signIn } from "../controllers/auth.controller.js";
import { refreshToken, signOut } from "../controllers/auth.controller.js";
// Importa los middlewares que verifican datos antes de registrar
// un usuario
import {
    checkDuplicateUsernameOrEmail, // Verifica si el username o
                                   // email ya existen
    checkRolesExisted,             // Verifica si los roles
                                   // enviados son válidos
} from "../middlewares/verifySignUp.js";

// Crea un router de Express para definir las rutas relacionadas
// con autenticación
const router = express.Router();

// Ruta para registrar un nuevo usuario (signUp)
/* Aplica dos middlewares antes de ejecutar la función signUp:
 * 1. checkDuplicateUsernameOrEmail: asegura que el username y el
 * email no estén repetidos
 * 2. checkRolesExisted: valida que los roles proporcionados
 * existan en la base de datos
 */
router.post("/signup", [checkDuplicateUsernameOrEmail, checkRolesExisted], signUp);

// Ruta para iniciar sesión (signIn)
// No necesita middlewares previos, va directo al controlador signIn
router.post("/signin", signIn);
router.post("/refreshtoken", refreshToken);
router.post("/signout", signOut);
// Exporta el router para poder usarlo en la configuración
// principal de rutas de la app
export default router;