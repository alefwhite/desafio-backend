import 'dotenv/config'
import { env } from '@/config/env'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  schema: './src/database/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL ?? '',
  },
  verbose: true,
})
