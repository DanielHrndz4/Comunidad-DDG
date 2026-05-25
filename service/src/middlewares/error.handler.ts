import { Request, Response, NextFunction } from "express";
import { AppError } from "../libs/errors.js";
import { HttpResponse } from "../utils/http.response.js";
import { HttpCodes } from "../constants/http.code.js";

/**
 * Middleware global de manejo de errores.
 * Captura todos los errores que llegan via next(error) o errores no atrapados.
 * Debe registrarse como el ÚLTIMO middleware en app.ts.
 */
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction
): Response => {
    // Si es un error operacional conocido (AppError), retorna código y mensaje específico
    if (err instanceof AppError) {
        return res
            .status(err.statusCode)
            .json(HttpResponse(err.statusCode, err.message, null, false));
    }

    // Error inesperado / no operacional
    console.error("[ERROR NO CONTROLADO]:", err);

    return res
        .status(HttpCodes.INTERNAL_SERVER_ERROR)
        .json(HttpResponse(HttpCodes.INTERNAL_SERVER_ERROR, "Error interno del servidor", null, false));
};
