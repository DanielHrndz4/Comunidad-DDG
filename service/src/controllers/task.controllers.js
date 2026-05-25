import {
    insertNewTask,
    selectTheTask,
    selectTheTaskHome,
    selectOneTaskById,
    deleteTaskId,
    updateTaskId,
    selectNearbyTasks
} from "../services/task.services.js";

// Controlador para crear una nueva tarea
export const createTask = async (req, res) => {
    const { title, description, image, date, location } = req.body;

    try {
        const newTask = {
            title,
            description,
            image,
            date,
            user: req.user.id,
            ...(location && { location })
        };

        const saveTask = await insertNewTask(newTask);

        return res.status(201).json(saveTask);
    } catch (error) {
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
export const getTaskHome = async (_req, res) => {
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

// Controlador para obtener tareas cercanas a una coordenada — responde en GeoJSON FeatureCollection (RFC 7946)
export const getNearbyTasks = async (req, res) => {
    const { longitude, latitude, radius } = req.query;

    if (!longitude || !latitude || !radius) {
        return res.status(400).json({ message: "Se requieren los parámetros: longitude, latitude, radius" });
    }

    const lng = parseFloat(longitude);
    const lat = parseFloat(latitude);
    const rad = parseFloat(radius);

    if (isNaN(lng) || lng < -180 || lng > 180) {
        return res.status(400).json({ message: "La longitud debe ser un número entre -180 y 180" });
    }
    if (isNaN(lat) || lat < -90 || lat > 90) {
        return res.status(400).json({ message: "La latitud debe ser un número entre -90 y 90" });
    }
    if (isNaN(rad) || rad <= 0) {
        return res.status(400).json({ message: "El radio debe ser un número positivo (en metros)" });
    }

    try {
        const tasks = await selectNearbyTasks(lng, lat, rad);

        const featureCollection = {
            type: "FeatureCollection",
            features: tasks.map((task) => ({
                type: "Feature",
                geometry: task.location,
                properties: {
                    id: task._id,
                    title: task.title,
                    description: task.description,
                    date: task.date,
                    image: task.image,
                    user: task.user
                }
            }))
        };

        return res.json(featureCollection);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener tareas cercanas", error: error.message });
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
