import { Navigate, Outlet, useLocation } from 'react-router';
import { selectIsAuthenticated, useAuthStore } from 'modules/auth/stores/auth.store';
import paths from 'router/paths';

export default function AuthGuard() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated)
    return <Navigate replace state={{ from: location }} to={paths.auth.signin} />;

  return <Outlet />;
}
