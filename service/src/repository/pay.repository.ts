import Pay from "../models/pay.vigilance.model.js";

export const findPay = async (numberTarget: string | number) => {
    return await Pay.findOne({ numberTarget });
};

export const createPay = async (payData: Record<string, unknown>) => {
    const newPay = new Pay(payData);
    return await newPay.save();
};

export const getAllPays = async () => {
    return await Pay.find();
};