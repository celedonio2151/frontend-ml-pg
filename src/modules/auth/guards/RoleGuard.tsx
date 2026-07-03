import { Navigate, Outlet } from 'react-router';

import { useAuthStore } from 'modules/auth/stores/auth.store';
import type { RoleType } from 'modules/roles/types/role.types';
import paths from 'router/paths';

const normalizeRole = (role: RoleType) => role.toUpperCase().replace('TECHNICIAN', 'TECHNICAL');

type RoleGuardProps = {
  roles: RoleType[];
  redirectTo?: string;
};

export default function RoleGuard({ roles, redirectTo = paths.client.dashboard }: RoleGuardProps) {
  const userRoles = useAuthStore((state) => state.user?.roles ?? []);
  const allowedRoles = new Set(roles.map(normalizeRole));
  const canAccess =
    roles.length === 0 || userRoles.some((role) => allowedRoles.has(normalizeRole(role.name)));

  if (!canAccess) return <Navigate replace to={redirectTo} />;

  return <Outlet />;
}
