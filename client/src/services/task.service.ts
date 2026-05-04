import axios from "../api/axios";
import { ITaskAnnouncement } from "../interfaces/ITaskAnnouncement";

export const createAnnouncement = (data: ITaskAnnouncement) => {
  return axios.post("/tasks2", data); // ajusta si ruta es distinta
};