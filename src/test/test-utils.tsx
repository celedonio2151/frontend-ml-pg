/* eslint-disable react-refresh/only-export-components */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { RenderOptions } from '@testing-library/react';
import { render as rtlRender } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import type { ReactElement, ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
// import { ThemeProvider } from 'shared/context/ThemeContext';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

type TestRenderOptions = Omit<RenderOptions, 'wrapper'> & {
  queryClient?: QueryClient;
  route?: string;
};

function createWrapper(queryClient: QueryClient, route: string) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={[route]}>
        <QueryClientProvider client={queryClient}>
          <SnackbarProvider>
            {/* <ThemeProvider> */}
            {children}
            {/* </ThemeProvider> */}
          </SnackbarProvider>
        </QueryClientProvider>
      </MemoryRouter>
    );
  };
}

export function render(ui: ReactElement, options: TestRenderOptions = {}) {
  const { queryClient = createTestQueryClient(), route = '/', ...renderOptions } = options;

  return rtlRender(ui, {
    wrapper: createWrapper(queryClient, route),
    ...renderOptions,
  });
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
