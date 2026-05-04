import axios from "../api/axios";
import { IReport } from "../interfaces/IReport";

export const createReport = (report: IReport) => {
  return axios.post("/tasks", report); // ajusta ruta si es necesario
};