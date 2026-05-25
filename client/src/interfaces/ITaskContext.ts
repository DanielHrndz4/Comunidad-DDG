import { ReactNode } from "react";
import { IReport } from "./IReport";
import { ITaskAnnouncement } from "./ITaskAnnouncement";

export interface TaskProviderProps {
    children: ReactNode;
}

export interface ITaskContext {
    tasks: IReport[];
    tasks2: ITaskAnnouncement[];

    tasksHome: IReport[];
    tasksHome2: ITaskAnnouncement[];

    tasksAdmin: IReport[];
    tasksAdmin2: ITaskAnnouncement[];

    addObject: unknown[];

    addVisit: unknown[];

    createTask: (
        task: IReport
    ) => Promise<IReport | undefined>;

    createTask2: (
        task: ITaskAnnouncement
    ) => Promise<ITaskAnnouncement | undefined>;

    getTasks: () => Promise<void>;
    getTasks2: () => Promise<void>;

    getTaskHome: () => Promise<void>;
    getTaskHome2: () => Promise<void>;

    deleteTask: (id: string) => Promise<void>;
    deleteTask2: (id: string) => Promise<void>;

    getTaskAdmin: () => Promise<void>;
    getTaskAdmin2: () => Promise<void>;

    oneTask: (id: string) => Promise<IReport | undefined>;

    oneTask2: (
        id: string
    ) => Promise<ITaskAnnouncement | undefined>;

    updateTask: (
        id: string,
        task: Partial<IReport>
    ) => Promise<void>;

    updateTask2: (
        id: string,
        task: Partial<ITaskAnnouncement>
    ) => Promise<void>;

    createScheduleVigilant: (
        object: unknown
    ) => Promise<void>;

    createVisitVigilant: (
        visit: unknown
    ) => Promise<void>;

    getVisitVigilant: () => Promise<void>;

    getSchedules: () => Promise<unknown>;
}