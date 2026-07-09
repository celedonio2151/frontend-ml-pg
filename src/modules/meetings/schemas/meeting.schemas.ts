import { z } from 'zod';

const requiredText = (label: string) => z.string().trim().min(1, `${label} es requerido`);

const optionalUrl = z
  .string()
  .trim()
  .refine((value) => !value || /^https?:\/\//i.test(value), 'URL invalida')
  .optional();

export const meetingSchema = z.object({
  attendeesText: z.string().trim().optional(),
  content: requiredText('El contenido'),
  documentUrl: optionalUrl,
  meetingDate: requiredText('La fecha'),
  title: requiredText('El titulo'),
});

export type MeetingFormValues = z.infer<typeof meetingSchema>;
