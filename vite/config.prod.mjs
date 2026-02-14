import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        minify: 'terser',
        terserOptions: {
            compress: {
                passes: 2,
            },
        },
    },
    resolve: {
        alias: {
            '@': '/src',
        },
    },
});
