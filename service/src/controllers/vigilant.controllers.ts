import { Request, Response } from "express";
import Visit from "../models/visit.model.js";
import { VigilantService } from "../services/vigilant.services.js";
import { HttpResponse } from "../utils/http.response.js";
import { HttpCodes } from "../constants/http.code.js";

const vigilantService = new VigilantService();

export class VigilantController {
    // Controlador para crear un nuevo horario
    public async createSchedule(req: Request, res: Response): Promise<Response> {
        try {
            const { name, lunes, martes, miercoles, jueves, viernes, sabado, domingo } = req.body;
            const scheduleData = { name, lunes, martes, miercoles, jueves, viernes, sabado, domingo };

            const saveSchedule = await vigilantService.createNewSchedule(scheduleData);
            return res.status(HttpCodes.CREATED).json(HttpResponse(HttpCodes.CREATED, "Horario creado exitosamente", saveSchedule, true));
        } catch (error: unknown) {
            const err = error as Error;
            return res.status(HttpCodes.BAD_REQUEST).json(HttpResponse(HttpCodes.BAD_REQUEST, err.message, null, false));
        }
    }

    // Controlador para crear una visita
    public async createVisit(req: Request, res: Response): Promise<Response> {
        try {
            const { visitName, dui, numPlaca, visitHouse, date } = req.body;
            
            const newVisit = new Visit({
                visitName, dui, numPlaca, visitHouse, date
            });

            const saveSchedule = await newVisit.save();
            return res.status(HttpCodes.CREATED).json(HttpResponse(HttpCodes.CREATED, "Visita creada exitosamente", saveSchedule, true));
        } catch (error: unknown) {
            const err = error as Error;
            return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json(HttpResponse(HttpCodes.INTERNAL_SERVER_ERROR, "Error al almacenar una visita", err.message, false));
        }
    }

    // Controlador para obtener todos los horarios registrados
    public async getAllSchedules(req: Request, res: Response): Promise<Response> {
        try {
            const schedules = await vigilantService.getAllSchedulesService();
            return res.status(HttpCodes.OK).json(HttpResponse(HttpCodes.OK, "Horarios obtenidos", schedules, true));
        } catch (error: unknown) {
            const err = error as Error;
            return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json(HttpResponse(HttpCodes.INTERNAL_SERVER_ERROR, "Error al obtener resultados", err.message, false));
        }
    }

    // Controlador para obtener todas las visitas registradas
    public async getAllVisits(req: Request, res: Response): Promise<Response> {
        try {
            const visit = await Visit.find();
            return res.status(HttpCodes.OK).json(HttpResponse(HttpCodes.OK, "Visitas obtenidas", visit, true));
        } catch (error: unknown) {
            const err = error as Error;
            return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json(HttpResponse(HttpCodes.INTERNAL_SERVER_ERROR, "Error al obtener resultados", err.message, false));
        }
    }
}

export const vigilantController = new VigilantController();
