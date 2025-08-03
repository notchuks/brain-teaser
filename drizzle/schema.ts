import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const questions = pgTable("questions", {
	id: serial().notNull(),
	question: varchar(),
	optionA: varchar(),
	optionB: varchar(),
	optionC: varchar(),
	optionD: varchar(),
	answer: varchar(),
	year: varchar(),
	category: varchar(),
	region: varchar(),
	difficulty: varchar(),
	createdAt: timestamp({ mode: 'string' }),
	updatedAt: timestamp({ mode: 'string' }),
});
