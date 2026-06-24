import { createBrowserRouter } from 'react-router';
import { publicRoutes } from 'modules/public/routes/public.routes';

export const router = createBrowserRouter(publicRoutes, { basename: '/' });
