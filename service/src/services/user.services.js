import bcrypt from "bcrypt";
import { createAccessToken } from "../libs/jwt.js";
import User from "../models/user.model.js";
import {
    createUser,
    createUserByAdmin,
    findByUsername,
    validatePassword,
    findUserById,
    getAllUserFromDB,
    getAllUserNotFilter,
    deleteUser,
    getUserById,
    updateUserById,
    updatePasswordByUsername
} from "../repository/user.repository.js";

/**
* Registra un nuevo usuario aplicando encriptación a la contraseña.
*/
export const registerUser = async (userData) => {
    const { username, password } = userData;

    const userFound = await User.findOne({ username });

    if (userFound) {
        throw new Error("El usuario ya existe");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userSave = await createUser({ ...userData, password: passwordHash });

    return {
        user: {
            id: userSave._id,
            name: userSave.name,
            username: userSave.username,
            email: userSave.email,
            age: userSave.age,
            role: userSave.role,
            telephone: userSave.telephone,
            createAt: userSave.createdAt,
            updateAt: userSave.updatedAt
        }
    };
};

/**
* Registra un usuario desde el panel de administración.
*/
export const registerUserByAdmin = async (userData) => {
    const { username, password } = userData;

    const userFound = await User.findOne({ username });

    if (userFound) {
        throw new Error("El usuario ya existe");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userSave = await createUserByAdmin({ ...userData, password: passwordHash });

    return {
        user: {
            id: userSave._id,
            name: userSave.name,
            username: userSave.username,
            email: userSave.email,
            age: userSave.age,
            role: userSave.role,
            telephone: userSave.telephone,
            createAt: userSave.createdAt,
            updateAt: userSave.updatedAt
        }
    };
};

/**
* Autentica un usuario verificando credenciales y generando JWT.
*/
export const authUser = async (username, password) => {
    const user = await findByUsername(username);

    if (!user) {
        throw new Error("Usuario no encontrado");
    }

    const passwordValid = await validatePassword(password, user.password);

    if (!passwordValid) {
        throw new Error("Datos incorrectos");
    }

    const token = await createAccessToken({ id: user._id });

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            age: user.age,
            role: user.role,
            telephone: user.telephone,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    };

};

/**
* Obtiene el perfil de un usuario por su ID.
*/
export const getUserProfile = async (userId) => {
    const user = await findUserById(userId);

    if (!user) {
        throw new Error("Usuario no encontrado");
    }
    return user;
};

/**
* Obtiene usuarios (excepto administradores) y los formatea.
*/
export const selectUsers = async () => {
    try {
        const users = await getAllUserFromDB();

        if (users.length === 0) {
            throw new Error("No se encontraron usuarios");
        }

        const filterUser = users.filter(user => user.role !== "admin");

        return filterUser.map(user => ({
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));
    } catch (error) {
        throw new Error(error.message || "Error en el servicio de usuarios");
    }
};

/**
* Obtiene todos los usuarios sin filtros.
*/
export const selectUsersNotFilter = async () => {
    try {
        const users = await getAllUserNotFilter();

        if (users.length === 0) {
            throw new Error("No se encontraron usuarios");
        }

        return users.map(user => ({
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));
    } catch (error) {
        throw new Error(error.message || "Error en el servicio de usuarios");
    }
};

/**
* Elimina un usuario por ID.
*/
export const dropUser = async (id) => {
    const user = await deleteUser(id);
    if (!user) {
        throw new Error("Usuario no encontrado");
    }
    return user;
};

/**
* Obtiene un usuario por ID.
*/
export const selectUserProfile = async (id) => {
    const profile = await getUserById(id);

    if (!profile) {
        throw new Error("Usuario no encontrado");
    }
    return profile;
};

/**
* Actualiza un usuario incluyendo el proceso de encriptación si cambia contraseña.
*/
export const updateUserProfile = async (id, updateData) => {
    if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    
    const updateProfile = await updateUserById(id, updateData);

    if (!updateProfile) {
        throw new Error("Usuario no encontrado");
    }
    return updateProfile;
};

/**
* Cambia la contraseña de un usuario usando su username.
*/
export const changePassword = async (username, newPassword) => {
    const user = await findByUsername(username);

    if (!user) {
        throw new Error("Usuario no encontrado");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await updatePasswordByUsername(username, hashedPassword);

    return {
        message: "Contraseña actualizada correctamente",
        updatedAt: updatedUser.updatedAt
    };
};
