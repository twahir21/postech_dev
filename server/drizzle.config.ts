import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './database/drizzle', // Where migrations will be generated
  schema: ['./database/schema/shop.ts', './database/schema/analytics.schema.ts'], // Your schema files
  dialect: 'postgresql',
  dbCredentials: {
    url:
        process.env.NODE_ENV === 'development'
                      ? process.env.POSTGRES_URL_LOCAL!
                      : process.env.POSTGRES_URL_LOCAL!
  },
});