import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
})

export const db = drizzle(pool)