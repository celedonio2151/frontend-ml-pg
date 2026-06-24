import AppProviders from 'app/providers/AppProviders';
import { router } from 'app/router';
import { RouterProvider } from 'react-router/dom';

function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;
