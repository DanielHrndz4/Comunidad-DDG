import { 
    insertNewTask, 
    selectTheTask, 
    selectTheTaskHome,
    selectOneTaskById,
    deleteTaskId,
    updateTaskId
} from "../services/task.services.js";

// Controlador para crear una nueva tarea
export const createTask = async (req, res) => {
    const { title, description, image, date } = req.body;
    
    try {
        // Construye el objeto de la tarea incluyendo el usuario autenticado
        const newTask = {
            title,
            description,
            image, 
            date,
            user: req.user.id
        };

        // Llama al servicio para insertar la nueva tarea
        const saveTask = await insertNewTask(newTask);

        // Retorna la tarea guardada
        return res.json(saveTask);
    } catch (error) {
        // Manejo de error al crear la tarea
        return res.status(500).json({ message: "Error al crear un task" });
    }
};

// Controlador para obtener las tareas del usuario autenticado
export const getTask = async (req, res) => {
    try {
        // Obtiene las tareas filtradas por usuario
        const tasks = await selectTheTask(req.user.id );
        return res.json(tasks);
    } catch (error) {
        // Error si no se pueden obtener tareas
        return res.status(402).json({ message: "Error al obtener las tareas" });
    }
};

// Controlador para obtener todas las tareas (vista pública o home)
export const getTaskHome = async (req, res) => {
    try {
        // Obtiene todas las tareas sin filtrar
        const tasks = await selectTheTaskHome();
        return res.json(tasks);  
    } catch (error) {
        // Manejo de errores y verificación de que no se hayan enviado headers
        console.error('Error en la solicitud:', error);
        if (!res.headersSent) {
            return res.status(500).json({ message: "Error al obtener las tareas", error: error.message });
        }
    }
};

// Controlador para obtener una única tarea por ID
export const getOneTask = async (req, res) => {
    try {
        // Busca una tarea por el ID recibido en los parámetros
        const task = await selectOneTaskById(req.params.id);
        return res.json(task);
    } catch (error) {
        // Error si no se encuentra la tarea
        return res.status(404).json({ message: "Tarea no encontrada" });
    }
};

// Controlador para eliminar una tarea por ID
export const deleteTask = async (req, res) => {
    try {
        // Elimina la tarea usando el ID en los parámetros
        await deleteTaskId(req.params.id);
        return res.sendStatus(204); // Sin contenido
    } catch (error) {
        // Error si no se encuentra la tarea
        return res.status(404).json({ message: "Task no encontrado" });
    }
};

// Controlador para actualizar una tarea por ID
export const updateTask = async (req, res) => {
    try {
        // Actualiza la tarea usando el ID y los datos enviados
        const task = await updateTaskId(req.params.id, req.body);
        return res.json(task);
    } catch (error) {
        // Error si no se encuentra la tarea
        return res.status(404).json({ message: "Task no encontrado" });
    }
};
