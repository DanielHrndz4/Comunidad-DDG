import { createSchedule, selectSchedule } from "../repository/schedule.repository.js";

// Servicio para crear un nuevo horario en la base de datos
export const createNewSchedule = async (scheduleData) => {
    if(!scheduleData.name) {
        throw new Error("El nombre del horario es obligatorio");
    }

    const newSchedule = await createSchedule(scheduleData);
    return newSchedule;
};

// Servicio para obtener todos los horarios almacenados
export const getAllSchedulesService = async () => {
    const schedules = await selectSchedule();
    return schedules;
};