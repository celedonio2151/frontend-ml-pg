import { adminRoutes } from 'modules/admin/routes/admin.routes';
import { authRoutes } from 'modules/auth/routes/auth.routes';
import { clientRoutes } from 'modules/client/routes/client.routes';
import { createBrowserRouter } from 'react-router';

const router = createBrowserRouter([...authRoutes, ...adminRoutes, ...clientRoutes], { basename: '/' });

export default router;
