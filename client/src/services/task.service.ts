import axios from "../api/axios";
import { ITaskAnnouncement } from "../interfaces/ITaskAnnouncement";

export const createAnnouncement = (data: ITaskAnnouncement) => {
  return axios.post("/taskd", data);
};

export const updateAnnouncement = (
  id: string,
  data: Partial<ITaskAnnouncement>
) => {
  return axios.put(`/taskd/${id}`, data);
};