import { z } from "zod";

export const professorSchema = z.object({
  DSC_FIRST_NAME: z
    .string({
      required_error: "El nombre es obligatorio.",
    })
    .min(2, {
      message: "El nombre debe tener al menos 2 caracteres.",
    })
    .max(50, {
      message: "El nombre no puede tener más de 50 caracteres.",
    }),
  DSC_LAST_NAME_ONE: z
    .string({
      required_error: "El primer apellido es obligatorio.",
    })
    .min(2, {
      message: "El primer apellido debe tener al menos 2 caracteres.",
    })
    .max(50, {
      message: "El primer apellido no puede tener más de 50 caracteres.",
    }),
  DSC_LAST_NAME_TWO: z
    .string({
      required_error: "El segundo apellido es obligatorio.",
    })
    .min(2, {
      message: "El segundo apellido debe tener al menos 2 caracteres.",
    })
    .max(50, {
      message: "El segundo apellido no puede tener más de 50 caracteres.",
    }),
  DSC_EMAIL: z
    .string({
      required_error: "El correo electrónico es obligatorio.",
    })
    .email({
      message: "El correo electrónico no es válido.",
    })
    .max(100, {
      message: "El correo electrónico no puede tener más de 100 caracteres.",
    }),
  DSC_PHONE: z
    .string({
      required_error: "El número de teléfono es obligatorio.",
    })
    .min(8, {
      message: "El número de teléfono debe tener al menos 8 caracteres.",
    })
    .max(20, {
      message: "El número de teléfono no puede tener más de 20 caracteres.",
    })
    .regex(/^\+?[0-9\s\-()]+$/, {
      message:
        "El número de teléfono debe contener solo números y caracteres válidos (+, -, espacios, paréntesis).",
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
    }),
});

export default professorSchema;
