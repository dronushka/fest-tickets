import mysql from "mysql2/promise"
import { drizzle } from "drizzle-orm/mysql2"
// import { migrate } from "drizzle-orm/mysql2/migrator"

// create the connection
const poolConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD
})

export const db = drizzle(poolConnection)

// await migrate(db, { migrationsFolder: "src/lib/db/migrations" });

