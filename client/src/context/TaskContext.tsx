import {
    createContext,
    useContext,
    useState,
} from "react";

import {
    createNewSchedule,
    createVisit,
    getAllSchedule,
    getVisits,
} from "../api/vigilant";

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
    updateTaskRequest2,
} from "../api/task";

import type {
    ITaskContext,
    TaskProviderProps,
} from "../interfaces/ITaskContext";

import type { IReport } from "../interfaces/IReport";
import type { ITaskAnnouncement } from "../interfaces/ITaskAnnouncement";

const TaskContext =
    createContext<ITaskContext | null>(null);

export const useTask = (): ITaskContext => {
    const context = useContext(TaskContext);

    if (!context) {
        throw new Error(
            "useTask debe ser usado dentro del provider"
        );
    }

    return context;
};

export function TaskProvider({
    children,
}: TaskProviderProps) {

    const [tasks, setTasks] = useState<IReport[]>([]);

    const [tasks2, setTasks2] =
        useState<ITaskAnnouncement[]>([]);

    const [tasksHome, setTaskHome] =
        useState<IReport[]>([]);

    const [tasksHome2, setTaskHome2] =
        useState<ITaskAnnouncement[]>([]);

    const [tasksAdmin, setTaskAdmin] =
        useState<IReport[]>([]);

    const [tasksAdmin2, setTaskAdmin2] =
        useState<ITaskAnnouncement[]>([]);

    const [addObject] = useState<unknown[]>([]);

    const [addVisit, setAddVisit] =
        useState<unknown[]>([]);

    const getTaskAdmin = async (): Promise<void> => {
        try {
            const res = await getTaskAdminRequest();

            setTaskAdmin(res.data.data);

        } catch (error: unknown) {
            console.log(error);
        }
    };

    const getTaskAdmin2 = async (): Promise<void> => {
        try {
            const res = await getTaskAdminRequest2();

            setTaskAdmin2(res.data.data);

        } catch (error: unknown) {
            console.log(error);
        }
    };

    const getTaskHome = async (): Promise<void> => {
        try {
            const res = await getTaskHomeRequest();

            setTaskHome(res.data.data);

        } catch (error: unknown) {
            console.log(error);
        }
    };

    const getTaskHome2 = async (): Promise<void> => {
        try {
            const res = await getTaskHomeRequest2();

            setTaskHome2(res.data.data);

        } catch (error: unknown) {
            console.log(error);
        }
    };

    const getTasks = async (): Promise<void> => {
        try {
            const res = await getTaskRequest();

            setTasks(res.data.data);

        } catch (error: unknown) {
            console.log(error);
        }
    };

    const getTasks2 = async (): Promise<void> => {
        try {
            const res = await getTaskRequest2();

            setTasks2(res.data.data);

        } catch (error: unknown) {
            console.log(error);
        }
    };

    const createTask = async (
        task: IReport
    ): Promise<IReport | undefined> => {

        try {
            const res = await createTaskRequest(task);

            setTaskAdmin((prev) => [
                ...prev,
                res.data.data,
            ]);

            return res.data.data;

        } catch (error: unknown) {
            console.log(error);
        }
    };

    const createTask2 = async (
        task: ITaskAnnouncement
    ): Promise<ITaskAnnouncement | undefined> => {

        try {
            const res = await createTaskRequest2(task);

            setTaskAdmin2((prev) => [
                ...prev,
                res.data.data,
            ]);

            return res.data.data;

        } catch (error: unknown) {
            console.log(error);
        }
    };

    const deleteTask = async (
        id: string
    ): Promise<void> => {

        try {
            await deleteTaskRequest(id);
            setTaskAdmin((prev) => prev.filter((t) => t._id !== id));

        } catch (error: unknown) {
            console.log(error);
        }
    };

    const deleteTask2 = async (
        id: string
    ): Promise<void> => {

        try {
            await deleteTaskRequest2(id);
            setTaskAdmin2((prev) => prev.filter((t) => t._id !== id));

        } catch (error: unknown) {
            console.log(error);
        }
    };

    const oneTask = async (
        id: string
    ): Promise<IReport | undefined> => {

        try {
            const res = await getOneTaskRequest(id);

            return res.data.data;

        } catch (error: unknown) {
            console.log(error);
        }
    };

    const oneTask2 = async (
        id: string
    ): Promise<ITaskAnnouncement | undefined> => {

        try {
            const res = await getOneTaskRequest2(id);

            return res.data.data;

        } catch (error: unknown) {
            console.log(error);
        }
    };

    const updateTask = async (
        id: string,
        task: Partial<IReport>
    ): Promise<void> => {

        try {
            const res = await updateTaskRequest(id, task);
            setTaskAdmin((prev) =>
                prev.map((t) => (t._id === id ? { ...t, ...res.data.data } : t))
            );
        } catch (error: unknown) {
            console.error(error);
        }
    };

    const updateTask2 = async (
        id: string,
        task: Partial<ITaskAnnouncement>
    ): Promise<void> => {

        try {
            const res = await updateTaskRequest2(id, task);
            setTaskAdmin2((prev) =>
                prev.map((t) => (t._id === id ? { ...t, ...res.data.data } : t))
            );
        } catch (error: unknown) {
            console.error(error);
        }
    };

    const createScheduleVigilant = async (
        object: unknown
    ): Promise<void> => {

        try {
            await createNewSchedule(object);

        } catch (error: unknown) {
            console.log(error);
        }
    };

    const createVisitVigilant = async (
        visit: unknown
    ): Promise<void> => {

        try {
            await createVisit(visit);
            await getVisitVigilant();
        } catch (error: unknown) {
            console.log(error);
        }
    };

    const getSchedules = async (): Promise<unknown> => {

        try {
            const res = await getAllSchedule();

            return res.data.data;

        } catch (error: unknown) {
            console.log(error);
        }
    };

    const getVisitVigilant = async (): Promise<void> => {

        try {
            const res = await getVisits();

            setAddVisit(res.data.data);

        } catch (error: unknown) {
            console.log(error);
        }
    };

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
                getSchedules,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
}