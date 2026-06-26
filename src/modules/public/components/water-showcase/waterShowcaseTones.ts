import type { StatusTone } from 'shared/ui/aqua/StatusPill';

export const toneByStatus: Record<string, StatusTone> = {
  Activo: 'success',
  Alerta: 'warning',
  Inactivo: 'error',
  Pagado: 'success',
  Pendiente: 'warning',
  Vencido: 'error',
};

export const toneByRole: Record<string, StatusTone> = {
  ADMIN: 'purple',
  TECHNICAL: 'warning',
  USER: 'aqua',
};

export const toneByMethod: Record<string, StatusTone> = {
  DELETE: 'error',
  GET: 'success',
  PATCH: 'warning',
  POST: 'aqua',
};
