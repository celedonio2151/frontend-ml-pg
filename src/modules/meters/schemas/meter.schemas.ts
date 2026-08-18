import { z } from 'zod';

export const meterFormSchema = z.object({
  meterNumber: z
    .string()
    .min(1, 'El número de medidor es requerido')
    .regex(/^\d+$/, 'Debe ser un número válido'),
  maximumCapacity: z
    .string()
    .min(1, 'La capacidad máxima es requerida')
    .regex(/^\d+$/, 'Debe ser un número válido'),
  userId: z.string().min(1, 'Debe seleccionar un propietario'),
  status: z.boolean(),
});

export type MeterFormValues = z.infer<typeof meterFormSchema>;

export const changeOwnerSchema = z.object({
  newUserId: z.string().min(1, 'Debe seleccionar el nuevo propietario'),
});

export type ChangeOwnerValues = z.infer<typeof changeOwnerSchema>;
