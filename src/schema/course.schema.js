import { z } from "zod";

export const courseSchema = z.object({
    DSC_NAME: z
        .string({
            required_error: "El nombre del curso es obligatorio.",
        })
        .min(2, {
            message: "El nombre del curso debe tener al menos 2 caracteres.",
        })
        .max(100, {
            message: "El nombre del curso no puede tener más de 100 caracteres.",
        }),
    ID_TEACHER: z
        .number({
            required_error: "El ID del profesor es obligatorio.",
            invalid_type_error: "El ID del profesor debe ser un número.",
        })
        .int({
            message: "El ID del profesor debe ser un número entero.",
        })
        .positive({
            message: "El ID del profesor debe ser un número positivo.",
        }),
    DSC_CODE: z
        .string({
            required_error: "El código del curso es obligatorio.",
        })
        .max(50, {
            message: "El código del curso no puede tener más de 50 caracteres.",
        }),

    DSC_ATTENTION: z
        .string()
        .max(255, {
            message: "La descripción del horario de atención no puede tener más de 255 caracteres.",
        })
        .optional(),
    DSC_COLOR: z
        .string({
            required_error: "El color seleccionado para el curso es obligatorio.",
        })
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/, {
            message: "El código de color debe ser un hexadecimal válido (6 u 8 caracteres).",
        }),
        STATUS: z
        .number({
            required_error: "El estado es obligatorio.",
            invalid_type_error: "El estado debe ser un número.",
        })
        .int({
            message: "El estado debe ser un número entero.",
        })
        .min(0, {
            message: "El estado debe ser mayor o igual a 0.",
        })
        .max(1, {
            message: "El estado debe ser menor o igual a 1.",
        })
        .default(1),
});

export default courseSchema;