import { z } from "zod";

// ---------- ESQUEMA PARA REGISTRO DE USUARIO ----------
export const registerSchema = z.object({
  name: z.string({
    required_error: "El nombre es requerido",
  }),

  username: z.string({
    required_error: "El usuario es requerido",
  }),

  email: z.string({
    required_error: "El correo es requerido",
  }),

  password: z
    .string({
      required_error: "La contraseña es requerida",
    })
    .min(12, {
      message: "La contraseña debe tener como mínimo 12 caracteres",
    }),

  telephone: z
    .string({
      required_error: "Teléfono es requerido",
    })
    .min(8, {
      message: "El teléfono debe tener como mínimo 8 dígitos",
    })
    .regex(/^\d+$/, {
      message: "El teléfono debe contener solo números",
    }),

  age: z.coerce
    .number({
      required_error: "Edad es requerida",
      invalid_type_error: "Edad debe ser un número válido",
    })
    .min(18, {
      message: "Debe ser mayor de edad",
    }),

  role: z.enum(["normal", "vigilant", "admin"]).optional(),
});

// ---------- ESQUEMA PARA LOGIN ----------
export const loginSchema = z.object({
  username: z.string({
    required_error: "Contactar con el administrador",
  }),

  password: z.string({
    required_error: "Contactar con el administrador",
  }),
});
