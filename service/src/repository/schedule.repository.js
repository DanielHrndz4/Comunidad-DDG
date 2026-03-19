import Schedule from "../models/schedule.model.js";

/**
* Crea un nuevo registro de horario (schedule) en la base de datos.
* @async
* @function createSchedule
* @param {Object} scheduleData - Datos del horario a registrar.
* @returns {Promise<Object>} El documento creado.
*/
export const createSchedule = async(scheduleData) => {
    const newSchedule = new Schedule(scheduleData);
    return await newSchedule.save();
};

/**
* Obtiene todos los registros de horarios almacenados.
* @async
* @function selectSchedule
* @returns {Promise<Array>} Lista de todos los horarios.
*/
export const selectSchedule = async () => {
    return await Schedule.find();
};