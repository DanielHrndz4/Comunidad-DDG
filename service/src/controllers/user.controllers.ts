import { Request, Response } from "express";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { UserService } from "../services/user.services.js";
import { HttpResponse } from "../utils/http.response.js";
import { HttpCodes } from "../constants/http.code.js";
import "dotenv/config";

const userService = new UserService();

export class UserController {
  // Controlador para registrar un nuevo usuario desde el formulario público
  public async register(req: Request, res: Response): Promise<Response> {
    try {
      const user = await userService.registerUser(req.body);
      return res.status(HttpCodes.CREATED).json(HttpResponse(HttpCodes.CREATED, "Usuario registrado exitosamente", user, true));
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(HttpCodes.BAD_REQUEST).json(HttpResponse(HttpCodes.BAD_REQUEST, err.message, null, false));
    }
  }

  // Controlador para que el admin cree nuevos usuarios
  public async createUserByAdmin(req: Request, res: Response): Promise<Response> {
    try {
      const user = await userService.registerUserByAdmin(req.body);
      return res.status(HttpCodes.CREATED).json(HttpResponse(HttpCodes.CREATED, "Usuario creado por admin", user, true));
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(HttpCodes.BAD_REQUEST).json(HttpResponse(HttpCodes.BAD_REQUEST, err.message, null, false));
    }
  }

  // Controlador de login para autenticación
  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const { username, password } = req.body;
      const { token, user } = await userService.authUser(username, password);

      res.cookie('token', token);

      return res.status(HttpCodes.OK).json(HttpResponse(HttpCodes.OK, "Login exitoso", user, true));
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(HttpCodes.UNAUTHORIZED).json(HttpResponse(HttpCodes.UNAUTHORIZED, err.message, null, false));
    }
  }

  // Controlador para cerrar sesión eliminando cookie
  public logout(req: Request, res: Response): Response {
    try {
      res.clearCookie("token", { expires: new Date(0) });
      return res.status(HttpCodes.OK).json(HttpResponse(HttpCodes.OK, "Sesión cerrada", null, true));
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json(HttpResponse(HttpCodes.INTERNAL_SERVER_ERROR, err.message, null, false));
    }
  }

  // Controlador para obtener perfil del usuario autenticado
  public async profile(req: Request, res: Response): Promise<Response> {
    try {
      // req.user debe estar tipado.
      const userId = ((req as unknown as Record<string, Record<string, string>>).user)?.id;
      const user = await userService.getUserProfile(userId);

      const profileData = {
        id: user._id,
        username: user.username,
        email: user.email,
        age: user.age,
        telephone: user.telephone,
        createAt: user.createdAt,
        updateAt: user.updatedAt,
      };

      return res.status(HttpCodes.OK).json(HttpResponse(HttpCodes.OK, "Perfil obtenido", profileData, true));
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(HttpCodes.BAD_REQUEST).json(HttpResponse(HttpCodes.BAD_REQUEST, err.message, null, false));
    }
  }

  // Verificar token en cookies para mantener sesión activa
  public async verifyToken(req: Request, res: Response): Promise<Response> {
    try {
      const { token } = req.cookies;
      if (!token) return res.status(HttpCodes.UNAUTHORIZED).json(HttpResponse(HttpCodes.UNAUTHORIZED, "No autorizado", null, false));

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
      const userFound = await User.findById(decoded.id);

      if (!userFound) return res.status(HttpCodes.UNAUTHORIZED).json(HttpResponse(HttpCodes.UNAUTHORIZED, "No autorizado", null, false));

      const userData = {
        id: userFound._id,
        name: userFound.name,
        username: userFound.username,
        email: userFound.email,
        role: userFound.role,
        telephone: userFound.telephone,
        age: userFound.age
      };

      return res.status(HttpCodes.OK).json(HttpResponse(HttpCodes.OK, "Token verificado", userData, true));
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(HttpCodes.UNAUTHORIZED).json(HttpResponse(HttpCodes.UNAUTHORIZED, "No autorizado", null, false));
    }
  }

  // Controlador para obtener usuarios filtrados (excluye admin)
  public async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const user = await userService.selectUsers();
      return res.status(HttpCodes.OK).json(HttpResponse(HttpCodes.OK, "Usuarios obtenidos", user, true));
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(HttpCodes.BAD_REQUEST).json(HttpResponse(HttpCodes.BAD_REQUEST, err.message, null, false));
    }
  }

  // Controlador para obtener todos los usuarios sin filtros
  public async getAllUser(req: Request, res: Response): Promise<Response> {
    try {
      const user = await userService.selectUsersNotFilter();
      return res.status(HttpCodes.OK).json(HttpResponse(HttpCodes.OK, "Todos los usuarios obtenidos", user, true));
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json(HttpResponse(HttpCodes.INTERNAL_SERVER_ERROR, "Error al obtener usuarios", null, false));
    }
  }

  // Controlador para eliminar un usuario por ID
  public async deleteOneUser(req: Request, res: Response): Promise<Response> {
    try {
      await userService.dropUser(req.params.id);
      return res.status(HttpCodes.NO_CONTENT).json(HttpResponse(HttpCodes.NO_CONTENT, "Usuario eliminado", null, true));
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message === "Usuario no encontrado") {
        return res.status(HttpCodes.NOT_FOUND).json(HttpResponse(HttpCodes.NOT_FOUND, err.message, null, false));
      }
      return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json(HttpResponse(HttpCodes.INTERNAL_SERVER_ERROR, "Error al eliminar el usuario", null, false));
    }
  }

  // Controlador para obtener un perfil en base a un ID proporcionado
  public async getOneProfile(req: Request, res: Response): Promise<Response> {
    try {
      const profile = await userService.selectUserProfile(req.params.id);
      return res.status(HttpCodes.OK).json(HttpResponse(HttpCodes.OK, "Perfil obtenido", profile, true));
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message === "Usuario no encontrado") {
        return res.status(HttpCodes.NOT_FOUND).json(HttpResponse(HttpCodes.NOT_FOUND, err.message, null, false));
      }
      return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json(HttpResponse(HttpCodes.INTERNAL_SERVER_ERROR, "Error al obtener el perfil", null, false));
    }
  }

  // Controlador para actualizar perfil de un usuario por ID
  public async updateProfile(req: Request, res: Response): Promise<Response> {
    try {
      const updatedProfile = await userService.updateUserProfile(req.params.id, req.body);
      return res.status(HttpCodes.OK).json(HttpResponse(HttpCodes.OK, "Perfil actualizado", updatedProfile, true));
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message === "Usuario no encontrado") {
        return res.status(HttpCodes.NOT_FOUND).json(HttpResponse(HttpCodes.NOT_FOUND, err.message, null, false));
      }
      return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json(HttpResponse(HttpCodes.INTERNAL_SERVER_ERROR, "Error al actualizar el perfil", null, false));
    }
  }

  // Controlador para cambiar la contraseña por username
  public async updatePassword(req: Request, res: Response): Promise<Response> {
    try {
      const { username, password } = req.body;
      const result = await userService.changePassword(username, password);
      return res.status(HttpCodes.OK).json(HttpResponse(HttpCodes.OK, "Contraseña actualizada", result, true));
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(HttpCodes.BAD_REQUEST).json(HttpResponse(HttpCodes.BAD_REQUEST, err.message, null, false));
    }
  }
}

export const userController = new UserController();
