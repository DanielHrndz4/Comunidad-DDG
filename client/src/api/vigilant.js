import axios from "./axios.js";

export const createNewSchedule = (schedule) => axios.post("/schedules", schedule);
export const getAllSchedule = () => axios.get("/schedules");
export const createVisit = (visit) => axios.post("/visit", visit);
export const getVisits = () => axios.get("/visits");