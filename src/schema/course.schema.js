import { z } from "zod";

export const courseSchema = z.object({
    DSC_NAME: z
        .string({
            required_error: "El nombre del curso es obligatorio.",
        })
        .min(5, {
            message: "El nombre del curso debe tener al menos 5 caracteres.",
        })
        .max(100, {
            message: "El nombre del curso no puede tener más de 100 caracteres.",
        }),
    ID_USER: z
        .number({
            required_error: "El ID del usuario es obligatorio.",
            invalid_type_error: "El ID del usuario debe ser un número.",
        })
        .int({
            message: "El ID del usuario debe ser un número entero.",
        })
        .positive({
            message: "El ID del usuario debe ser un número positivo.",
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
});

export default courseSchema;