import { z } from "zod";

export const userSchema = z.object({
  DSC_FIRST_NAME: z
    .string({
      required_error: "El primer nombre es obligatorio.",
    })
    .min(3, {
      message: "El primer nombre debe tener al menos 3 caracteres.",
    })
    .max(50, {
      message: "El primer nombre no puede exceder los 50 caracteres.",
    }),
  DSC_LAST_NAME_ONE: z
    .string({
      required_error: "El primer apellido es obligatorio.",
    })
    .min(3, {
      message: "El primer apellido debe tener al menos 3 caracteres.",
    })
    .max(50, {
      message: "El primer apellido no puede exceder los 50 caracteres.",
    }),
  DSC_IDENTIFICATION: z
    .string()
    .min(9, { 
      message: "El numero de cedula debe contener 9 digitos."
     })
    .max(100, {
      message: "El primer apellido no puede exceder los 100 caracteres.",
    }),
  DSC_EMAIL: z
    .string({
      required_error: "El correo electrónico es obligatorio.",
    })
    .email({
      message: "Debe proporcionar un correo electrónico válido.",
    })
    .max(100, {
      message: "El correo electrónico no puede exceder los 100 caracteres.",
    }),
  DSC_PASSWORD: z
    .string({
      required_error: "La contraseña es obligatoria.",
    })
    .min(8, {
      message: "La contraseña debe tener al menos 8 caracteres.",
    })
    .max(255, {
      message: "La contraseña no puede exceder los 255 caracteres.",
    }),
  DSC_CAREER: z
    .string({
      required_error: "La carrera o profesión es obligatoria.",
    })
    .min(3, {
      message: "La carrera debe tener al menos 3 caracteres.",
    })
    .max(255, {
      message: "La carrera no puede exceder los 255 caracteres.",
    }),

});

export const loginSchema = z.object({
  DSC_EMAIL: z
    .string({
      required_error: "El correo electrónico es obligatorio.",
    })
    .email({
      message: "Debe proporcionar un correo electrónico válido.",
    }),
  DSC_PASSWORD: z
    .string({
      required_error: "La contraseña es obligatoria.",
    })
  ,
});

export const updateUserSchema = z.object({
  DSC_FIRST_NAME: z
    .string()
    .min(3, {
      message: "El primer nombre debe tener al menos 3 caracteres.",
    })
    .max(50, {
      message: "El primer nombre no puede exceder los 50 caracteres.",
    })
    .optional(),
  DSC_LAST_NAME_ONE: z
    .string()
    .min(3, {
      message: "El primer apellido debe tener al menos 3 caracteres.",
    })
    .max(50, {
      message: "El primer apellido no puede exceder los 50 caracteres.",
    })
    .optional(),
  DSC_CAREER: z
    .string()
    .min(3, {
      message: "La carrera debe tener al menos 3 caracteres.",
    })
    .max(255, {
      message: "La carrera no puede exceder los 255 caracteres.",
    })
    .optional(),

});
