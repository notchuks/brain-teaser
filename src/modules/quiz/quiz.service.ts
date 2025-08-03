import { db } from "../../db/index";
import { quizzes, quizQuestions, questions } from "../../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export class QuizService {
  static async createQuiz(data: { userId: number; category: string; difficulty: string }) {
    // Get 10 random questions for category/difficulty
    const questionRows = await db.select().from(questions)
      .where(and(eq(questions.category, data.category), eq(questions.difficulty, data.difficulty)))
      .limit(10);

    if (questionRows.length < 10) throw new Error("Not enough questions for this quiz");

    const [quiz] = await db.insert(quizzes).values(data).returning();
    // Link questions to quiz
    await db.insert(quizQuestions).values(
      questionRows.map((q, idx) => ({
        quizId: quiz.id,
        questionId: q.id,
        order: idx + 1,
      }))
    );
    return { ...quiz, questions: questionRows.map(q => q.id) };
  }

  static async getQuizById(id: number) {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    if (!quiz) return null;
    const quizQ = await db.select().from(quizQuestions).where(eq(quizQuestions.quizId, id));
    return { ...quiz, questions: quizQ.map(q => q.questionId) };
  }

  static async getAllQuizzes() {
    return db.select().from(quizzes);
  }

  static async updateQuiz(id: number, data: Partial<{ score: number }>) {
    const [quiz] = await db.update(quizzes).set(data).where(eq(quizzes.id, id)).returning();
    return quiz;
  }

  static async deleteQuiz(id: number) {
    await db.delete(quizQuestions).where(eq(quizQuestions.quizId, id));
    await db.delete(quizzes).where(eq(quizzes.id, id));
    return { success: true };
  }
}