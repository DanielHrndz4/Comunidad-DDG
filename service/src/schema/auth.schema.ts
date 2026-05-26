import { z } from "zod"; // Importa Zod, librería para validación de datos

// ---------- ESQUEMA PARA REGISTRO DE USUARIO ----------
export const registerSchema = z.object({
    // Campo: nombre
    name: z.string({
        required_error: "El nombre es requerido" // Mensaje si el campo está vacío
    }),

    // Campo: nombre de usuario
    username: z.string({
        required_error: "El usuario es requerido"
    }),

    // Campo: correo electrónico
    email: z.string({
        required_error: "El correo es requerido"
    }),

    // Campo: contraseña
    password: z
        .string({
            required_error: "La contraseña es requerida"
        })
        .min(12, {
            message: "La contraseña debe tener como mínimo 12 caracteres"
        }),

    // Campo: teléfono
    telephone: z
        .string({
            required_error: "Teléfono es requerido",
        })
        .min(8, {
            message: "El teléfono debe tener como mínimo 8 dígitos",
        })
        .regex(/^\d+$/, {
            message: "El teléfono debe contener solo números", // No letras, no símbolos
        }),

    // Campo: edad
    age: z
        .string({
            required_error: "Edad es requerida",
        })
        // Convierte el valor recibido (string) a número
        .transform((val) => Number(val))
        // Valida que efectivamente sea un número
        .refine((num) => !isNaN(num), { message: "Edad debe ser un número válido" })
        // Valida que sea mayor o igual a 18 años
        .refine((num) => num >= 18, { message: "Debe ser mayor de edad" }),
});

// ---------- ESQUEMA PARA LOGIN ----------
export const loginSchema = z.object({
    // Campo: usuario
    username: z.string({
        required_error: "Contactar con el administrador"
    }),

    // Campo: contraseña
    password: z.string({
        required_error: "Contactar con el administrador"
    })
});
