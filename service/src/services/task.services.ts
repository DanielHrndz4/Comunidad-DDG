import { 
    insertTask, 
    selectTask, 
    selectTaskHome,
    selectOneTask,
    deleteTaskById,
    updateTaskById,
    selectTasksNearby
} from "../repository/task.repository.js";

export class TaskService {
    /**
    * Inserta una nueva tarea en la base de datos.
    */
    public async insertNewTask(taskData: Record<string, unknown>) {
        const newTask = await insertTask(taskData);
        return newTask;
    }

    /**
    * Obtiene tareas por el ID del usuario.
    */
    public async selectTheTask(userId: unknown) {
        return await selectTask(userId as string);
    }

    /**
    * Obtiene todas las tareas disponibles.
    */
    public async selectTheTaskHome() {
        return await selectTaskHome();
    }

    /**
    * Obtiene una tarea específica por su ID.
    */
    public async selectOneTaskById(taskId: unknown) {
        const task = await selectOneTask(taskId as string);

        if(!task) {
            throw new Error("Tarea no encontrada");
        }
        
        return task;
    }

    /**
    * Elimina una tarea mediante su ID.
    */
    public async deleteTaskId(taskId: unknown) {
        const task = await deleteTaskById(taskId as string);

        if (!task) {
            throw new Error("Tarea no encontrada");
        }
    
        return task;
    }

    /**
    * Actualiza una tarea según su ID.
    */
    public async updateTaskId(taskId: unknown, taskData: Record<string, unknown>) {
        const updateTask = await updateTaskById(taskId as string, taskData);

        if (!updateTask) {
            throw new Error("Tarea no encontrada");
        }
    
        return updateTask;
    }

    /**
    * Obtiene tareas dentro de un radio geográfico.
    */
    public async selectNearbyTasks(longitude: number, latitude: number, radius: number) {
        try {
            return await selectTasksNearby(longitude, latitude, radius);
        } catch (error: unknown) {
            const err = error as Error;
            throw new Error(err.message);
        }
    }
}