import jwt from "jsonwebtoken";
import 'dotenv/config';

export const authRequired = (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: "No hay token, autorización denegada" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            return res.status(401).json({ message: "Token inválido" });
        }

        // Guardamos el usuario del token en la request
        req.user = user;

        // Continuamos
        next();
    });
};
