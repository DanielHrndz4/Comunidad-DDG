import Task2 from "../models/task2.model.js";

// Controlador para crear una nueva tarea del modelo Task2
export const createTask2 = async (req, res) => {
    try {
        // Extrae los datos enviados desde el cliente
        const { title2, description2, image, date2 } = req.body;

        // Crea una nueva instancia del modelo con los datos y el usuario autenticado
        const newTask = new Task2({
            title2,
            description2,
            image,
            date2,
            user: req.user.id
        });

        // Guarda la tarea en la base de datos
        const saveTask = await newTask.save();

        // Retorna la tarea creada
        res.json(saveTask);
    } catch (error) {
        // Manejo de error si ocurre algún problema
        return res.status(500).json({ message: "Error al crear un task" });
    }
}

// Controlador para obtener las tareas del usuario autenticado
export const getTask2 = async (req, res) => {
    try {
        // Busca tareas asociadas al usuario y hace populate del campo user
        const tasks = await Task2.find({ user: req.user.id }).populate("user");
        res.json(tasks);
    } catch (error) {
        // Manejo de errores
        return res.status(402).json({ message: "Error al obtener las tareas" });
    }
}

// Controlador para obtener todas las tareas (home o vista pública)
export const getTaskHome2 = async (req, res) => {
    // Obtiene todas las tareas sin filtros
    const tasks = await Task2.find();
    res.json(tasks);
}

// Controlador para obtener una sola tarea por ID
export const getOneTask2 = async (req, res) => {
    try {
        // Busca la tarea por ID y hace populate del usuario
        const task = await Task2.findById(req.params.id).populate("user");

        // Si no existe, devuelve error 404
        if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

        // Si existe, la retorna
        res.json(task);
    } catch (error) {
        // Manejo de errores
        return res.status(404).json({ message: "Tarea no encontrada" });
    }
}

// Controlador para eliminar una tarea por ID
export const deleteTask2 = async (req, res) => {
    try {
        // Busca y elimina la tarea por ID
        const task = await Task2.findByIdAndDelete(req.params.id);

        // Si no se encuentra, error 404
        if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

        // Si se elimina, retorna estado 204 sin contenido
        return res.sendStatus(204);
    } catch (error) {
        return res.status(404).json({ message: "Task no encontrado" });
    }
}

// Controlador para actualizar una tarea por ID
export const updateTask2 = async (req, res) => {
    try {
        // Actualiza la tarea y retorna la versión nueva
        const task = await Task2.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Si no existe, error 404
        if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

        // Retorna la tarea actualizada
        res.json(task);
    } catch (error) {
        return res.status(404).json({ message: "Task no encontrado" });
    }
}
