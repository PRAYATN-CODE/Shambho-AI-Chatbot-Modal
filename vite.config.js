import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Define the Vite config for the modal app
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: './src/app.jsx', // App.jsx ko entry point banayenge
      name: 'ModalApp', // Modal ka global variable name
      fileName: (format) => `modal.bundle.js`, // Output file ka naam
    },
    rollupOptions: {
      // Externalize dependencies (React and ReactDOM)
      external: ['react', 'react-dom'], // React aur ReactDOM ko external banayenge
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
