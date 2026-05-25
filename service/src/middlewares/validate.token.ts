import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpResponse } from "../utils/http.response.js";
import { HttpCodes } from "../constants/http.code.js";
import 'dotenv/config';

export const authRequired = (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(HttpCodes.UNAUTHORIZED).json(HttpResponse(HttpCodes.UNAUTHORIZED, "No hay token, autorización denegada", null, false));
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (error: unknown, user: unknown) => {
        if (error) {
            return res.status(HttpCodes.UNAUTHORIZED).json(HttpResponse(HttpCodes.UNAUTHORIZED, "Token inválido", null, false));
        }

        // Guardamos el usuario del token en la request
        (req as unknown as Record<string, unknown>).user = user;

        // Continuamos
        next();
    });
};
