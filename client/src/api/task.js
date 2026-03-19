import axios from "./axios.js";

export const createTaskRequest = (task) => axios.post("/task", task);
export const getTaskRequest = () => axios.get("/task");
export const getOneTaskRequest = (id) => axios.get(`/task/${id}`);
export const updateTaskRequest = (id, task) => axios.put(`/task/${id}`, task);
export const deleteTaskRequest = (id) => axios.delete(`/task/${id}`);
export const getTaskHomeRequest = () => axios.get("/taskHome");
export const getTaskAdminRequest = () => axios.get("/taskHome");

export const createTaskRequest2 = (task) => axios.post("/taskd", task);
export const getTaskRequest2 = () => axios.get("/taskd");
export const getOneTaskRequest2 = (id) => axios.get(`/taskd/${id}`);
export const updateTaskRequest2 = (id, task) => axios.put(`/taskd/${id}`, task);
export const deleteTaskRequest2 = (id) => axios.delete(`/taskd/${id}`);
export const getTaskHomeRequest2 = () => axios.get("/taskHomed");
export const getTaskAdminRequest2 = () => axios.get("/taskHomed");