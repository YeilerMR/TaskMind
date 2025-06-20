import { z } from "zod";

export const evaluationTypeSchema = z.object({
    ID_COURSE: z
        .number({
            required_error: "El ID del curso es obligatorio.",
            invalid_type_error: "El ID del curso debe ser un número.",
        })
        .int({ message: "El ID del curso debe ser un número entero." })
        .positive({ message: "El ID del curso debe ser un número positivo." }),

    DSC_NAME: z
        .string({
            required_error: "El nombre de la evaluación es obligatorio.",
        })
        .min(3, { message: "El nombre debe tener al menos 3 caracteres." })
        .max(50, { message: "El nombre no puede tener más de 50 caracteres." }),

    WEIGHT: z
        .number({
            required_error: "El peso de la evaluación es obligatorio.",
            invalid_type_error: "El peso debe ser un número.",
        })
        .positive({ message: "El peso debe ser un número positivo." }),

    DATE_EVALUATION: z
        .string({
            required_error: "La fecha de la evaluación es obligatoria.",
        })
        .refine(val => !isNaN(Date.parse(val)), {
            message: "La fecha de la evaluación no es válida.",
        }),
    DSC_EVALUATION: z
        .string()
        .max(100, {
            message: "La descripción no puede tener más de 100 caracteres.",
        })
        .optional(),

    ID_USER: z
        .number({
            required_error: "El ID del usuario es obligatorio.",
            invalid_type_error: "El ID del usuario debe ser un número.",
        })
        .int({ message: "El ID del usuario debe ser un número entero." })
        .positive({ message: "El ID del usuario debe ser un número positivo." }),
});

export default evaluationTypeSchema;
