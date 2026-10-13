import { z } from 'zod';
import { TreasuryMovement } from '../types/treasury.types';

export const treasuryAdjustmentSchema = z.object({
  type: TreasuryMovement.schema,
  amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  description: z
    .string()
    .min(3, 'La descripción debe tener al menos 3 caracteres')
    .max(255, 'La descripción no puede exceder los 255 caracteres')
    .trim(),
});

export type TreasuryAdjustmentFormValues = z.infer<typeof treasuryAdjustmentSchema>;
