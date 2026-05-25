import { Router } from "express";
// Middleware que verifica si el usuario está autenticado mediante token
import { authRequired } from "../middlewares/validate.token.js";
// Controladores para el módulo de vigilancia (horarios y visitas)
import { vigilantController } from "../controllers/vigilant.controllers.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Vigilancia
 *   description: Endpoints para horarios y visitas
 */

/**
 * @swagger
 * /api/v1/schedules:
 *   post:
 *     summary: Crear un nuevo horario de vigilancia
 *     tags: [Vigilancia]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSchedule'
 *     responses:
 *       201:
 *         description: Horario creado correctamente
 */

/**
 * @swagger
 * /api/v1/visit:
 *   post:
 *     summary: Registrar una nueva visita
 *     tags: [Vigilancia]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVisit'
 *     responses:
 *       201:
 *         description: Visita registrada correctamente
 */

/**
 * @swagger
 * /api/v1/schedules:
 *   get:
 *     summary: Obtener todos los horarios
 *     tags: [Vigilancia]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de horarios
 */

/**
 * @swagger
 * /api/v1/visits:
 *   get:
 *     summary: Obtener todas las visitas
 *     tags: [Vigilancia]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de visitas
 */

// ----------- RUTAS PARA HORARIOS (SCHEDULES) -----------

/**
 * @swagger
 * /schedules:
 *   post:
 *     summary: Registra un nuevo horario de vigilancia
 *     tags: [Vigilancia - Horarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - day
 *               - startTime
 *               - endTime
 *             properties:
 *               day:
 *                 type: string
 *                 description: Día de la semana (ej. Lunes)
 *               startTime:
 *                 type: string
 *                 description: Hora de inicio del turno
 *               endTime:
 *                 type: string
 *                 description: Hora de fin del turno
 *     responses:
 *       200:
 *         description: Horario guardado correctamente
 *       401:
 *         description: No tienes permiso
 */
router.post("/schedules", authRequired, vigilantController.createSchedule.bind(vigilantController));

/**
 * @swagger
 * /schedules:
 *   get:
 *     summary: Consulta la lista completa de horarios
 *     tags: [Vigilancia - Horarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Aquí están todos los horarios registrados
 *       401:
 *         description: Acceso denegado
 */
router.get("/schedules", authRequired, vigilantController.getAllSchedules.bind(vigilantController));


// ----------- RUTAS PARA VISITAS (VISITS) -----------

/**
 * @swagger
 * /visit:
 *   post:
 *     summary: Registra la entrada de una visita
 *     tags: [Vigilancia - Visitas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - visitorName
 *               - reason
 *             properties:
 *               visitorName:
 *                 type: string
 *                 description: Nombre completo del visitante
 *               reason:
 *                 type: string
 *                 description: ¿A qué viene? (Motivo)
 *     responses:
 *       200:
 *         description: Visita registrada en el sistema
 *       401:
 *         description: No autorizado
 */
router.post("/visit", authRequired, vigilantController.createVisit.bind(vigilantController));

/**
 * @swagger
 * /visits:
 *   get:
 *     summary: Consulta el historial de visitas
 *     tags: [Vigilancia - Visitas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de todas las visitas
 *       401:
 *         description: Acceso denegado
 */
router.get("/visits", authRequired, vigilantController.getAllVisits.bind(vigilantController));

export default router;
