import { z } from "zod"; // Importa Zod para validaciones basadas en esquemas

// ---------- ESQUEMA PARA CREACIÓN DE TASK (task normal) ----------
export const createTaskSchema = z.object({
    // Campo: título de la tarea
    title: z.string({
        required_error: "El titulo es requerido" // Mensaje si no se envía
    }),

    // Campo: descripción de la tarea
    description: z.string({
        required_error: "La descripcion es requerida"
    }),

    // Campo: fecha — opcional
    // .datetime() valida que sea un formato ISO válido
    date: z.string().datetime().optional(),

    // Campo: ubicación geoespacial GeoJSON Point — obligatorio
    location: z.object({
        type: z.literal("Point").default("Point"),
        coordinates: z.tuple([
            z.number({ required_error: "La longitud es requerida" })
                .min(-180, { message: "La longitud debe ser mayor o igual a -180" })
                .max(180, { message: "La longitud debe ser menor o igual a 180" }),
            z.number({ required_error: "La latitud es requerida" })
                .min(-90, { message: "La latitud debe ser mayor o igual a -90" })
                .max(90, { message: "La latitud debe ser menor o igual a 90" })
        ])
    }, { required_error: "La ubicación (location) es requerida" })
});

// ---------- ESQUEMA PARA CREACIÓN DE TASK2 (task doble) ----------
export const createTaskSchema2 = z.object({
    // Campo: título de la tarea 2
    title2: z.string({
        required_error: "El titulo es requerido"
    }),

    // Campo: descripción de la tarea 2
    description2: z.string({
        required_error: "La descripcion es requerida"
    }),

    // Campo: fecha — opcional
    date: z.string().datetime().optional(),
});
