import { z } from 'zod';

export const payInvoiceSchema = z.object({
  paymentMethod: z.enum(['CASH', 'TRANSFER', 'QR', 'OTHER'], {
    error: () => ({ message: 'Método de pago inválido' }),
  }),
  notes: z.string().optional(),
});

export type PayInvoiceValues = z.infer<typeof payInvoiceSchema>;
