import { HttpCodes } from "../constants/http.code.js";

// Clase base para todos los errores de la aplicación
export class AppError extends Error {
    public readonly statusCode: HttpCodes;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: HttpCodes, isOperational = true) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

// 400 - Petición inválida
export class BadRequestError extends AppError {
    constructor(message = "Solicitud incorrecta") {
        super(message, HttpCodes.BAD_REQUEST);
    }
}

// 401 - No autenticado
export class UnauthorizedError extends AppError {
    constructor(message = "No autorizado") {
        super(message, HttpCodes.UNAUTHORIZED);
    }
}

// 404 - Recurso no encontrado
export class NotFoundError extends AppError {
    constructor(message = "Recurso no encontrado") {
        super(message, HttpCodes.NOT_FOUND);
    }
}

// 500 - Error interno del servidor
export class InternalServerError extends AppError {
    constructor(message = "Error interno del servidor") {
        super(message, HttpCodes.INTERNAL_SERVER_ERROR, false);
    }
}

// Enum de mensajes de error reutilizables
export enum ErrorMessages {
    ERROR_GET_TASKS = "Error al obtener tareas",
    USER_NOT_FOUND = "Usuario no encontrado",
    USER_ALREADY_EXISTS = "El usuario ya existe",
    INVALID_CREDENTIALS = "Datos incorrectos",
    TASK_NOT_FOUND = "Tarea no encontrada",
    NO_TOKEN = "No hay token, autorización denegada",
    INVALID_TOKEN = "Token inválido",
}