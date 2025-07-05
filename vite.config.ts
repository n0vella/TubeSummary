import preact from '@preact/preset-vite'
import { ConfigEnv, UserConfig, defineConfig } from 'vite'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import { version } from './package.json'

function prepareHeader() {
  const fileContents = fs.readFileSync('src/userscript-header.js', 'utf-8')

  const css = 'style.css'

  return fileContents.replace('{{version}}', version).replace('{{css}}', css)
}

export default defineConfig((mode: ConfigEnv): UserConfig => {
  return {
    plugins: [tailwindcss(), preact()],
    build: {
      target: 'esnext',
      minify: false,
      outDir: 'dist',
      lib: {
        entry: 'src/main.tsx',
        name: 'main',
        fileName: () => 'index.user.js',
        formats: ['iife'],
      },
      rollupOptions: {
        output: {
          banner: () => prepareHeader(),
        },
      },
    },
    define: {
      // https://github.com/vitejs/vite/discussions/13587
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
  }
})
