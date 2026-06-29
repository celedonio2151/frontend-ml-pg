import { useEffect, useMemo, useRef, type PropsWithChildren } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useUIStore } from 'shared/stores/ui.store';
import { getThemeOptions } from 'theme';

function AppProviders({ children }: PropsWithChildren) {
  const mode = useUIStore((state) => state.themeMode);
  const appTheme = useMemo(() => createTheme(getThemeOptions(mode)), [mode]);
  const lastSparkRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const styleId = 'app-cursor-spark-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .app-cursor-spark {
          position: fixed;
          pointer-events: none;
          z-index: 2147483647;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(34,211,238,0.9) 28%, rgba(6,182,212,0) 70%);
          box-shadow: 0 0 8px rgba(34,211,238,0.7);
          mix-blend-mode: screen;
          animation: app-cursor-spark-fade 650ms ease-out forwards;
        }

        @keyframes app-cursor-spark-fade {
          0% {
            transform: translate(0, 0) scale(0.7);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(0);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const handleMouseMove = (event: MouseEvent) => {
      const now = Date.now();
      if (now - lastSparkRef.current < 40) {
        return;
      }

      lastSparkRef.current = now;

      const spark = document.createElement('span');
      spark.className = 'app-cursor-spark';

      const size = 6 + Math.random() * 8;
      spark.style.width = `${size}px`;
      spark.style.height = `${size}px`;
      spark.style.left = `${event.clientX}px`;
      spark.style.top = `${event.clientY}px`;
      spark.style.setProperty('--tx', `${(Math.random() - 0.5) * 36}px`);
      spark.style.setProperty('--ty', `${(Math.random() - 0.5) * 36}px`);

      document.body.appendChild(spark);
      window.setTimeout(() => spark.remove(), 650);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      const style = document.getElementById(styleId);
      if (style) {
        style.remove();
      }
    };
  }, []);

  return (
    <ThemeProvider theme={appTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default AppProviders;
