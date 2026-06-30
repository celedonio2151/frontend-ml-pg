import { z } from 'zod';

const requiredText = (label: string) => z.string().trim().min(1, `${label} es requerido`);

const optionalText = z.string().trim().optional();

const optionalDate = z.string().trim().optional();

export const createUserSchema = z.object({
  birthDate: optionalDate,
  ci: requiredText('La cedula'),
  email: z.string().trim().min(1, 'El correo es requerido').email('Correo invalido'),
  name: requiredText('El nombre'),
  phoneNumber: optionalText,
  surname: requiredText('El apellido'),
});

export const updateUserSchema = z.object({
  birthDate: optionalDate,
  email: z.string().trim().min(1, 'El correo es requerido').email('Correo invalido'),
  phoneNumber: optionalText,
  rolIds: z.array(z.string()).optional(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
export type UserFormValues = CreateUserFormValues;
