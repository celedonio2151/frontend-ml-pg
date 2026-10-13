import { ExpenseCategory } from 'modules/expenses/types/expense.types';
import { z } from 'zod';

export const expenseSchema = z.object({
  category: ExpenseCategory.schema.refine(Boolean, {
    message: 'La categoría es requerida',
  }),
  amount: z.coerce
    .number<number>()
    .min(0.01, 'El monto debe ser mayor a 0')
    .refine((val) => !isNaN(val), 'Debe ingresar un número válido'),
  description: z
    .string()
    .min(3, 'La descripción debe tener al menos 3 caracteres')
    .max(255, 'La descripción no puede exceder los 255 caracteres')
    .trim(),
  expenseDate: z.string().min(1, 'La fecha del gasto es requerida'),
  receiptNumber: z.string().optional(),
  receiptImage: z.string().optional(),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;

export const rejectExpenseSchema = z.object({
  rejectionReason: z
    .string()
    .min(3, 'El motivo del rechazo debe tener al menos 3 caracteres')
    .max(255, 'El motivo del rechazo no puede exceder 255 caracteres')
    .trim()
    .optional()
    .or(z.literal('')),
});

export type RejectExpenseFormValues = z.infer<typeof rejectExpenseSchema>;
