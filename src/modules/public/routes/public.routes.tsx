import type { RouteObject } from 'react-router';
import WaterSystemShowcasePage from 'modules/public/pages/WaterSystemShowcasePage';

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <WaterSystemShowcasePage />,
  },
];
