// @ts-ignore
import tsConfigPaths from 'vitest-tsconfig-paths'
// @ts-ignore
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    dir: './src',
    coverage: {
      include: ['src/usecases/**/*.ts'],
      provider: 'v8',
    },
  },
})
