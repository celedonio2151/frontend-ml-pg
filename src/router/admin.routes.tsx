/* eslint-disable react-refresh/only-export-components */
import { Box, Skeleton } from '@mui/material';
import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router';

import AuthGuard from 'modules/auth/guards/AuthGuard';
import RoleGuard from 'modules/auth/guards/RoleGuard';
import WaterSystemShowcasePage from 'modules/public/pages/WaterSystemShowcasePage';
import { RoleName } from 'modules/roles/types/role.types';
// import GuestGuard from 'modules/auth/guards/GuestGuard';
import MainLayout from 'layouts/main-layout';
import paths from 'router/paths';

const DashboardPage = lazy(() => import('modules/dashboard/pages/DashBoardPage'));
const UserPage = lazy(() => import('modules/users/pages/UserPage'));
const RolPage = lazy(() => import('modules/roles/pages/RolePage'));
const MeterPage = lazy(() => import('modules/meters/pages/MeterPage'));
const ReadingPage = lazy(() => import('modules/readings/pages/ReadingPage'));
const InvoicePage = lazy(() => import('modules/invoices/pages/InvoicePage'));
const TreasuryPage = lazy(() => import('modules/treasury/pages/TreasuryPage'));
const ExpensePage = lazy(() => import('modules/expenses/pages/ExpensePage'));
const SettingPage = lazy(() => import('modules/settings/pages/SettingsPage'));
const ApiDocsPage = lazy(() => import('modules/apidocs/pages/ApiDocsPage'));
const DirectivaPage = lazy(() => import('modules/directiva/pages/DirectivaPage'));

const PageSkeleton = () => (
  <Box sx={{ p: 3 }}>
    <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 2 }} />
  </Box>
);
const ADMIN_ROLES = RoleName.values;

export const adminRoutes: RouteObject[] = [
  {
    element: <AuthGuard />,
    children: [
      {
        element: <RoleGuard roles={ADMIN_ROLES} />,
        children: [
          {
            path: paths.admin.root,
            element: <MainLayout />,
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<div>Loading page...</div>}>
                    <WaterSystemShowcasePage />
                  </Suspense>
                ),
              },
              {
                path: paths.admin.dashboard,
                element: (
                  <Suspense fallback={<PageSkeleton />}>
                    <DashboardPage />
                  </Suspense>
                ),
              },
              {
                path: paths.admin.users,
                element: (
                  <Suspense fallback={<PageSkeleton />}>
                    <UserPage />
                  </Suspense>
                ),
              },
              {
                path: paths.admin.roles,
                element: (
                  <Suspense fallback={<PageSkeleton />}>
                    <RolPage />
                  </Suspense>
                ),
              },
              {
                path: paths.admin.meters,
                element: (
                  <Suspense fallback={<PageSkeleton />}>
                    <MeterPage />
                  </Suspense>
                ),
              },
              {
                path: paths.admin.readings,
                element: (
                  <Suspense fallback={<PageSkeleton />}>
                    <ReadingPage />
                  </Suspense>
                ),
              },
              {
                path: paths.admin.invoices,
                element: (
                  <Suspense fallback={<PageSkeleton />}>
                    <InvoicePage />
                  </Suspense>
                ),
              },
              {
                path: paths.admin.treasury,
                element: (
                  <Suspense fallback={<PageSkeleton />}>
                    <TreasuryPage />
                  </Suspense>
                ),
              },
              {
                path: paths.admin.expenses,
                element: (
                  <Suspense fallback={<PageSkeleton />}>
                    <ExpensePage />
                  </Suspense>
                ),
              },
              {
                path: paths.admin.settings,
                element: (
                  <Suspense fallback={<PageSkeleton />}>
                    <SettingPage />
                  </Suspense>
                ),
              },
              {
                path: paths.admin.apidocs,
                element: (
                  <Suspense fallback={<PageSkeleton />}>
                    <ApiDocsPage />
                  </Suspense>
                ),
              },
              {
                path: paths.admin.directiva,
                element: (
                  <Suspense fallback={<PageSkeleton />}>
                    <DirectivaPage />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
];
