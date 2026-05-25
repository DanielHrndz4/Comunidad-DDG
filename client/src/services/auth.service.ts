import axios from "../api/axios";
import type { IUser } from "../interfaces/IUser";
import type { IPayment } from "../interfaces/IPayment";

export const registerUserService = (user: IUser) => {
    return axios.post(
        "/createUser",
        user
    );
};

export const registerService = (user: IUser) => {
    return axios.post(
        "/register",
        user
    );
};

export const loginService = (user: {
    username: string;
    password: string;
}) => {
    return axios.post(
        "/login",
        user
    );
};

export const verifyTokenService = () => {
    return axios.get("/verify");
};

export const getUsersService = () => {
    return axios.get("/users");
};

export const deleteUserService = (id: string) => {
    return axios.delete(
        `/users/${id}`
    );
};

export const getProfileService = (id: string) => {
    return axios.get(
        `/profile/${id}`
    );
};

export const updateProfileService = (
    id: string,
    user: Partial<IUser>
) => {
    return axios.put(
        `/profile/${id}`,
        user
    );
};

export const addPaymentService = (pay: IPayment) => {
    return axios.post(
        "/payments",
        pay
    );
};

export const getAllUsersService = () => {
    return axios.get(
        "/allUser"
    );
};

export const callUsersService = () => {
    return axios.get(
        "/callUsers"
    );
};

export const updatePasswordService = (data: {
    username: string;
    password: string;
}) => {
    return axios.put(
        "/updatePassword",
        data
    );
};

export const createUserService = (user: IUser) => {
    return axios.post(
        "/createUser",
        user
    );
};

export const updateUser = (
    id: string,
    user: Partial<IUser>
) => {
    return axios.put(
        `/profile/${id}`,
        user
    );
};