export const env = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  PORT: Number(import.meta.env.VITE_PORT),
} as const;
