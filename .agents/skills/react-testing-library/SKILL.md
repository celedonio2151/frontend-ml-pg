---
name: react-testing-library
description: 'React Testing Library for this Vite + Vitest + pnpm React stack: user-centric component testing with project test-utils, providers, queries, user-event simulation, async utilities, and accessibility-first API. Use when writing React component tests, selecting elements by role/label/text, simulating user events, or testing async UI behavior. Keywords: React Testing Library, Vitest, Vite, pnpm, @testing-library/react, @testing-library/user-event, queries, render.'
metadata:
  version: '16.3.2'
  release_date: '2026-01-19'
---

# React Testing Library Skill

## Quick Navigation

| Topic       | Link                                                   |
| ----------- | ------------------------------------------------------ |
| Queries     | [references/queries.md](references/queries.md)         |
| User Events | [references/user-events.md](references/user-events.md) |
| API         | [references/api.md](references/api.md)                 |
| Async       | [references/async.md](references/async.md)             |
| Debugging   | [references/debugging.md](references/debugging.md)     |
| Config      | [references/config.md](references/config.md)           |

---

## What This Skill Does

This skill is an instruction set for Codex. It does not run commands by itself; when invoked, Codex should use these conventions while creating, reviewing, or refactoring tests in this repository.

## Project Stack

This repository uses:

- Package manager: `pnpm` (`pnpm-lock.yaml` is present)
- App/test runner: Vite + Vitest
- Test environment: `jsdom`
- React: `19.x`
- React Testing Library: `@testing-library/react@16.3.2`
- User interactions: `@testing-library/user-event`
- jest-dom integration: `@testing-library/jest-dom/vitest`
- Project test helper: `src/test/test-utils.tsx`
- Global test setup: `src/test/setup.ts`

Use these project commands:

```bash
pnpm test
pnpm test:run
pnpm test:run -- src/path/to/file.test.tsx
pnpm test:ui
pnpm lint
pnpm build
```

If dependencies ever need to be installed or repaired, use `pnpm`:

```bash
pnpm add -D @testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom jsdom
```

React 19 requires `@testing-library/react` v16.1.0 or newer; this repo already satisfies that.

## Repository Defaults

Prefer project imports in tests:

```tsx
import { describe, expect, it, vi } from 'vitest';
import { createTestQueryClient, render, screen, userEvent, waitFor, within } from 'test/test-utils';
```

`test/test-utils` wraps rendered components with the project providers:

- `MemoryRouter` from `react-router`
- `QueryClientProvider` with retries disabled
- `SnackbarProvider` from `notistack`
- `ThemeProvider` from `shared/context/ThemeContext`

Use the `route` render option when route context matters:

```tsx
render(<Component />, { route: '/admin/products' });
```

Use the `queryClient` render option when a test needs to inspect or pre-seed React Query state:

```tsx
const queryClient = createTestQueryClient();
render(<Component />, { queryClient });
```

The global setup already imports jest-dom matchers and resets shared state after each test. Do not import `@testing-library/jest-dom` inside individual test files.

## Core Philosophy

> "The more your tests resemble the way your software is used, the more confidence they can give you."

**Avoid testing**:

- Internal state of components
- Internal methods
- Lifecycle methods
- Child component implementation details

**Test instead**:

- What users see and interact with
- Behavior from user's perspective
- Accessibility (queries by role, label)

---

## Query Priority

Use queries in this order of preference:

### 1. Accessible to Everyone (Preferred)

```ts
// Best — by ARIA role
getByRole('button', { name: /submit/i });
getByRole('textbox', { name: /email/i });

// Form fields — by label
getByLabelText('Email');

// Non-interactive content — by text
getByText('Welcome back!');
```

### 2. Semantic Queries

```ts
// Images
getByAltText('Company logo');

// Title attribute (less reliable)
getByTitle('Close');
```

### 3. Test IDs (Escape Hatch)

```ts
// Only when other queries don't work
getByTestId('custom-element');
```

---

## Query Types

| Type            | No Match | 1 Match | >1 Match | Async |
| --------------- | -------- | ------- | -------- | ----- |
| `getBy...`      | throw    | return  | throw    | No    |
| `queryBy...`    | null     | return  | throw    | No    |
| `findBy...`     | throw    | return  | throw    | Yes   |
| `getAllBy...`   | throw    | array   | array    | No    |
| `queryAllBy...` | []       | array   | array    | No    |
| `findAllBy...`  | throw    | array   | array    | Yes   |

**When to use**:

- `getBy*` — element exists
- `queryBy*` — element may not exist (assertions like `expect(...).not.toBeInTheDocument()`)
- `findBy*` — element appears asynchronously

---

## Basic Test Pattern

```tsx
import { expect, it } from 'vitest';
import { render, screen, userEvent } from 'test/test-utils';

it('shows greeting after login', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(screen.getByLabelText(/username/i), 'john');
  await user.click(screen.getByRole('button', { name: /login/i }));

  expect(screen.getByLabelText(/username/i)).toHaveValue('john');
  expect(await screen.findByText(/welcome, john/i)).toBeInTheDocument();
});
```

---

## User Events

Always use `@testing-library/user-event` over `fireEvent`:

