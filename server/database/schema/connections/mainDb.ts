import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// LOAD CORRECT DB

const pool = new Pool({
  connectionString: process.env.NODE_ENV === 'development'
                      ? process.env.POSTGRES_URL_LOCAL!
                      : process.env.POSTGRES_URL_LOCAL!
})

export const mainDb = drizzle({ client: pool })