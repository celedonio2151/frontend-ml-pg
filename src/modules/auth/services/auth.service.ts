import { httpClient } from 'shared/lib/http-client';
import type {
  LogoutAllResponse,
  LogoutResponse,
  SignInDto,
  SignInResponse,
  SignUpDto,
} from 'modules/auth/types/auth.types';
import type { User } from 'modules/users/types/user.types';

const AUTH_ENDPOINT = '/auth';

export const authService = {
  signIn: (payload: SignInDto) =>
    httpClient
      .post<SignInResponse>(`${AUTH_ENDPOINT}/signin`, payload)
      .then((response) => response),

  signUp: (payload: SignUpDto) =>
    httpClient.post<User>(`${AUTH_ENDPOINT}/signup`, payload).then((response) => response),

  logout: () =>
    httpClient.post<LogoutResponse>(`${AUTH_ENDPOINT}/logout`).then((response) => response),

  logoutAll: () =>
    httpClient.post<LogoutAllResponse>(`${AUTH_ENDPOINT}/logout-all`).then((response) => response),
} as const;
