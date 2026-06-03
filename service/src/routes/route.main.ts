import { Router } from "express";
import { payController } from "../controllers/pay.controllers.js";
import { authRequired } from "../middlewares/validate.token.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../schema/auth.schema.js";
import { userController } from "../controllers/user.controllers.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Operaciones relacionadas con usuarios
 */

/**
 * @swagger
 * /api/v1/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 */

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Sesión iniciada con éxito
 */

/**
 * @swagger
 * /api/v1/logout:
 *   post:
 *     summary: Cerrar sesión
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Sesión cerrada
 */

/**
 * @swagger
 * /api/v1/profile:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */

/**
 * @swagger
 * /api/v1/profile/{id}:
 *   get:
 *     summary: Obtener perfil de un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 */

/**
 * @swagger
 * /api/v1/profile/{id}:
 *   put:
 *     summary: Actualizar perfil de un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil actualizado
 */

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */

/**
 * @swagger
 * /api/v1/payVigilance:
 *   post:
 *     summary: Agregar pago a un vigilante
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Pago registrado
 */

/**
 * @swagger
 * /api/v1/allPay:
 *   get:
 *     summary: Obtener todos los pagos realizados
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pagos
 */

/**
 * @swagger
 * /api/v1/createUser:
 *   post:
 *     summary: Crear nuevo usuario (solo administrador)
 *     description: Endpoint para que un administrador cree nuevos usuarios en el sistema. Requiere autenticación JWT con rol de administrador.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Juan Pérez"
 *               username:
 *                 type: string
 *                 example: "juanperez"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "juan@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: "password123"
 *               telephone:
 *                 type: string
 *                 example: "+50378787878"
 *               age:
 *                 type: integer
 *                 minimum: 18
 *                 example: 25
 *               role:
 *                 type: string
 *                 enum: ["admin", "vigilant", "normal"]
 *                 default: "normal"
 *                 example: "vigilant"
 *             required:
 *               - name
 *               - username
 *               - email
 *               - password
 *               - telephone
 *               - age
 *               - role
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "token=abcde12345; Path=/; HttpOnly"
 *       400:
 *         description: Error de validación o datos incorrectos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El nombre de usuario ya está en uso"
 *       401:
 *         description: No autorizado (token inválido o sin privilegios de admin)
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al crear el usuario en la base de datos"
 */

/**
 * @swagger
 * /api/v1/updatePassword:
 *   put:
 *     summary: Update user password
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *               password:
 *                 type: string
 *                 description: The new password
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password updated successfully"
 *       400:
 *         description: Bad request - invalid username or password
 *       401:
 *         description: Unauthorized - invalid credentials
 */

router.post("/register", validateSchema(registerSchema), userController.register.bind(userController));
router.post("/login", validateSchema(loginSchema), userController.login.bind(userController));
router.post("/logout", userController.logout.bind(userController));
router.get("/profile", authRequired, userController.profile.bind(userController));
router.get("/verify", userController.verifyToken.bind(userController));
router.get("/users", authRequired, userController.getAllUsers.bind(userController));
router.get("/allUser", authRequired, userController.getAllUser.bind(userController));
router.delete("/users/:id", authRequired, userController.deleteOneUser.bind(userController));
router.get("/profile/:id", authRequired, userController.getOneProfile.bind(userController));
router.put("/profile/:id", authRequired, userController.updateProfile.bind(userController));
router.post("/payVigilance", authRequired, payController.addPayVigilance.bind(payController));
router.get("/allPay", authRequired, payController.getAllPay.bind(payController));

router.post("/createUser", validateSchema(registerSchema), authRequired, userController.createUserByAdmin.bind(userController));
router.put("/updatePassword", userController.updatePassword.bind(userController));

export default router;
