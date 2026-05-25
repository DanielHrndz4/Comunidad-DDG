import axios from "./axios.js";

export const registerRequest = (user) => axios.post("/register", user);
export const loginRequest = (user) => axios.post('/login', user);
export const verifyTokenRequest = () => axios.get('/verify');
export const getUsersAdmin = () => axios.get('/users');
export const getAllUsersForUser = () => axios.get("/allUser");
export const deleteUserAdmin = (id) => axios.delete(`/users/${id}`);
export const getOneProfileUser = (id) => axios.get(`/profile/${id}`);
export const updateOneProfile = (id, profile) => axios.put(`/profile/${id}`, profile);
export const addPayVigilanceFromUser = (pay) => axios.post("/payVigilance", pay);
export const registerRequestByAdmin = (user) => axios.post("/createUser", user);
export const updatePasswordRequest = ({ username, password }) => axios.put("/updatePassword", { username, password });
