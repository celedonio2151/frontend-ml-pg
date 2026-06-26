/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router';

const WaterSystemShowcasePage = lazy(() => import('modules/public/pages/WaterSystemShowcasePage'));

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <Suspense fallback={null}>
        <WaterSystemShowcasePage />
      </Suspense>
    ),
  },
];
