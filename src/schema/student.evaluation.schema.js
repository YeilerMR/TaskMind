import { z } from "zod";

export const studentEvaluationSchema = z.object({
    ID_TYPE: z
        .number({
            required_error: "El tipo de evaluación es obligatorio.",
            invalid_type_error: "El tipo de evaluación debe ser un número.",
        })
        .int({ message: "El tipo de evaluación debe ser un número entero." })
        .positive({ message: "El tipo de evaluación debe ser positivo." }),

    SCORE_OBTAINED: z
        .number({
            required_error: "La nota obtenida es obligatoria.",
            invalid_type_error: "La nota debe ser un número.",
        })
        .min(0, { message: "La nota no puede ser menor que 0." })
        .max(100, { message: "La nota no puede ser mayor que 100." }),

    DSC_COMMENT: z
        .string()
        .max(255, { message: "El comentario no puede tener más de 255 caracteres." })
        .optional()
});

export default studentEvaluationSchema;