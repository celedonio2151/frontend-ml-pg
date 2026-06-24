import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark';

type UIState = {
  themeMode: ThemeMode;
  sidebarOpen: boolean;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
};

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        themeMode: 'light',
        sidebarOpen: true,

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
      { name: 'ui-store' },
    ),
    { name: 'UI Store' },
  ),
);
