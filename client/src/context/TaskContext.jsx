// Importa hooks de React para crear contexto, manejar estados y usar contexto.
import { createContext, useContext, useState } from "react";

// Importa funciones de la API relacionadas con horarios y visitas de vigilantes.
import { createNewSchedule, createVisit, getAllSchedule, getVisits } from "../api/vigilant.js";

// Importa funciones de la API relacionadas con tareas (tasks).
// Se incluyen versiones duplicadas (1 y 2) para distintos contextos o endpoints.
import {
    createTaskRequest,
    getTaskRequest,
    getTaskHomeRequest,
    deleteTaskRequest,
    getTaskAdminRequest,
    getOneTaskRequest,
    updateTaskRequest,
    createTaskRequest2,
    getTaskRequest2,
    getTaskHomeRequest2,
    deleteTaskRequest2,
    getTaskAdminRequest2,
    getOneTaskRequest2,
    updateTaskRequest2
} from "../api/task.js";

// Crea un contexto para gestionar tareas y horarios globalmente.
const TaskContext = createContext();

// Hook personalizado para acceder al contexto de tareas.
// Lanza un error si se intenta usar fuera del TaskProvider.
export const useTask = () => {
    const context = useContext(TaskContext);

    if (!context) {
        throw new Error("useStack debe ser usado en el provider");
    }
    return context;
}

// Provider del contexto de tareas, envuelve componentes que necesitan acceso a tareas y horarios.
export function TaskProvider({ children }) {

    // Estados para distintos tipos de tareas y vistas.
    const [tasks, setTasks] = useState([]);             // Lista general de tasks
    const [tasks2, setTasks2] = useState([]);           // Lista duplicada para otro contexto
    const [tasksHome, setTaskHome] = useState([]);      // Tasks para la vista Home
    const [tasksHome2, setTaskHome2] = useState([]);    // Tasks Home duplicado
    const [tasksAdmin, setTaskAdmin] = useState([]);    // Tasks para vista Admin
    const [tasksAdmin2, setTaskAdmin2] = useState([]);  // Tasks Admin duplicado
    const [addObject] = useState([]);                   // Objeto adicional para tareas (no se setea)
    const [addVisit, setAddVisit] = useState([]);       // Lista de visitas creadas
    const [setSchedules] = useState([]);               // Horarios de vigilantes (no usado actualmente)

    // Obtener tareas para vista Admin
    const getTaskAdmin = async () => {
        try {
            const res = await getTaskAdminRequest();
            setTaskAdmin(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const getTaskAdmin2 = async () => {
        try {
            const res = await getTaskAdminRequest2();
            setTaskAdmin2(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    // Obtener tareas para vista Home
    const getTaskHome = async () => {
        try {
            const res = await getTaskHomeRequest();
            setTaskHome(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const getTaskHome2 = async () => {
        try {
            const res = await getTaskHomeRequest2();
            setTaskHome2(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    // Obtener lista general de tareas
    const getTasks = async () => {
        try {
            const res = await getTaskRequest();
            setTasks(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const getTasks2 = async () => {
        try {
            const res = await getTaskRequest2();
            setTasks2(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    // Crear nueva tarea y agregar a la lista Admin
    const createTask = async (task) => {
        try {
            const res = await createTaskRequest(task);
            setTaskAdmin(prev => [...prev, res.data]);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const createTask2 = async (task) => {
        try {
            const res = await createTaskRequest2(task);
            setTaskAdmin2(prev => [...prev, res.data]);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }

    // Eliminar tarea
    const deleteTask = async (id) => {
        try {
            await deleteTaskRequest(id);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteTask2 = async (id) => {
        try {
            await deleteTaskRequest2(id);
        } catch (error) {
            console.log(error);
        }
    }

    // Obtener una tarea específica
    const oneTask = async (id) => {
        try {
            const res = await getOneTaskRequest(id);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const oneTask2 = async (id) => {
        try {
            const res = await getOneTaskRequest2(id);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    // Actualizar tarea
    const updateTask = async (id, task) => {
        try {
            await updateTaskRequest(id, task);
        } catch (error) {
            console.error(error);
        }
    };

    const updateTask2 = async (id, task) => {
        try {
            await updateTaskRequest2(id, task);
        } catch (error) {
            console.error(error);
        }
    };

    // Crear nuevo horario para vigilante
    const createScheduleVigilant = async (object) => {
        try {
            await createNewSchedule(object);
        } catch (error) {
            console.log(error);
        }
    }

    // Crear nueva visita para vigilante
    const createVisitVigilant = async (visit) => {
        try {
            await createVisit(visit);
        } catch (error) {
            console.log(error);
        }
    }

    // Obtener todos los horarios de vigilantes
    const getSchedules = async () => {
        try {
            const res = await getAllSchedule();
            //setSchedules(res.data); // actualmente comentado
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    // Obtener visitas de vigilantes
    const getVisitVigilant = async () => {
        try {
            const res = await getVisits();
            setAddVisit(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    // Provee todos los estados y funciones del contexto a los componentes hijos.
    return (
        <TaskContext.Provider
            value={{
                tasks,
                tasks2,
                createTask,
                createTask2,
                getTasks,
                getTasks2,
                getTaskHome,
                getTaskHome2,
                tasksHome,
                tasksHome2,
                deleteTask,
                deleteTask2,
                tasksAdmin,
                tasksAdmin2,
                getTaskAdmin,
                getTaskAdmin2,
                oneTask,
                oneTask2,
                updateTask,
                updateTask2,
                addObject,
                addVisit,
                createScheduleVigilant,
                createVisitVigilant,
                getVisitVigilant,
                getSchedules
            }}>
            {children}
        </TaskContext.Provider>
    );
}
