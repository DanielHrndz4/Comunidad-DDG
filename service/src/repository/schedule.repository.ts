import Schedule from "../models/schedule.model.js";

export const createSchedule = async (scheduleData: Record<string, unknown>) => {
    const newSchedule = new Schedule(scheduleData);
    return await newSchedule.save();
};

export const selectSchedule = async () => {
    return await Schedule.find();
};