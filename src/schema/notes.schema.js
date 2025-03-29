import { z } from "zod";

export const noteSchema = z.object({
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
        ID_COURSE: z
        .number({
            required_error: "El ID del curso es obligatorio.",
            invalid_type_error: "El ID del curso debe ser un número.",
        })
        .int({
            message: "El ID del curso debe ser un número entero.",
        })
        .positive({
            message: "El ID del curso debe ser un número positivo.",
        }),
        DSC_TITLE: z
        .string({
            required_error: "El titulo de la nota es obligatorio.",
        })
        .max(225, {
            message: "El titulo de la nota no puede tener más de 225 caracteres.",
        }),

        DSC_COMMENT: z
        .string()
        .max(255, {
            message: "La nota no puede tener más de 1000 caracteres.",
        })
});

export default noteSchema;