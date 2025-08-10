import { db } from "../../db/index";
import { quizzes, quizQuestions, questions } from "../../../drizzle/schema";
import { eq, and, inArray } from "drizzle-orm";
import { quizAnswers, users } from "../../../drizzle/schema";

export class QuizService {
  static async createQuiz(data: { userId: number; category: string; difficulty: string }) {
    // Get 10 random questions for category/difficulty
    const questionRows = await db.select().from(questions)
      .where(and(eq(questions.category, data.category), eq(questions.difficulty, data.difficulty)))
      .limit(10);

    // if (questionRows.length < 10) throw new Error("Not enough questions for this quiz");

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
    const questionIds = quizQ.map(q => q.questionId);
    // Fetch full question objects, not just ids
    const questionsList = await db.select().from(questions).where(inArray(questions.id, questionIds));
    return { ...quiz, questions: questionsList };
  }

  static async submitAnswer({
    quizId,
    userId,
    answer,
  }: {
    quizId: number;
    userId: number;
    answer: string;
  }) {
    // 1. Get quiz and current question index
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, quizId));
    if (!quiz) throw new Error("Quiz not found");

    // 2. Get ordered questions for this quiz
    const quizQ = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId))
      .orderBy(quizQuestions.order);

    const currentIdx = quiz.currentQuestionIndex ?? 0;
    if (currentIdx >= quizQ.length) throw new Error("Quiz already completed");

    const currentQuestionId = quizQ[currentIdx].questionId;
    const [question] = await db
      .select()
      .from(questions)
      .where(eq(questions.id, currentQuestionId));
    if (!question || !question.answer) throw new Error("Question not found or missing answer");

    // 3. Compare answer
    const isCorrect =
      question.answer.trim().toUpperCase() === answer.trim().toUpperCase();

    // 4. Save answer
    await db.insert(quizAnswers).values({
      quizId,
      questionId: currentQuestionId,
      userId,
      userAnswer: answer,
      isCorrect: isCorrect ? 1 : 0,
      answeredAt: new Date(),
    });

    // 5. Update score and progress
    let newScore = typeof quiz.score === 'number' ? quiz.score : 0;
    if (isCorrect) newScore += 1;

    // 6. Update user's currentScore if correct
    if (isCorrect) {
      // Read currentScore
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      const currentScore = user?.currentScore ?? 0;
      await db.update(users)
        .set({ currentScore: currentScore + 1 })
        .where(eq(users.id, userId));
    }

    // 7. Update quiz progress
    await db
      .update(quizzes)
      .set({
        score: newScore,
        currentQuestionIndex: currentIdx + 1,
      })
      .where(eq(quizzes.id, quizId));

    // 8. If more questions, send next; else, finish
    const done = currentIdx + 1 >= quizQ.length;
    let nextQuestion = null;
    if (!done) {
      const nextQuestionId = quizQ[currentIdx + 1].questionId;
      [nextQuestion] = await db
        .select()
        .from(questions)
        .where(eq(questions.id, nextQuestionId));
    }

    // 9. If quiz is done, update user's aggregateScore and reset currentScore
    if (done) {
      // Get user's currentScore
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      const currentScore = user?.currentScore ?? 0;
      const aggregateScore = user?.aggregateScore ?? 0;
      await db.update(users)
        .set({
          aggregateScore: aggregateScore + currentScore,
          currentScore: 0,
        })
        .where(eq(users.id, userId));
    }

    return {
      correct: isCorrect,
      nextQuestion: done ? null : nextQuestion,
      done,
      score: newScore,
    };
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