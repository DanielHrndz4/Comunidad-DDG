import { createSchedule, selectSchedule } from "../repository/schedule.repository.js";

export class VigilantService {
    // Servicio para crear un nuevo horario en la base de datos
    public async createNewSchedule(scheduleData: Record<string, unknown>) {
        if(!scheduleData.name) {
            throw new Error("El nombre del horario es obligatorio");
        }

        const newSchedule = await createSchedule(scheduleData);
        return newSchedule;
    }

    // Servicio para obtener todos los horarios almacenados
    public async getAllSchedulesService() {
        const schedules = await selectSchedule();
        return schedules;
    }
}