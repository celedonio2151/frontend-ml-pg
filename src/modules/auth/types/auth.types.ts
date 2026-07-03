import type { UserWithRolesAndMeters } from 'modules/users/types/user.types';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type SignInDto = {
  email: string;
  password: string;
};

export type SignUpDto = {
  birthDate?: string;
  ci: string;
  email: string;
  name: string;
  password: string;
  phoneNumber: string;
  surname: string;
};

export type SignInResponse = {
  tokens: AuthTokens;
  user: UserWithRolesAndMeters;
};

export type LogoutResponse = {
  message: string;
};

export type LogoutAllResponse = {
  message: string;
};
