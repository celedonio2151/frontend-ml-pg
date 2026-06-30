import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { ApiError } from 'shared/lib/api-error';

export function applyApiFieldErrors<TValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TValues>,
) {
  if (!(error instanceof ApiError) || error.errors.length === 0) {
    return false;
  }

  error.errors.forEach((fieldError) => {
    setError(fieldError.field as Path<TValues>, {
      message: fieldError.message,
      type: 'server',
    });
  });

  return true;
}

export function getApiErrorMessage(error: unknown, fallback = 'Ocurrio un error inesperado') {
  return error instanceof Error ? error.message : fallback;
}

