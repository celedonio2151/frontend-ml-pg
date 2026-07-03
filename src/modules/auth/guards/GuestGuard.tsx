import { Navigate, Outlet } from 'react-router';
import { selectIsAuthenticated, useAuthStore } from 'modules/auth/stores/auth.store';
import paths from 'router/paths';

export default function GuestGuard() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  if (isAuthenticated) return <Navigate replace to={paths.admin.dashboard} />;

  return <Outlet />;
}
