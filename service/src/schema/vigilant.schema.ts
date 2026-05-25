import { z } from "zod";

// ---------- ESQUEMA PARA REGISTRAR UN PAGO DE VIGILANCIA ----------
export const createPaySchema = z.object({
    numberTarget: z.string({
        required_error: "El número de tarjeta es requerido",
    }).min(16, { message: "El número de tarjeta debe tener al menos 16 caracteres" }),

    context: z.string({
        required_error: "El concepto es requerido",
    }),

    amount: z.number({
        required_error: "El monto es requerido",
        invalid_type_error: "El monto debe ser un número",
    }).positive({ message: "El monto debe ser mayor a 0" }),

    cvc: z.number({
        required_error: "El CVC es requerido",
        invalid_type_error: "El CVC debe ser un número",
    }),

    date: z.string({
        required_error: "La fecha es requerida",
    }).datetime({ message: "La fecha debe ser un formato ISO válido" }),
});

// ---------- ESQUEMA PARA CREAR UN HORARIO DE VIGILANCIA ----------
export const createScheduleSchema = z.object({
    day: z.string({
        required_error: "El día es requerido",
    }),

    startTime: z.string({
        required_error: "La hora de inicio es requerida",
    }),

    endTime: z.string({
        required_error: "La hora de fin es requerida",
    }),
});

// ---------- ESQUEMA PARA REGISTRAR UNA VISITA ----------
export const createVisitSchema = z.object({
    visitorName: z.string({
        required_error: "El nombre del visitante es requerido",
    }),

    reason: z.string({
        required_error: "El motivo de la visita es requerido",
    }),
});
