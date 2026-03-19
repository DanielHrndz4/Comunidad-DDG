import { 
    insertTask, 
    selectTask, 
    selectTaskHome,
    selectOneTask,
    deleteTaskById,
    updateTaskById
} from "../repository/task.repository.js";

/**
* Inserta una nueva tarea en la base de datos.
* @async
* @function insertNewTask
* @param {Object} taskData - Datos de la tarea.
* @returns {Promise<Object|Error>} Nueva tarea o error.
*/
export const insertNewTask = async (taskData) => {
    try {
        const newTask = await insertTask(taskData);
        return newTask;
    } catch (error) {
        return new Error(error.message);
    }
};

/**
* Obtiene tareas por el ID del usuario.
* @async
* @function selectTheTask
* @param {string} userId - ID del usuario.
* @returns {Promise<Object|Error>} Tarea(s) del usuario.
*/
export const selectTheTask = async (userId) => {
    try {
        return await selectTask(userId);
    } catch (error) {
        return new Error(error.message);
    }
};

/**
* Obtiene todas las tareas disponibles.
* @async
* @function selectTheTaskHome
* @returns {Promise<Array|Error>} Lista de tareas.
*/
export const selectTheTaskHome = async () => {
    try {
        return await selectTaskHome();
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
* Obtiene una tarea específica por su ID.
* @async
* @function selectOneTaskById
* @param {string} taskId - ID de la tarea.
* @returns {Promise<Object|Error>} Tarea encontrada o error.
*/
export const selectOneTaskById = async (taskId) => {
    try {
        const task = await selectOneTask(taskId);

        if(!task) {
            throw new Error("Tarea no encontrada");
        }
        
        return task;
    } catch (error) {
        return new Error(error.message);
    }
};

/**
* Elimina una tarea mediante su ID.
* @async
* @function deleteTaskId
* @param {string} taskId - ID de la tarea.
* @returns {Promise<Object|Error>} Tarea eliminada o error.
*/
export const deleteTaskId = async (taskId) => {
    try {
        const task = await deleteTaskById(taskId);

        if (!task) {
            throw new Error("Tarea no encontrada");
        }
    
        return task;
    } catch (error) {
        return new Error(error.message);
    }
};

/**
* Actualiza una tarea según su ID.
* @async
* @function updateTaskId
* @param {string} taskId - ID de la tarea.
* @param {Object} taskData - Datos actualizados.
* @returns {Promise<Object|Error>} Tarea actualizada o error.
*/
export const updateTaskId = async (taskId, taskData) => {
    try {
        const updateTask = await updateTaskById(taskId, taskData);

        if (!updateTask) {
            throw new Error("Tarea no encontrada");
        }
    
        return updateTask;
    } catch (error) {
        return new Error(error.message);
    }
};