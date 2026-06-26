import { createBrowserRouter } from 'react-router';

import { publicRoutes } from 'modules/public/routes/public.routes';
import { adminRoutes } from 'router/admin.routes';

export const router = createBrowserRouter([...publicRoutes, ...adminRoutes], { basename: '/' });
