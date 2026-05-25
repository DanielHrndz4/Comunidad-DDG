import jwt from "jsonwebtoken";
import 'dotenv/config';

// Función para crear un token de acceso (JWT)
// Recibe un "payload" que contiene la información que se almacenará dentro del token
export function createAccessToken(payload: Record<string, unknown>): Promise<string> {
    return new Promise((resolve, reject) => {
        // Se genera el token usando jwt.sign
        jwt.sign(
            payload,                   // Información que va dentro del token
            process.env.JWT_SECRET as string,    // Clave secreta para firmar el token
            {
                expiresIn: "1d"        // El token expira en 1 día
            },
            (error, token) => {        // Callback que recibe error o token generado
                if (error || !token) reject(error || new Error("Token generation failed")); // Si ocurre un error, se rechaza la promesa
                else resolve(token);           // Si todo sale bien, se devuelve el token
            }
        );
    });
}
