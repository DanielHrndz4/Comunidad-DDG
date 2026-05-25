import axios from "../api/axios";
import { IPayment } from "../interfaces/IPayment";

export const addPayment = (payment: IPayment) => {
  return axios.post("/payVigilance", payment);
};