```ts
import { userEvent } from 'test/test-utils';

it('handles user interactions', async () => {
  const user = userEvent.setup();

  // Click
  await user.click(element);
  await user.dblClick(element);
  await user.tripleClick(element);

  // Type
  await user.type(input, 'Hello');
  await user.clear(input);

  // Select
  await user.selectOptions(select, ['option1', 'option2']);

  // Keyboard
  await user.keyboard('{Enter}');
  await user.keyboard('[ShiftLeft>]a[/ShiftLeft]'); // Shift+A

  // Clipboard
  await user.copy();
  await user.paste();

  // Pointer
  await user.hover(element);
  await user.unhover(element);
});
```

---

## Async Patterns

### waitFor — Retry Until Success

```ts
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// With options
await waitFor(() => expect(callback).toHaveBeenCalled(), {
  timeout: 5000,
  interval: 100,
});
```

### findBy — Built-in waitFor

```ts
// Equivalent to: await waitFor(() => getByText('Loaded'))
const element = await screen.findByText('Loaded');
```

### waitForElementToBeRemoved

```ts
await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));
```

---

## Common Patterns

### Project Render with Providers

```tsx
import { render, screen, userEvent } from 'test/test-utils';

it('renders with app providers', async () => {
  const user = userEvent.setup();

  render(<Component />, { route: '/admin/products' });

  await user.click(screen.getByRole('button', { name: /save/i }));
  expect(await screen.findByText(/saved/i)).toBeInTheDocument();
});
```

### Testing Hooks

```ts
import { act, renderHook } from 'test/test-utils';

it('increments the counter', () => {
  const { result } = renderHook(() => useCounter());

  expect(result.current.count).toBe(0);

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

### Rerender with New Props

```ts
const { rerender } = render(<Counter count={1} />);
expect(screen.getByText('Count: 1')).toBeInTheDocument();

rerender(<Counter count={2} />);
expect(screen.getByText('Count: 2')).toBeInTheDocument();
```

### Query Within Container

```ts
import { screen, within } from 'test/test-utils';

const modal = screen.getByRole('dialog');
const submitBtn = within(modal).getByRole('button', { name: /submit/i });
```

---

## Debugging

```ts
// Print entire DOM
screen.debug();

// Print specific element
screen.debug(screen.getByRole('button'));

// Log available roles
import { logRoles } from 'test/test-utils';
logRoles(container);

// With prettyDOM options
screen.debug(undefined, 10000); // max length
```

---

## jest-dom Matchers

```ts
// Already loaded globally by src/test/setup.ts:
// import '@testing-library/jest-dom/vitest';

expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toBeEnabled();
expect(element).toBeDisabled();
expect(element).toHaveTextContent('Hello');
expect(element).toHaveValue('input value');
expect(element).toHaveAttribute('href', '/home');
expect(element).toHaveClass('active');
expect(element).toHaveFocus();
expect(element).toBeChecked();
```

---

## Configuration

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

---

## ❌ Prohibitions (Anti-patterns)

```ts
// ❌ Don't query by class/id
container.querySelector(".my-class");

// ❌ Don't use container.firstChild
const { container } = render(<Component />);
expect(container.firstChild).toHaveClass("active");

// ❌ Don't use fireEvent when userEvent works
fireEvent.click(button); // Use userEvent.click instead

// ❌ Don't test implementation details
expect(component.state.loading).toBe(false);

// ❌ Don't use waitFor with findBy
await waitFor(() => screen.findByText("x")); // findBy already waits

// ❌ Don't assert inside waitFor callback (unless necessary)
await waitFor(() => {
  expect(mockFn).toHaveBeenCalled(); // OK - need to wait for call
});
```

---

## ✅ Best Practices

```ts
// ✅ Use screen for all queries through the project helper
import { render, screen, userEvent } from 'test/test-utils';
render(<Component />);
screen.getByRole('button'); // Good

// ✅ Prefer userEvent over fireEvent
const user = userEvent.setup();
await user.click(button);

// ✅ Use findBy for async elements
const element = await screen.findByText("Loaded");

// ✅ Use queryBy for non-existence assertions
expect(screen.queryByText("Error")).not.toBeInTheDocument();

// ✅ Use within for scoped queries
const form = screen.getByRole("form");
within(form).getByLabelText("Email");

// ✅ Use accessible queries (role, label, text)
getByRole("button", { name: /submit/i });
```

---

## TextMatch Options

```ts
// Exact match (default)
getByText('Hello World');

// Substring match
getByText('llo Worl', { exact: false });

// Regex
getByText(/hello world/i);

// Custom function
getByText((content, element) => {
  return element.tagName === 'SPAN' && content.startsWith('Hello');
});
```

---

## Quick Reference

| Import              | Usage                                               |
| ------------------- | --------------------------------------------------- |
| `render`            | Render component to DOM                             |
| `screen`            | Query the rendered DOM                              |
| `cleanup`           | Unmount components (handled in `src/test/setup.ts`) |
| `act`               | Wrap state updates                                  |
| `renderHook`        | Test custom hooks                                   |
| `within`            | Scope queries to element                            |
| `waitFor`           | Retry until assertion passes                        |
| `configure`         | Set global options                                  |
| `userEvent.setup()` | Create user event instance                          |

## Links

- [Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Releases](https://github.com/testing-library/react-testing-library/releases)
- [GitHub](https://github.com/testing-library/react-testing-library)
- [npm](https://www.npmjs.com/package/@testing-library/react)
