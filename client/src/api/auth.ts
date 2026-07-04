import axios from "./axios";

import type {
    LoginFormData,
    RegisterFormData,
} from "../interfaces/IAuthForms";

export const registerRequest = (
    user: RegisterFormData
) => axios.post("/register", user);

export const loginRequest = (
    user: LoginFormData
) => axios.post("/login", user);

export const verifyTokenRequest = () =>
    axios.get("/verify");

export const logoutRequest = () =>
    axios.post("/logout");

export const getUsersAdmin = () =>
    axios.get("/users");

export const getAllUsersForUser = () =>
    axios.get("/allUser");

export const deleteUserAdmin = (
    id: string
) => axios.delete(`/users/${id}`);

export const getOneProfileUser = (
    id: string
) => axios.get(`/profile/${id}`);

export const updateOneProfile = (
    id: string,
    profile: unknown
) => axios.put(`/profile/${id}`, profile);

export const addPayVigilanceFromUser = (
    pay: unknown
) => axios.post("/payVigilance", pay);

export const getPaymentsRequest = () => axios.get("/allPay");

export const registerRequestByAdmin = (
    user: RegisterFormData
) => axios.post("/createUser", user);

export const updatePasswordRequest = ({
    username,
    password,
}: {
    username: string;
    password: string;
}) =>
    axios.put("/updatePassword", {
        username,
        password,
    });

export const verifyOtpRequest = ({
    email,
    otp,
}: {
    email: string;
    otp: string;
}) =>
    axios.post("/verify-otp", {
        email,
        otp,
    });

export const requestPasswordResetRequest = (emailOrUsername: string) =>
    axios.post("/request-password-reset", { emailOrUsername });

export const confirmPasswordResetRequest = ({
    emailOrUsername,
    otp,
    password,
}: {
    emailOrUsername: string;
    otp: string;
    password: string;
}) =>
    axios.post("/confirm-password-reset", { emailOrUsername, otp, password });