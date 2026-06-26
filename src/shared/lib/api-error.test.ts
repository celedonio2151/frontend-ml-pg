import { ApiError } from 'shared/lib/api-error';
import { describe, expect, it } from 'vitest';

describe('ApiError', () => {
  it('parsea correctamente un error de validación', () => {
    const error = new ApiError({
      success: false,
      method: 'POST',
      status: 'BAD_REQUEST',
      statusCode: 400,
      path: '/api/v1/users/',
      message: 'Validation Error',
      timestamp: '2026-04-07T16:38:20.306Z',
      errors: [
        { field: 'email', message: 'Ingresa un email válido' },
        { field: 'cellphone', message: 'Must be shorter than 40 characters' },
      ],
    });

    expect(error.message).toBe('Validation Error');
    expect(error.statusCode).toBe(400);
    expect(error.isValidation).toBe(true);
    expect(error.fieldError('email')).toBe('Ingresa un email válido');
    expect(error.fieldError('cellphone')).toBe('Must be shorter than 40 characters');
    expect(error.fieldErrors()).toEqual({
      email: 'Ingresa un email válido',
      cellphone: 'Must be shorter than 40 characters',
    });
  });

  it('parsea correctamente un error genérico (sin errors array)', () => {
    const error = new ApiError({
      success: false,
      method: 'GET',
      status: 'INTERNAL_SERVER_ERROR',
      statusCode: 500,
      path: '/api/v1/products',
      message: 'Internal Server Error',
      timestamp: '2026-04-13T13:18:26.682Z',
    });

    expect(error.message).toBe('Internal Server Error');
    expect(error.statusCode).toBe(500);
    expect(error.isValidation).toBe(false);
    expect(error.isServerError).toBe(true);
    expect(error.fieldError('any')).toBeUndefined();
    expect(error.fieldErrors()).toEqual({});
  });

  it('clasifica los distintos estados de error', () => {
    const base = {
      success: false as const,
      method: 'GET',
      path: '/api/v1/resource',
      timestamp: '2026-04-13T13:18:26.682Z',
    };

    expect(
      new ApiError({ ...base, status: 'UNAUTHORIZED', statusCode: 401, message: 'No autorizado' })
        .isUnauthorized,
    ).toBe(true);
    expect(
      new ApiError({ ...base, status: 'FORBIDDEN', statusCode: 403, message: 'Prohibido' })
        .isForbidden,
    ).toBe(true);
    expect(
      new ApiError({ ...base, status: 'NOT_FOUND', statusCode: 404, message: 'No encontrado' })
        .isNotFound,
    ).toBe(true);
    expect(
      new ApiError({ ...base, status: 'CONFLICT', statusCode: 409, message: 'Conflicto' })
        .isConflict,
    ).toBe(true);
    expect(
      new ApiError({
        ...base,
        status: 'NETWORK_ERROR',
        statusCode: 0,
        message: 'Error de conexión',
      }).isNetwork,
    ).toBe(true);
  });

  it('retorna el nombre correcto de la clase', () => {
    const error = new ApiError({
      success: false,
      method: 'GET',
      status: 'NOT_FOUND',
      statusCode: 404,
      path: '/api/v1/users/123',
      message: 'Not Found',
      timestamp: '2026-04-13T13:18:26.682Z',
    });

    expect(error.name).toBe('ApiError');
  });
});
