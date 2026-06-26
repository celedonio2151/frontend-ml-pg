import { Outlet } from 'react-router';

import type { RoleType } from 'modules/roles/types/role.types';

export default function RoleGuard({
  roles,
  redirectTo,
}: {
  roles: RoleType[];
  redirectTo?: string;
}) {
  console.log('🚀 ~ RoleGuard ~ roles:', roles, 'redirectTo:', redirectTo);

  return <Outlet />;
}
