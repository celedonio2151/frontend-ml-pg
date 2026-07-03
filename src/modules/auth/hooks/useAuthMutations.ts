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
    onSuccess: (session) => {
      alert('Usuario registrado con exito, por favor inicie sesion');
      console.log('session', session);
    },
  });
}

export function useSignOut() {
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      useAuthStore.getState().clearSession();
    },
  });
}

export function useLogoutAll() {
  return useMutation({
    mutationFn: authService.logoutAll,
    onSuccess: () => {
      useAuthStore.getState().clearSession();
    },
  });
}
