import Task from "../models/task.model.js";

export const insertTask = async (taskData: Record<string, unknown>) => {
    const newTask = new Task(taskData);
    return await newTask.save();
};

export const selectTask = async (userId: string) => {
    return await Task.find({ user: userId }).populate("user");
};

export const selectTaskHome = async () => {
    try {
        const tasks = await Task.find();
        return tasks;
    } catch (error) {
        throw new Error('Error al obtener las tareas');
    }
};

export const selectOneTask = async (taskId: string) => {
    return await Task.findById(taskId).populate("user");
};

export const deleteTaskById = async (taskId: string) => {
    return await Task.findByIdAndDelete(taskId);
};

export const updateTaskById = async (taskId: string, taskData: Record<string, unknown>) => {
    return await Task.findByIdAndUpdate(taskId, taskData, { new: true });
};

export const selectTasksNearby = async (longitude: number, latitude: number, radius: number) => {
    return await Task.find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                },
                $maxDistance: radius
            }
        }
    }).populate("user");
};