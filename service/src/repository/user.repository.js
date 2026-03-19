import User from "../models/user.model.js";
import bcrypt from "bcrypt";

/**
* Crea un nuevo usuario en la base de datos.
* @async
* @function createUser
* @param {Object} userData - Datos del usuario.
* @returns {Promise<Object>} Usuario creado.
*/
export const createUser = async (userData) => {
    const newUser = new User(userData);
    return await newUser.save();
};

/**
* Crea un usuario desde el panel de administrador.
* @async
* @function createUserByAdmin
* @param {Object} userData - Datos del usuario.
* @returns {Promise<Object>} Usuario creado.
*/
export const createUserByAdmin = async (userData) => {
    const newUser = new User(userData);
    return await newUser.save();
};

/**
* Busca un usuario por su nombre de usuario.
* @async
* @function findByUsername
* @param {string} username - Nombre de usuario.
* @returns {Promise<Object|null>} Usuario encontrado o null.
*/
export const findByUsername = async (username) => {
    return await User.findOne({ username });
};

/**
* Valida si la contraseña ingresada coincide con la contraseña encriptada.
* @async
* @function validatePassword
* @param {string} password - Contraseña en texto plano.
* @param {string} hashedPassword - Contraseña encriptada.
* @returns {Promise<boolean>} true si coincide, false si no.
*/
export const validatePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};

/**
* Busca un usuario por su ID.
* @async
* @function findUserById
* @param {string} id - ID del usuario.
* @returns {Promise<Object|null>} Usuario encontrado o null.
*/
export const findUserById = async (id) => {
    return await User.findById(id);
};

/**
* Obtiene todos los usuarios registrados.
* @async
* @function getAllUserFromDB
* @returns {Promise<Array>} Lista de usuarios.
*/
export const getAllUserFromDB = async () => {
    return await User.find();
};

/**
* Obtiene todos los usuarios sin filtros.
* @async
* @function getAllUserNotFilter
* @returns {Promise<Array>} Lista de usuarios.
*/
export const getAllUserNotFilter = async () => {
    return await User.find();
};

/**
* Elimina un usuario por su ID.
* @async
* @function deleteUser
* @param {string} id - ID del usuario a eliminar.
* @returns {Promise<Object|null>} Usuario eliminado o null.
*/
export const deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
};

/**
* Obtiene un usuario por su ID.
* @async
* @function getUserById
* @param {string} id - ID del usuario.
* @returns {Promise<Object|null>} Usuario encontrado o null.
*/
export const getUserById = async(id) => {
    return await User.findById(id);
};

/**
* Actualiza los datos de un usuario por su ID.
* @async
* @function updateUserById
* @param {string} id - ID del usuario.
* @param {Object} updateData - Datos a actualizar.
* @returns {Promise<Object|null>} Usuario actualizado.
*/
export const updateUserById = async (id, updateData) => {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
};

/**
* Actualiza la contraseña de un usuario según su nombre de usuario.
* @async
* @function updatePasswordByUsername
* @param {string} username - Nombre del usuario.
* @param {string} newHashedPassword - Nueva contraseña encriptada.
* @returns {Promise<Object|null>} Usuario actualizado.
*/
export const updatePasswordByUsername = async (username, newHashedPassword) => {
    return await User.findOneAndUpdate(
        { username },
        { password: newHashedPassword },
        { new: true }
    );
};
