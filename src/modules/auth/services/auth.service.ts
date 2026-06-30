import { api } from 'shared/lib/http-client';
import type { SignInDto, SignInResponse, SignUpDto } from 'modules/auth/types/auth.types';
import type { User } from 'modules/users/types/user.types';

const AUTH_ENDPOINT = '/auth';

export const authService = {
  signIn: (payload: SignInDto) => api.post<SignInResponse>(`${AUTH_ENDPOINT}/signin`, payload),
  signUp: (payload: SignUpDto) => api.post<User>(`${AUTH_ENDPOINT}/signup`, payload),
} as const;

