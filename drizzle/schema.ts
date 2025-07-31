import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const questions = pgTable("questions", {
	id: serial().primaryKey().notNull(),
	question: varchar({ length: 255 }),
	optionA: varchar({ length: 255 }),
	optionB: varchar({ length: 255 }),
	optionC: varchar({ length: 255 }),
	optionD: varchar({ length: 255 }),
	answer: varchar({ length: 255 }),
	category: varchar({ length: 255 }),
	year: varchar({ length: 255 }),
	region: varchar({ length: 255 }),
	createdAt: timestamp({ mode: 'string' }),
	updatedAt: timestamp({ mode: 'string' }),
});
