import { Request, Response } from "express";
import { TaskService } from "../services/task.services.js";
import { HttpResponse } from "../utils/http.response.js";
import { HttpCodes } from "../constants/http.code.js";

const taskService = new TaskService();

export class TaskController {
    // Controlador para crear una nueva tarea
    public async createTask(req: Request, res: Response): Promise<Response> {
        try {
            const { title, description, image, date, location } = req.body;

            const authUser = (req as any).user;

            console.log("REQ.USER:", authUser);

            const userId =
                authUser?.id ||
                authUser?._id ||
                authUser?.userId;

            if (!userId) {
                return res.status(HttpCodes.UNAUTHORIZED).json(
                    HttpResponse(
                        HttpCodes.UNAUTHORIZED,
                        "Usuario autenticado sin ID válido en el token",
                        null,
                        false
                    )
                );
            }

            const newTask = {
                title,
                description,
                image,
                date,
                user: userId,
                ...(location && { location }),
            };

            console.log("NEW TASK:", newTask);

            const saveTask = await taskService.insertNewTask(newTask);

            return res.status(HttpCodes.CREATED).json(
                HttpResponse(HttpCodes.CREATED, "Tarea creada", saveTask, true)
            );
        } catch (error: unknown) {
            const err = error as Error;
            console.error("ERROR CREATE TASK:", err);

            return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json(
                HttpResponse(
                    HttpCodes.INTERNAL_SERVER_ERROR,
                    "Error al crear un task: " + err.message,
                    null,
                    false
                )
            );
        }
    }

    // Controlador para obtener las tareas del usuario autenticado
    public async getTask(req: Request, res: Response): Promise<Response> {
        try {
            const userId = (req as unknown as Record<string, unknown>).user ? ((req as unknown as Record<string, unknown>).user as Record<string, unknown>).id : undefined;
            const tasks = await taskService.selectTheTask(userId);
            return res.status(HttpCodes.OK).json(HttpResponse(HttpCodes.OK, "Tareas obtenidas", tasks, true));
        } catch (error: unknown) {
            const err = error as Error;
            return res.status(HttpCodes.BAD_REQUEST).json(HttpResponse(HttpCodes.BAD_REQUEST, "Error al obtener las tareas: " + err.message, null, false));
        }
    }

    // Controlador para obtener todas las tareas (vista pública o home)
    public async getTaskHome(req: Request, res: Response): Promise<Response> {
        try {
            const tasks = await taskService.selectTheTaskHome();
            return res.status(HttpCodes.OK).json(HttpResponse(HttpCodes.OK, "Todas las tareas", tasks, true));
        } catch (error: unknown) {
            const err = error as Error;
            return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json(HttpResponse(HttpCodes.INTERNAL_SERVER_ERROR, "Error al obtener las tareas", null, false));
        }
    }

    // Controlador para obtener una única tarea por ID
    public async getOneTask(req: Request, res: Response): Promise<Response> {
        try {
            const task = await taskService.selectOneTaskById(req.params.id);
            return res.status(HttpCodes.OK).json(HttpResponse(HttpCodes.OK, "Tarea obtenida", task, true));
        } catch (error: unknown) {
            const err = error as Error;
            return res.status(HttpCodes.NOT_FOUND).json(HttpResponse(HttpCodes.NOT_FOUND, err.message, null, false));
        }
    }

    // Controlador para eliminar una tarea por ID
    public async deleteTask(req: Request, res: Response): Promise<Response> {
        try {
            await taskService.deleteTaskId(req.params.id);
            return res.status(HttpCodes.NO_CONTENT).json(HttpResponse(HttpCodes.NO_CONTENT, "Tarea eliminada", null, true));
        } catch (error: unknown) {
            const err = error as Error;
            return res.status(HttpCodes.NOT_FOUND).json(HttpResponse(HttpCodes.NOT_FOUND, err.message, null, false));
        }
    }

    // Controlador para actualizar una tarea por ID
    public async updateTask(req: Request, res: Response): Promise<Response> {
        try {
            const task = await taskService.updateTaskId(req.params.id, req.body);
            return res.status(HttpCodes.OK).json(HttpResponse(HttpCodes.OK, "Tarea actualizada", task, true));
        } catch (error: unknown) {
            const err = error as Error;
            return res.status(HttpCodes.NOT_FOUND).json(HttpResponse(HttpCodes.NOT_FOUND, err.message, null, false));
        }
    }

    // Controlador para obtener tareas cercanas a una coordenada — responde en GeoJSON FeatureCollection (RFC 7946)
    public async getNearbyTasks(req: Request, res: Response): Promise<Response> {
        const { longitude, latitude, radius } = req.query;

        if (!longitude || !latitude || !radius) {
            return res.status(HttpCodes.BAD_REQUEST).json(HttpResponse(HttpCodes.BAD_REQUEST, "Se requieren los parámetros: longitude, latitude, radius", null, false));
        }

        const lng = parseFloat(longitude as string);
        const lat = parseFloat(latitude as string);
        const rad = parseFloat(radius as string);

        if (isNaN(lng) || lng < -180 || lng > 180) {
            return res.status(HttpCodes.BAD_REQUEST).json(HttpResponse(HttpCodes.BAD_REQUEST, "La longitud debe ser un número entre -180 y 180", null, false));
        }
        if (isNaN(lat) || lat < -90 || lat > 90) {
            return res.status(HttpCodes.BAD_REQUEST).json(HttpResponse(HttpCodes.BAD_REQUEST, "La latitud debe ser un número entre -90 y 90", null, false));
        }
        if (isNaN(rad) || rad <= 0) {
            return res.status(HttpCodes.BAD_REQUEST).json(HttpResponse(HttpCodes.BAD_REQUEST, "El radio debe ser un número positivo (en metros)", null, false));
        }

        try {
            const tasks = await taskService.selectNearbyTasks(lng, lat, rad);

            const featureCollection = {
                type: "FeatureCollection",
                features: tasks.map((task: any) => ({
                    type: "Feature",
                    geometry: task.location,
                    properties: {
                        id: task._id,
                        title: task.title,
                        description: task.description,
                        date: task.date,
                        image: task.image,
                        user: task.user
                    }
                }))
            };

            return res.status(HttpCodes.OK).json(featureCollection);
        } catch (error: unknown) {
            const err = error as Error;
            return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json(HttpResponse(HttpCodes.INTERNAL_SERVER_ERROR, "Error al obtener tareas cercanas: " + err.message, null, false));
        }
    }
}

export const taskController = new TaskController();
