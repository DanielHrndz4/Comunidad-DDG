import Schedule from "../models/schedule.model.js";
import { selectSchedule } from "../repository/schedule.repository.js";

export class VigilantService {
    // Servicio para crear o actualizar un horario en la base de datos
    public async createNewSchedule(scheduleData: Record<string, unknown>) {
        if(!scheduleData.name) {
            throw new Error("El nombre del horario es obligatorio");
        }

        const existing = await Schedule.findOne({ name: scheduleData.name });
        if (existing) {
            Object.assign(existing, scheduleData);
            return await existing.save();
        } else {
            const newSchedule = new Schedule(scheduleData);
            return await newSchedule.save();
        }
    }

    // Servicio para obtener todos los horarios almacenados
    public async getAllSchedulesService() {
        const schedules = await selectSchedule();
        return schedules;
    }
}