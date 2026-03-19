import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {
  registerUser,
  registerUserByAdmin,
  authUser,
  getUserProfile,
  selectUsers,
  selectUsersNotFilter,
  dropUser,
  selectUserProfile,
  updateUserProfile,
  changePassword
} from "../services/user.services.js";
import "dotenv/config";

// Controlador para registrar un nuevo usuario desde el formulario público
export const register = async (req, res) => {
  const { name, username, email, password, telephone, age, role } = req.body;

  try {
    // Llama al servicio para registrar usuario
    const user = await registerUser({ name, username, email, password, telephone, age, role });
    res.status(201).json(user);
  } catch (error) {
    console.log("Error: No se pudo registrar usuario.", error.message);
  }
};

// Controlador para que el admin cree nuevos usuarios
export const createUserByAdmin = async (req, res) => {
  const { name, username, email, password, telephone, age, role } = req.body;

  try {
    // Llama al servicio para crear usuario desde panel admin
    const user = await registerUserByAdmin({ name, username, email, password, telephone, age, role });
    res.status(201).json(user);
  } catch (error) {
    console.log("Error: No se pudo registrar usuario.", error.message);
  }
};

// Controlador de login para autenticación
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Autenticación mediante servicio
    const { token, user } = await authUser(username, password);

    // Guarda el token en una cookie
    res.cookie('token', token);

    // Devuelve los datos del usuario autenticado
    res.json({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      age: user.age,
      telephone: user.telephone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error('Error en login:', error.response?.data || error.message);
  }
};

// Controlador para cerrar sesión eliminando cookie
export const logout = (req, res) => {
  res.clearCookie("token", "", {
    expires: new Date(0)
  })
  return res.sendStatus(200);
};

// Controlador para obtener perfil del usuario autenticado
export const profile = async (req, res) => {
  try {
    // Obtiene los datos del usuario con su ID
    const user = await getUserProfile(req.user.id);

    return res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      age: user.age,
      telephone: user.telephone,
      createAt: user.createdAt,
      updateAt: user.updatedAt,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Verificar token en cookies para mantener sesión activa
export const verifyToken = async (req, res) => {
  const { token } = req.cookies

  // Si no hay token → No autorizado
  if (!token) return res.status(401).json({ message: "No autorizado" });

  // Verifica token con JWT
  jwt.verify(token, process.env.JWT_SECRET, async (error, user) => {
    if (error) return res.status(401).json({ message: "No autorizado" });

    // Busca el usuario en DB
    const userFound = await User.findById(user.id);
    if (!userFound) return res.status(401).json({ message: "No autorizado" });

    // Devuelve datos del usuario autenticado
    return res.json({
      id: userFound._id,
      name: userFound.name,
      username: userFound.username,
      email: userFound.email,
      role: userFound.role,
      telephone: userFound.telephone,
      age: userFound.age
    });
  });
}

// Controlador para obtener usuarios filtrados (excluye admin)
export const getAllUsers = async (req, res) => {
  try {
    const user = await selectUsers();
    return res.json(user);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

// Controlador para obtener todos los usuarios sin filtros
export const getAllUser = async (req, res) => {
  try {
    const user = await selectUsersNotFilter();
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
  }
};

// Controlador para eliminar un usuario por ID
export const deleteOneUser = async (req, res) => {
  try {
    await dropUser(req.params.id);
    return res.sendStatus(204);
  } catch (error) {
    if (error.message === "Usuario no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    console.log(error);
    return res.status(500).json({ message: "Error al eliminar el usuario", error: error.message });
  }
};

// Controlador para obtener un perfil en base a un ID proporcionado
export const getOneProfile = async (req, res) => {
  try {
    const profile = await selectUserProfile(req.params.id);
    res.json(profile);
  } catch (error) {
    if (error.message === "Usuario no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    console.log(error);
    return res.status(500).json({ message: "Error al obtener el perfil", error: error.message });
  }
}

// Controlador para actualizar perfil de un usuario por ID
export const updateProfile = async (req, res) => {
  try {
    const updateProfile = await updateUserProfile(req.params.id, req.body, { new: true });
    return res.json(updateProfile);
  } catch (error) {
    if (error.message === "Usuario no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    console.log(error);
    return res.status(500).json({ message: "Error al actualizar el perfil", error: error.message });
  }
};

// Controlador para cambiar la contraseña por username
export const updatePassword = async (req, res) => {
  const { username, password } = req.body;

  try {
      const result = await changePassword(username, password);
      return res.status(200).json(result);
  } catch (error) {
      return res.status(400).json({ message: error.message });
  }
};
