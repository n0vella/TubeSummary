import { ConfigEnv, defineConfig, UserConfig } from 'vite'
import path from 'path'

export default defineConfig((mode: ConfigEnv): UserConfig => {
  const isDevelopment = process.env.WATCH !== undefined

  return {
    build: {
      minify: !isDevelopment,
      lib: {
        entry: path.resolve(__dirname, 'src/background/background.ts'),
        formats: ['iife'],
        name: 'background',
        fileName: () => 'index.js',
      },
      rollupOptions: {
        output: {
          compact: !isDevelopment,
        },
      },
      outDir: 'dist/bg',
      emptyOutDir: false,
    },
  }
})
