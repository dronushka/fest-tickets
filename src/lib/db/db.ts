import { drizzle } from "drizzle-orm/mysql2"

import mysql from "mysql2/promise"
import { user } from "./migrations/schema"

// create the connection
const poolConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD
})

export const db = drizzle(poolConnection)


