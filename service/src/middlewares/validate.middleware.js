// Middleware para validar datos usando un esquema (por ejemplo, Zod)
// Recibe un "schema" y devuelve una función middleware
export const validateSchema = (schema) => (req, res, next) => {
    try {
        // Intenta validar el contenido del body según el esquema proporcionado
        schema.parse(req.body);
        
        // Si la validación es correcta, continúa con el siguiente middleware o controlador
        next();
    } catch (error) {
        // Si hay errores de validación, devuelve un estado 400 con los mensajes de error
        return res.status(400).json(error.errors.map(error => error.message));
    }
};
