import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// LOAD CORRECT DB
const connectionString = process.env.NODE_ENV === 'development'
                      ? process.env.POSTGRES_URL_LOCAL!
                      : process.env.POSTGRES_URL_LOCAL!

const queryClient = postgres(connectionString);
export const mainDb = drizzle(queryClient);