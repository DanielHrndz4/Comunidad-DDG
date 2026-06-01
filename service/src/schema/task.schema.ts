import { z } from "zod";

// ---------- ESQUEMA PARA CREACIÓN DE TASK (task normal) ----------
export const createTaskSchema = z.object({
  title: z.string({
    required_error: "El titulo es requerido",
  }),

  description: z.string({
    required_error: "La descripcion es requerida",
  }),

  image: z.string({
    required_error: "La imagen es requerida",
  }),

  date: z.string().datetime().optional(),

  location: z
    .object({
      type: z.literal("Point").default("Point"),
      coordinates: z.tuple([
        z.number({ required_error: "La longitud es requerida" })
          .min(-180, {
            message: "La longitud debe ser mayor o igual a -180",
          })
          .max(180, {
            message: "La longitud debe ser menor o igual a 180",
          }),
        z.number({ required_error: "La latitud es requerida" })
          .min(-90, {
            message: "La latitud debe ser mayor o igual a -90",
          })
          .max(90, {
            message: "La latitud debe ser menor o igual a 90",
          }),
      ]),
    })
    .optional(),
});

// ---------- ESQUEMA PARA CREACIÓN DE TASK2 (task doble) ----------
export const createTaskSchema2 = z.object({
  title2: z.string({
    required_error: "El titulo es requerido",
  }),

  description2: z.string({
    required_error: "La descripcion es requerida",
  }),

  date: z.string().datetime().optional(),
});
