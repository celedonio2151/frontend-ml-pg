import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Mock window.matchMedia
Object.defineProperty(globalThis, 'matchMedia', {
  configurable: true,
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

type StorageMock = Storage & {
  reset: () => void;
};

function createStorageMock(): StorageMock {
  const store = new Map<string, string>();

  const clear = vi.fn(() => {
    store.clear();
  });
  const getItem = vi.fn((key: string) => store.get(key) ?? null);
  const key = vi.fn((index: number) => Array.from(store.keys())[index] ?? null);
  const removeItem = vi.fn((key: string) => {
    store.delete(key);
  });
  const setItem = vi.fn((key: string, value: string) => {
    store.set(key, String(value));
  });

  return {
    get length() {
      return store.size;
    },
    clear,
    getItem,
    key,
    removeItem,
    setItem,
    reset: () => {
      store.clear();
      clear.mockClear();
      getItem.mockClear();
      key.mockClear();
      removeItem.mockClear();
      setItem.mockClear();
    },
  };
}

const localStorageMock = createStorageMock();
const sessionStorageMock = createStorageMock();

Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: localStorageMock,
});

Object.defineProperty(globalThis, 'sessionStorage', {
  configurable: true,
  value: sessionStorageMock,
});

// const { useAuthStore } = await import('shared/stores/auth.store');
const { useUIStore } = await import('shared/stores/ui.store');

afterEach(() => {
  cleanup();
  // useAuthStore.setState(useAuthStore.getInitialState(), true);
  useUIStore.setState(useUIStore.getInitialState(), true);
  localStorageMock.reset();
  sessionStorageMock.reset();
});
