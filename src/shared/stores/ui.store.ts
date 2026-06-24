import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark';

type UIState = {
  sidebarOpen: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
};

const getPreferredThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: true,
        themeMode: getPreferredThemeMode(),

        setThemeMode: (mode) => set({ themeMode: mode }, false, 'ui/setThemeMode'),

        toggleTheme: () =>
          set(
            (state) => ({
              themeMode: state.themeMode === 'light' ? 'dark' : 'light',
            }),
            false,
            'ui/toggleTheme',
          ),

        setSidebarOpen: (open) => set({ sidebarOpen: open }, false, 'ui/setSidebarOpen'),

        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'ui/toggleSidebar'),
      }),
      {
        name: 'aqua-admin-ui',
        partialize: (state) => ({
          sidebarOpen: state.sidebarOpen,
          themeMode: state.themeMode,
        }),
        storage: createJSONStorage(() => localStorage),
      },
    ),
    { name: 'UI Store' },
  ),
);
