import type { ReadingFormValues } from 'modules/readings/schemas/reading.schemas';
import type { Reading } from '../types/reading.types';

export const defaultReadingFormValues = (): ReadingFormValues => ({
  balance: '',
  currentValue: '',
  date: new Date().toISOString(),
  description: '',
  isRollover: false,
  meterId: '',
  meterImage: '',
});

export const createReadingFormValues = (): ReadingFormValues => ({
  balance: '',
  currentValue: '',
  date: new Date().toISOString(),
  description: '',
  isRollover: false,
  meterId: '',
  meterImage: '',
});

export const updateReadingFormValues = (reading: Reading): ReadingFormValues => ({
  balance: String(reading.balance),
  currentValue: String(reading.lastMonth.value),
  date: reading.date,
  description: reading.description ?? '',
  isRollover: reading.isRollover ?? false,
  meterId: reading.meterId ?? '',
  meterImage: reading.meterImage ?? '',
});
