import { Navigate, Outlet } from 'react-router';

import { useAuthStore } from 'modules/auth/stores/auth.store';
import type { RoleType } from 'modules/roles/types/role.types';

const normalizeRole = (role: string) => role.toUpperCase().replace('TECHNICIAN', 'TECHNICAL');

export default function RoleGuard({
  roles,
  redirectTo = '/',
}: {
  roles: RoleType[];
  redirectTo?: string;
}) {
  const userRoles = useAuthStore((state) => state.user?.roles ?? []);
  const allowedRoles = new Set(roles.map(normalizeRole));
  const canAccess = roles.length === 0 || userRoles.some((role) => allowedRoles.has(normalizeRole(role.name)));

  if (!canAccess) {
    return <Navigate replace to={redirectTo} />;
  }

  return <Outlet />;
}
