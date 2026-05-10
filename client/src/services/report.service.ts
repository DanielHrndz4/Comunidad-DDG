import axios from "../api/axios";
import { IReport } from "../interfaces/IReport";

export const createReport = (report: IReport) => {
  return axios.post("/tasks", report);
};

export const updateReport = (
  id: string,
  report: Partial<IReport>
) => {
  return axios.put(`/tasks/${id}`, report);
};
