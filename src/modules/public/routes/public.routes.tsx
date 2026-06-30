/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router';

import AuthLayout from 'layouts/auth-layout';
import GuestGuard from 'modules/auth/guards/GuestGuard';
import paths from 'router/paths';

const WaterSystemShowcasePage = lazy(() => import('modules/public/pages/WaterSystemShowcasePage'));
const SignInPage = lazy(() => import('modules/auth/pages/SingInPage'));
const SignUpPage = lazy(() => import('modules/auth/pages/SignUpPage'));

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <Suspense fallback={null}>
        <WaterSystemShowcasePage />
      </Suspense>
    ),
  },
  {
    element: <GuestGuard />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: paths.auth.signin,
            element: (
              <Suspense fallback={null}>
                <SignInPage />
              </Suspense>
            ),
          },
          {
            path: paths.auth.signup,
            element: (
              <Suspense fallback={null}>
                <SignUpPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
];

