import { Type } from "@sinclair/typebox";

export const QuizSchema = Type.Object({
  id: Type.Integer(),
  userId: Type.Integer(),
  category: Type.String(),
  difficulty: Type.String(),
  score: Type.Integer(),
  createdAt: Type.String({ format: "date-time" }),
  questions: Type.Array(Type.Integer()), // question IDs
}, {
    $id: 'QuizResponse',
    additionalProperties: false,
});

export const CreateQuizSchema = Type.Object({
  userId: Type.Integer(),
  category: Type.String(),
  difficulty: Type.String(),
});

export const UpdateQuizSchema = Type.Partial(Type.Object({
  score: Type.Integer(),
}));