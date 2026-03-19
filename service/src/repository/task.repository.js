import Task from "../models/task.model.js";

/**
* Inserta una nueva tarea en la base de datos.
* @async
* @function insertTask
* @param {Object} taskData - Datos de la tarea a guardar.
* @returns {Promise<Object>} La tarea creada.
*/
export const insertTask = async (taskData) => {
    const newTask = new Task(taskData);
    return await newTask.save();
};

/**
* Obtiene las tareas asociadas a un usuario.
* @async
* @function selectTask
* @param {string} userId - ID del usuario dueño de las tareas.
* @returns {Promise<Object|null>} Tarea encontrada o null.
*/
export const selectTask = async (userId) => {
    return await Task.findById({ user: userId }).populate();
};

/**
* Obtiene todas las tareas de la base de datos.
* @async
* @function selectTaskHome
* @returns {Promise<Array>} Lista de tareas.
* @throws {Error} Cuando ocurre un fallo al consultar la base.
*/
export const selectTaskHome = async () => {
    try {
        const tasks = await Task.find();
        return tasks;
    } catch (error) {
        throw new Error('Error al obtener las tareas desde la base de datos');
    }
};

/**
* Obtiene una tarea específica por su ID.
* @async
* @function selectOneTask
* @param {string} taskId - ID de la tarea.
* @returns {Promise<Object|null>} Tarea encontrada o null.
*/
export const selectOneTask = async (taskId) => {
    return await Task.findById(taskId).populate("user");
};

/**
* Elimina una tarea por su ID.
* @async
* @function deleteTaskById
* @param {string} taskId - ID de la tarea a eliminar.
* @returns {Promise<Object|null>} Documento eliminado o null.
*/
export const deleteTaskById = async (taskId) => {
    return await Task.findByIdAndDelete(taskId);
};

/**
* Actualiza una tarea por su ID.
* @async
* @function updateTaskById
* @param {string} taskId - ID de la tarea a actualizar.
* @param {Object} taskData - Datos actualizados.
* @returns {Promise<Object|null>} La tarea actualizada.
*/
export const updateTaskById = async (taskId, taskData) => {
    return await Task.findByIdAndUpdate(taskId, taskData, { new: true });
};