import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import { HttpResponse } from "../utils/http.response.js";
import { HttpCodes } from "../constants/http.code.js";

// Middleware para validar datos usando un esquema de Zod
export const validateSchema = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error: unknown) {
        const err = error as { errors?: { message: string }[] };
        const messages = err.errors ? err.errors.map((e) => e.message).join(", ") : "Error de validación";
        return res.status(HttpCodes.BAD_REQUEST).json(HttpResponse(HttpCodes.BAD_REQUEST, messages, null, false));
    }
};
