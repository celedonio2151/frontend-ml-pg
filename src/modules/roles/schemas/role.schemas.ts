import { z } from 'zod';

export const roleSchema = z.object({
  description: z.string().trim().min(1, 'La descripcion es requerida'),
});

export type RoleFormValues = z.infer<typeof roleSchema>;
