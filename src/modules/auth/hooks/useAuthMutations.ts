import { useMutation } from '@tanstack/react-query';
import { authService } from 'modules/auth/services/auth.service';
import { useAuthStore } from 'modules/auth/stores/auth.store';

export function useSignInMutation() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: authService.signIn,
    onSuccess: (session) => {
      setSession(session);
    },
  });
}

export function useSignUpMutation() {
  return useMutation({
    mutationFn: authService.signUp,
  });
}

export function useSignOut() {
  return useAuthStore((state) => state.clearSession);
}

