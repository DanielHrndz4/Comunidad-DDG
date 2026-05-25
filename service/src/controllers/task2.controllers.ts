import { Request, Response } from "express";
import Task2 from "../models/task2.model.js";
import { HttpResponse } from "../utils/http.response.js";
import { HttpCodes } from "../constants/http.code.js";

export class Task2Controller {
    // Controlador para crear una nueva tarea del modelo Task2
    public async createTask2(req: Request, res: Response): Promise<Response> {
        try {
            const { title2, description2, image, date2 } = req.body;

            const userId = (req as unknown as Record<string, unknown>).user ? ((req as unknown as Record<string, unknown>).user as Record<string, unknown>).id : undefined;

            const newTask = new Task2({
                title2,
                description2,
                image,
                date2,
                user: userId
            });

            const saveTask = await newTask.save();

            return res.status(HttpCodes.CREATED).json(HttpResponse(HttpCodes.CREATED, "Task2 creado exitosamente", saveTask, true));
        } catch (error: unknown) {
            const err = error as Error;
            return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json(HttpResponse(HttpCodes.INTERNAL_SERVER_ERROR, "Error al crear un task: " + err.message, null, false));
        }
    }

    // Controlador para obtener las tareas del usuario autenticado
    public async getTask2(req: Request, res: Response): Promise<Response> {
        try {
            const userId = (req as unknown as Record<string, unknown>).user ? ((req as unknown as Record<string, unknown>).user as Record<string, unknown>).id : undefined;
            const tasks = await Task2.find({ user: userId }).populate("user");
            
            return res.status(HttpCodes.OK).json(HttpResponse(HttpCodes.OK, "Tareas obtenidas", tasks, true));
        } catch (error: unknown) {
            const err = error as Error;
            return res.status(HttpCodes.BAD_REQUEST).json(HttpResponse(HttpCodes.BAD_REQUEST, "Error al obtener las tareas: " + err.message, null, false));
        }
    }

    // Controlador para obtener todas las tareas (home o vista pública)
    public async getTaskHome2(req: Request, res: Response): Promise<Response> {
        try {
            const tasks = await Task2.find();
            return res.status(HttpCodes.OK).json(HttpResponse(HttpCodes.OK, "Todas las tareas obtenidas", tasks, true));
        } catch (error: unknown) {
            const err = error as Error;
            return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json(HttpResponse(HttpCodes.INTERNAL_SERVER_ERROR, "Error al obtener las tareas", err.message, false));
        }
    }

    // Controlador para obtener una sola tarea por ID
    public async getOneTask2(req: Request, res: Response): Promise<Response> {
        try {
            const task = await Task2.findById(req.params.id).populate("user");

            if (!task) {
                return res.status(HttpCodes.NOT_FOUND).json(HttpResponse(HttpCodes.NOT_FOUND, "Tarea no encontrada", null, false));
            }

            return res.status(HttpCodes.OK).json(HttpResponse(HttpCodes.OK, "Tarea obtenida", task, true));
        } catch (error: unknown) {
            const err = error as Error;
            return res.status(HttpCodes.NOT_FOUND).json(HttpResponse(HttpCodes.NOT_FOUND, "Tarea no encontrada: " + err.message, null, false));
        }
    }

    // Controlador para eliminar una tarea por ID
    public async deleteTask2(req: Request, res: Response): Promise<Response> {
        try {
            const task = await Task2.findByIdAndDelete(req.params.id);

            if (!task) {
                return res.status(HttpCodes.NOT_FOUND).json(HttpResponse(HttpCodes.NOT_FOUND, "Tarea no encontrada", null, false));
            }

            return res.status(HttpCodes.NO_CONTENT).json(HttpResponse(HttpCodes.NO_CONTENT, "Tarea eliminada", null, true));
        } catch (error: unknown) {
            const err = error as Error;
            return res.status(HttpCodes.NOT_FOUND).json(HttpResponse(HttpCodes.NOT_FOUND, "Task no encontrado: " + err.message, null, false));
        }
    }

    // Controlador para actualizar una tarea por ID
    public async updateTask2(req: Request, res: Response): Promise<Response> {
        try {
            const task = await Task2.findByIdAndUpdate(req.params.id, req.body, { new: true });

            if (!task) {
                return res.status(HttpCodes.NOT_FOUND).json(HttpResponse(HttpCodes.NOT_FOUND, "Tarea no encontrada", null, false));
            }

            return res.status(HttpCodes.OK).json(HttpResponse(HttpCodes.OK, "Tarea actualizada", task, true));
        } catch (error: unknown) {
            const err = error as Error;
            return res.status(HttpCodes.NOT_FOUND).json(HttpResponse(HttpCodes.NOT_FOUND, "Task no encontrado: " + err.message, null, false));
        }
    }
}

export const task2Controller = new Task2Controller();
