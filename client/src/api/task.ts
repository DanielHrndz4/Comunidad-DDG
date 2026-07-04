import axios from "./axios";

type TaskPayload = unknown;

export const createTaskRequest = (
  task: TaskPayload
) => axios.post("/task", task);

export const getTaskRequest = (page?: number, limit?: number) =>
  axios.get(page && limit ? `/task?page=${page}&limit=${limit}` : "/task");

export const getOneTaskRequest = (
  id: string
) => axios.get(`/task/${id}`);

export const updateTaskRequest = (
  id: string,
  task: TaskPayload
) => axios.put(`/task/${id}`, task);

export const deleteTaskRequest = (
  id: string
) => axios.delete(`/task/${id}`);

export const getTaskHomeRequest = (page?: number, limit?: number) =>
  axios.get(page && limit ? `/taskhome?page=${page}&limit=${limit}` : "/taskhome");

export const getTaskAdminRequest = (page?: number, limit?: number) =>
  axios.get(page && limit ? `/taskhome?page=${page}&limit=${limit}` : "/taskhome");

export const createTaskRequest2 = (
  task: TaskPayload
) => axios.post("/taskd", task);

export const getTaskRequest2 = (page?: number, limit?: number) =>
  axios.get(page && limit ? `/taskd?page=${page}&limit=${limit}` : "/taskd");

export const getOneTaskRequest2 = (
  id: string
) => axios.get(`/taskd/${id}`);

export const updateTaskRequest2 = (
  id: string,
  task: TaskPayload
) => axios.put(`/taskd/${id}`, task);

export const deleteTaskRequest2 = (
  id: string
) => axios.delete(`/taskd/${id}`);

export const getTaskHomeRequest2 = (page?: number, limit?: number) =>
  axios.get(page && limit ? `/taskhomed?page=${page}&limit=${limit}` : "/taskhomed");

export const getTaskAdminRequest2 = (page?: number, limit?: number) =>
  axios.get(page && limit ? `/taskhomed?page=${page}&limit=${limit}` : "/taskhomed");

export const getNearbyTasksRequest = (
  longitude: number,
  latitude: number,
  radius: number
) =>
  axios.get(
    `/tasks/nearby?longitude=${longitude}&latitude=${latitude}&radius=${radius}`
  );