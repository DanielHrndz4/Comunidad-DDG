import axios from "./axios";

type SchedulePayload = unknown;
type VisitPayload = unknown;

export const createNewSchedule = (
  schedule: SchedulePayload
) => axios.post("/schedules", schedule);

export const getAllSchedule = () =>
  axios.get("/schedules");

export const createVisit = (
  visit: VisitPayload
) => axios.post("/visit", visit);

export const getVisits = () =>
  axios.get("/visits");