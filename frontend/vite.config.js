import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Frontend del Simulador BPS. Corre en el puerto 5174.
export default defineConfig({
    plugins: [react()],
    server: { port: 5174 },
});
