import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import type { AuthTokens } from 'modules/auth/types/auth.types';
import type { UserWithRoles } from 'modules/users/types/user.types';

type AuthState = {
  clearSession: () => void;
  setSession: (session: { tokens: AuthTokens; user: UserWithRoles }) => void;
  tokens: AuthTokens | null;
  user: UserWithRoles | null;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        tokens: null,
        user: null,

        setSession: (session) => set(session, false, 'auth/setSession'),
        clearSession: () => set({ tokens: null, user: null }, false, 'auth/clearSession'),
      }),
      {
        name: 'aqua-admin-auth',
        partialize: (state) => ({
          tokens: state.tokens,
          user: state.user,
        }),
        storage: createJSONStorage(() => localStorage),
      },
    ),
    { name: 'Auth Store' },
  ),
);

export const selectIsAuthenticated = (state: AuthState) => Boolean(state.tokens?.accessToken);
