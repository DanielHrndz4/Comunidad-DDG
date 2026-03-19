import jwt from "jsonwebtoken";
import 'dotenv/config';

// Función para crear un token de acceso (JWT)
// Recibe un "payload" que contiene la información que se almacenará dentro del token
export function createAccessToken(payload) {
    return new Promise((resolve, reject) => {
        // Se genera el token usando jwt.sign
        jwt.sign(
            payload,                   // Información que va dentro del token
            process.env.JWT_SECRET,    // Clave secreta para firmar el token
            {
                expiresIn: "1d"        // El token expira en 1 día
            },
            (error, token) => {        // Callback que recibe error o token generado
                if (error) reject(error); // Si ocurre un error, se rechaza la promesa
                resolve(token);           // Si todo sale bien, se devuelve el token
            }
        );
    });
}
