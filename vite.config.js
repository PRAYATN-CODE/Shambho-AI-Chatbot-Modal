export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: './src/index.jsx', // Change this to 'index.jsx' as entry point
      name: 'ModalApp',
      fileName: (format) => `modal.bundle.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
