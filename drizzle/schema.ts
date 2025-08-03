import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"


export const questions = pgTable("questions", {
	id: serial("id").primaryKey(),
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

// User Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull().unique(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  currentScore: integer("current_score").default(0),
  aggregateScore: integer("aggregate_score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Quiz Table
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  category: varchar("category", { length: 50 }).notNull(),
  difficulty: varchar("difficulty", { length: 20 }).notNull(),
  score: integer("score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// QuizQuestion Table (Join Table for Quiz <-> Question)
export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull().references(() => quizzes.id),
  questionId: integer("question_id").notNull().references(() => questions.id),
  order: integer("order").notNull(), // 1-10
});