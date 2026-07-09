import { z } from 'zod';

const requiredText = (label: string) => z.string().trim().min(1, `${label} es requerido`);

const numberText = (label: string) =>
  requiredText(label)
    .refine((value) => Number.isFinite(Number(value)), `${label} debe ser un numero`)
    .refine((value) => Number(value) >= 0, `${label} no puede ser negativo`);

const optionalNumberText = (label: string) =>
  z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || Number.isFinite(Number(value)), `${label} debe ser un numero`)
    .refine((value) => !value || Number(value) >= 0, `${label} no puede ser negativo`);

export const readingFormSchema = z.object({
  balance: optionalNumberText('El balance'),
  currentValue: numberText('La lectura actual'),
  date: z.string().trim().optional(),
  description: z.string().trim().optional(),
  isRollover: z.boolean(),
  meterId: z.string().trim().optional(),
  meterImage: z.string().trim().optional(),
});

export type ReadingFormValues = z.infer<typeof readingFormSchema>;
