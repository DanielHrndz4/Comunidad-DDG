import { Router } from "express";
// Middleware para verificar que el usuario esté autenticado mediante token
import { authRequired } from "../middlewares/validate.token.js";
// Controladores para las tareas (task)
import { getTask, getOneTask, createTask, updateTask, deleteTask, getTaskHome, getNearbyTasks } from "../controllers/task.controllers.js";
// Controladores para las tareas tipo 2 (task2)
import { getTask2, getOneTask2, createTask2, updateTask2, deleteTask2, getTaskHome2 } from "../controllers/task2.controllers.js";
// Middleware para validar datos con Zod
import { validateSchema } from "../middlewares/validate.middleware.js";
// Schemas de validación para cada tipo de task
import { createTaskSchema, createTaskSchema2 } from "../schema/task.schema.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tareas
 *   description: Endpoints para la gestión de tareas
 */

/**
 * @swagger
 * /api/v1/task:
 *   post:
 *     summary: Crear una nueva tarea
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTask'
 *     responses:
 *       201:
 *         description: Tarea creada correctamente
 */

/**
 * @swagger
 * /api/v1/task:
 *   get:
 *     summary: Obtener todas las tareas
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tareas
 */

/**
 * @swagger
 * /api/v1/taskhome:
 *   get:
 *     summary: Obtener tareas para home
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tareas home
 */

/**
 * @swagger
 * /api/v1/task/{id}:
 *   get:
 *     summary: Obtener una tarea por ID
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos de la tarea
 */

/**
 * @swagger
 * /api/v1/task/{id}:
 *   put:
 *     summary: Actualizar una tarea por ID
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTask'
 *     responses:
 *       200:
 *         description: Tarea actualizada
 */

/**
 * @swagger
 * /api/v1/task/{id}:
 *   delete:
 *     summary: Eliminar una tarea por ID
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tarea eliminada
 */

/**
 * @swagger
 * /api/v1/taskd:
 *   post:
 *     summary: Crear una nueva tarea D
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskD'
 *     responses:
 *       201:
 *         description: Tarea D creada correctamente
 */

/**
 * @swagger
 * /api/v1/taskd:
 *   get:
 *     summary: Obtener todas las tareas D
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tareas D
 */

/**
 * @swagger
 * /api/v1/taskhomed:
 *   get:
 *     summary: Obtener tareas D para home
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tareas D home
 */

/**
 * @swagger
 * /api/v1/taskd/{id}:
 *   get:
 *     summary: Obtener una tarea D por ID
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos de la tarea D
 */

/**
 * @swagger
 * /api/v1/taskd/{id}:
 *   put:
 *     summary: Actualizar una tarea D por ID
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskD'
 *     responses:
 *       200:
 *         description: Tarea D actualizada
 */

/**
 * @swagger
 * /api/v1/taskd/{id}:
 *   delete:
 *     summary: Eliminar una tarea D por ID
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tarea D eliminada
 */


// ---------- RUTAS PARA TASK (tareas normales) ----------

/**
 * @swagger
 * /task:
 *   post:
 *     summary: Crea una nueva tarea pendiente
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 description: ¿Qué tienes que hacer? (Título)
 *               description:
 *                 type: string
 *                 description: Explica un poco más los detalles
 *               date:
 *                 type: string
 *                 format: date
 *                 description: ¿Para cuándo es? (Fecha límite)
 *     responses:
 *       200:
 *         description: ¡Listo! Tarea guardada
 *       401:
 *         description: No estás autorizado
 */
router.post("/task", authRequired, validateSchema(createTaskSchema), createTask);

/**
 * @swagger
 * /task:
 *   get:
 *     summary: Consulta todas tus tareas pendientes
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Aquí tienes tu lista de tareas
 *       401:
 *         description: Necesitas iniciar sesión
 */
router.get("/task", authRequired, getTask);

/**
 * @swagger
 * /taskhome:
 *   get:
 *     summary: Obtiene un resumen de tareas para el inicio
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tareas destacadas para la pantalla principal
 *       401:
 *         description: Acceso denegado
 */
router.get("/taskhome", authRequired, getTaskHome);

