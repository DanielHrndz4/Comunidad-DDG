import axios from "../api/axios";
import { IUser } from "../interfaces/IUser";

export const createUser = (user: IUser) => {
  return axios.post("/createUser", user);
};

export const updateUser = (
  id: string,
  user: Partial<IUser>
) => {
  return axios.put(`/profile/${id}`, user);
};