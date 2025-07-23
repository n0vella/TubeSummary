import preact from '@preact/preset-vite'
import { ConfigEnv, UserConfig, defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig((mode: ConfigEnv): UserConfig => {
  const isDevelopment = process.env.WATCH !== undefined

  return {
    plugins: [tailwindcss(), preact()],
    root: './src/popup',
    base: './',
    build: {
      target: 'esnext',
      minify: !isDevelopment,
      sourcemap: isDevelopment ? 'inline' : false,
      outDir: resolve(__dirname, 'dist-popup'),
      emptyOutDir: true,
      rollupOptions: {
        input: resolve(__dirname, 'src/popup/popup.html'),
        output: {
          compact: !isDevelopment,
        },
      },
    },
    define: {
      // https://github.com/vitejs/vite/discussions/13587
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
  }
})
