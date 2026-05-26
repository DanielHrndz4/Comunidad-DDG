import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const createUser = async (userData: Record<string, unknown>) => {
    const newUser = new User(userData);
    return await newUser.save();
};

export const createUserByAdmin = async (userData: Record<string, unknown>) => {
    const newUser = new User(userData);
    return await newUser.save();
};

export const findByUsername = async (username: string) => {
    return await User.findOne({ username });
};

export const validatePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
};

export const findUserById = async (id: string) => {
    return await User.findById(id);
};

export const getAllUserFromDB = async () => {
    return await User.find();
};

export const getAllUserNotFilter = async () => {
    return await User.find();
};

export const deleteUser = async (id: string) => {
    return await User.findByIdAndDelete(id);
};

export const getUserById = async(id: string) => {
    return await User.findById(id);
};

export const updateUserById = async (id: string, updateData: Record<string, unknown>) => {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
};

export const updatePasswordByUsername = async (username: string, newHashedPassword: string) => {
    return await User.findOneAndUpdate(
        { username },
        { password: newHashedPassword },
        { new: true }
    );
};
