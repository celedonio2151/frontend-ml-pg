import { z } from 'zod';

export const boardDirectorSchema = z
  .object({
    startDate: z.string().min(1, 'La fecha de inicio es requerida'),
    endDate: z.string().min(1, 'La fecha de fin es requerida'),
    positionRole: z
      .string()
      .min(2, 'El cargo debe tener al menos 2 caracteres')
      .max(100, 'El cargo no puede exceder los 100 caracteres')
      .trim(),
    order: z.number().min(1, 'El orden jerárquico debe ser mayor o igual a 1'),
    description: z.string().max(500, 'La descripción no puede exceder los 500 caracteres').optional(),
    status: z.boolean(),
    userId: z.string().min(1, 'Debe seleccionar un usuario'),
  })
  .refine((data) => dayStringLte(data.startDate, data.endDate), {
    message: 'La fecha de fin debe ser posterior o igual a la fecha de inicio',
    path: ['endDate'],
  });

function dayStringLte(start: string, end: string) {
  if (!start || !end) return true;
  return new Date(start).getTime() <= new Date(end).getTime();
}

export type BoardDirectorFormValues = z.infer<typeof boardDirectorSchema>;
