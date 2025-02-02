// vite.config.js
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Vite configuration for building the modal as a library
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: './src/app.jsx', // Main entry file
      name: 'ModalApp', // Global name for the library
      fileName: (format) => `modal.bundle.js`, // Output file name
    },
    rollupOptions: {
      // Externalize React and ReactDOM to avoid bundling them
      external: ['react', 'react-dom'], // Mark React and ReactDOM as external
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM', // Make React and ReactDOM global
        },
      },
    },
  },
});
