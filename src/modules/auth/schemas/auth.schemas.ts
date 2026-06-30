import { z } from 'zod';

const optionalDate = z.string().trim().optional();

export const signInSchema = z.object({
  email: z.string().trim().min(1, 'El correo es requerido').email('Correo invalido'),
  password: z.string().min(1, 'La contrasena es requerida'),
});

export const signUpSchema = z.object({
  birthDate: optionalDate,
  ci: z.string().trim().min(1, 'La cedula es requerida'),
  email: z.string().trim().min(1, 'El correo es requerido').email('Correo invalido'),
  name: z.string().trim().min(1, 'El nombre es requerido'),
  password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres'),
  phoneNumber: z.string().trim().min(1, 'El telefono es requerido'),
  surname: z.string().trim().min(1, 'El apellido es requerido'),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
