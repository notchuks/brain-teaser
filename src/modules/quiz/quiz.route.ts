import { FastifyInstance } from "fastify";
import { QuizController } from "./quiz.controller";
import { CreateQuizSchema, UpdateQuizSchema, QuizSchema } from "./quiz.schema";
import { Type } from "@sinclair/typebox";

export default async function quizRoutes(app: FastifyInstance) {
  app.post("/", { schema: { body: CreateQuizSchema, response: { 201: QuizSchema } } }, QuizController.create);
  app.get("/", { schema: { response: { 200: Type.Array(QuizSchema) } } }, QuizController.getAll);
  app.get("/:id", { schema: { response: { 200: QuizSchema } } }, QuizController.getById);
  app.put("/:id", { schema: { body: UpdateQuizSchema, response: { 200: QuizSchema } } }, QuizController.update);
  app.delete("/:id", QuizController.delete);
}