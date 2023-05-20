import type { Config } from "drizzle-kit"
import * as dotenv from 'dotenv'
dotenv.config()

console.log(`mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:3306/${process.env.DB_NAME}`)
export default {
  connectionString: `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:3306/${process.env.DB_NAME}`,
  schema: "./src/lib/db/schema/auth.ts",
  out: "./src/lib/db/migrations",
} satisfies Config