/**
 * @swagger
 * /tasks/nearby:
 *   get:
 *     summary: Obtiene tareas cercanas a una coordenada geográfica
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitud del punto central (entre -180 y 180)
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitud del punto central (entre -90 y 90)
 *       - in: query
 *         name: radius
 *         required: true
 *         schema:
 *           type: number
 *         description: Radio máximo de búsqueda en metros
 *     responses:
 *       200:
 *         description: GeoJSON FeatureCollection con las tareas cercanas (compatible con QGIS)
 *       400:
 *         description: Parámetros inválidos o fuera de rango
 *       500:
 *         description: Error del servidor
 */
router.get("/tasks/nearby", authRequired, getNearbyTasks);

/**
 * @swagger
 * /task/{id}:
 *   get:
 *     summary: Busca una tarea específica por su ID
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID de la tarea que buscas
 *     responses:
 *       200:
 *         description: Aquí está la tarea que pediste
 *       404:
 *         description: No encontramos esa tarea
 *       401:
 *         description: No tienes permiso
 */
router.get("/task/:id", authRequired, getOneTask);

/**
 * @swagger
 * /task/{id}:
 *   delete:
 *     summary: Elimina una tarea que ya no necesites
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID de la tarea a borrar
 *     responses:
 *       200:
 *         description: Tarea eliminada correctamente
 *       404:
 *         description: Esa tarea no existe
 *       401:
 *         description: No autorizado
 */
router.delete("/task/:id", authRequired, deleteTask);

/**
 * @swagger
 * /task/{id}:
 *   put:
 *     summary: Modifica los detalles de una tarea existente
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID de la tarea a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Nuevo título
 *               description:
 *                 type: string
 *                 description: Nueva descripción
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Nueva fecha
 *     responses:
 *       200:
 *         description: Tarea actualizada con éxito
 *       404:
 *         description: No encontramos la tarea
 *       401:
 *         description: No autorizado
 */
router.put("/task/:id", authRequired, updateTask);


// ---------- RUTAS PARA TASK2 (tareas tipo 2) ----------

/**
 * @swagger
 * /taskd:
 *   post:
 *     summary: Crea una nueva tarea especial (Tipo 2)
 *     tags: [Tareas Tipo 2]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título de la tarea especial
 *               description:
 *                 type: string
 *                 description: Detalles de la tarea
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Fecha límite
 *     responses:
 *       200:
 *         description: Tarea especial creada
 *       401:
 *         description: No autorizado
 */
router.post("/taskd", authRequired, validateSchema(createTaskSchema2), createTask2);

/**
 * @swagger
 * /taskd:
 *   get:
 *     summary: Consulta tus tareas especiales (Tipo 2)
 *     tags: [Tareas Tipo 2]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tareas especiales
 *       401:
 *         description: Necesitas iniciar sesión
 */
router.get("/taskd", authRequired, getTask2);

/**
 * @swagger
 * /taskhomed:
 *   get:
 *     summary: Resumen de tareas especiales para el inicio
 *     tags: [Tareas Tipo 2]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tareas especiales destacadas
 *       401:
 *         description: Acceso denegado
 */
router.get("/taskhomed", authRequired, getTaskHome2);

/**
 * @swagger
 * /taskd/{id}:
 *   get:
 *     summary: Busca una tarea especial por ID
 *     tags: [Tareas Tipo 2]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la tarea especial
 *     responses:
 *       200:
 *         description: Detalles encontrados
 *       404:
 *         description: No existe esa tarea
 *       401:
 *         description: No autorizado
 */
router.get("/taskd/:id", authRequired, getOneTask2);

/**
 * @swagger
 * /taskd/{id}:
 *   delete:
 *     summary: Elimina una tarea especial
 *     tags: [Tareas Tipo 2]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la tarea a borrar
 *     responses:
 *       200:
 *         description: Tarea especial eliminada
 *       404:
 *         description: No encontrada
 *       401:
 *         description: No autorizado
 */
router.delete("/taskd/:id", authRequired, deleteTask2);

/**
 * @swagger
 * /taskd/{id}:
 *   put:
 *     summary: Actualiza una tarea especial
 *     tags: [Tareas Tipo 2]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la tarea a modificar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Nuevo título
 *               description:
 *                 type: string
 *                 description: Nueva descripción
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Nueva fecha
 *     responses:
 *       200:
 *         description: Tarea especial actualizada
 *       404:
 *         description: No encontrada
 *       401:
 *         description: No autorizado
 */
router.put("/taskd/:id", authRequired, updateTask2);

export default router;
