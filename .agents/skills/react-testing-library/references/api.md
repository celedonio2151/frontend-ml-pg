# React Testing Library API Reference

## render()

```ts
import { render } from '@testing-library/react'

const result = render(ui, options?)
```

### Basic Usage

```tsx
import { render, screen } from '@testing-library/react';

test('renders greeting', () => {
  render(<Greeting name="World" />);
  expect(screen.getByText('Hello, World!')).toBeInTheDocument();
});
```

### Render Options

```ts
render(<Component />, {
  container: document.body.appendChild(document.createElement("div")),
  baseElement: document.body,
  hydrate: false,
  legacyRoot: false, // React 17 mode (not available in React 19+)
  wrapper: AllProviders,
  queries: { ...queries, ...customQueries },
  reactStrictMode: true,
  // React 19 error handlers
  onCaughtError: (error, errorInfo) => {},
  onRecoverableError: (error, errorInfo) => {},
});
```

| Option               | Description                                      |
| -------------------- | ------------------------------------------------ |
| `container`          | DOM element to render into                       |
| `baseElement`        | Element for queries (default: document.body)     |
| `hydrate`            | Use ReactDOM.hydrate for SSR                     |
| `legacyRoot`         | Use React 17 rendering (not in React 19+)        |
| `wrapper`            | Component to wrap around rendered element        |
| `queries`            | Custom queries to use                            |
| `reactStrictMode`    | Enable React StrictMode                          |
| `onCaughtError`      | Callback for errors caught by Error Boundary     |
| `onRecoverableError` | Callback for errors React automatically recovers |

### Render Result

```ts
const {
  container, // DOM container element
  baseElement, // Base element for queries
  debug, // console.log(prettyDOM())
  rerender, // Re-render with new props
  unmount, // Unmount component
  asFragment, // Get DocumentFragment snapshot
  ...queries // All query functions bound to baseElement
} = render(<Component />);
```

### React Error Handlers (v16.2.0+)

Handle errors in tests with React 19 error callbacks:

```tsx
test('catches error boundary errors', () => {
  const errors: Error[] = [];

  render(<ComponentWithErrorBoundary />, {
    onCaughtError: (error, errorInfo) => {
      errors.push(error);
      console.log('Caught:', error.message);
      console.log('Component stack:', errorInfo.componentStack);
    },
  });

  // Trigger error and verify
  fireEvent.click(screen.getByRole('button', { name: /throw/i }));
  expect(errors).toHaveLength(1);
});

test('handles recoverable errors', () => {
  const recoverableErrors: Error[] = [];

  render(<HydratedComponent />, {
    hydrate: true,
    onRecoverableError: (error, errorInfo) => {
      recoverableErrors.push(error);
    },
  });

  expect(recoverableErrors).toHaveLength(0);
});
```

---

## screen

Pre-bound queries for document.body:

```ts
import { render, screen } from "@testing-library/react";

render(<Component />);

// All queries available
screen.getByRole("button");
screen.queryByText("Loading");
screen.findByLabelText("Email");

// Debug
screen.debug();
screen.debug(screen.getByRole("button"));

// Playground URL
screen.logTestingPlaygroundURL();
```

---

## rerender()

Update props without remounting:

```tsx
const { rerender } = render(<Counter count={1} />);
expect(screen.getByText('Count: 1')).toBeInTheDocument();

rerender(<Counter count={2} />);
expect(screen.getByText('Count: 2')).toBeInTheDocument();
```

---

## unmount()

```ts
const { unmount } = render(<Component />);
unmount();
// Component is now unmounted, container is empty
```

---

## asFragment()

Create snapshot of current DOM state:

```tsx
const { asFragment } = render(<Component />);

const firstRender = asFragment();
fireEvent.click(screen.getByRole('button'));

// Snapshot diff
expect(firstRender).toMatchDiffSnapshot(asFragment());
```

---

## cleanup()

Unmounts all rendered components. Called automatically in Jest/Vitest.

```ts
import { cleanup, render } from '@testing-library/react';

afterEach(cleanup); // Usually not needed

// Or skip auto-cleanup
import '@testing-library/react/dont-cleanup-after-each';
```

---

## act()

Wrap state updates:

```ts
import { act } from '@testing-library/react';

await act(async () => {
  // Trigger state updates
  fireEvent.click(button);
  await promise;
});
```

**Note:** Most RTL methods handle `act()` automatically. Use explicitly only when needed.

---

## renderHook()

Test custom hooks:

```ts
import { renderHook, act } from '@testing-library/react';

test('useCounter', () => {
  const { result } = renderHook(() => useCounter());

  expect(result.current.count).toBe(0);

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

### With Initial Props

```ts
const { result, rerender } = renderHook((props) => useUser(props.id), { initialProps: { id: 1 } });

expect(result.current.name).toBe('User 1');

rerender({ id: 2 });
expect(result.current.name).toBe('User 2');
```

### With Wrapper

```ts
const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

const { result } = renderHook(() => useAuth(), { wrapper });
```

### Result Object

```ts
const {
  result, // { current: hookReturnValue }
  rerender, // Re-run hook with new props
  unmount, // Unmount hook
} = renderHook(() => useMyHook());
```

---

## configure()

Set global options:

```ts
import { configure } from '@testing-library/react';

configure({
  testIdAttribute: 'data-my-test-id',
  asyncUtilTimeout: 5000,
  defaultHidden: false,
  throwSuggestions: true,
  reactStrictMode: true,
});
```

---

## Custom Render Pattern

```tsx
// Use the existing repo helper instead of importing directly from RTL.
import { render, screen, userEvent, waitFor, within } from 'test/test-utils';
```

Usage:

```tsx
import { expect, it } from 'vitest';
import { render, screen } from 'test/test-utils';

it('works with providers', () => {
  render(<MyComponent />, { route: '/admin/products' });
  expect(screen.getByRole('heading')).toBeInTheDocument();
});
```

---

## Vitest Configuration

```ts
// vitest.config.ts
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default defineConfig((configEnv) =>
  mergeConfig(
    viteConfig(configEnv),
    defineConfig({
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
      },
    }),
  ),
);
```

```ts
// src/test/setup.ts
import '@testing-library/jest-dom/vitest';
```
