import { Type, Static } from "@sinclair/typebox";

export type Question = Static<typeof Question>
export const questionCore = Type.Object({
    id: Type.Number({ minimum: 1 }),
    question: Type.String(),
    optionA: Type.String(),
    optionB: Type.String(),
    optionC: Type.String(),
    optionD: Type.String(),
    answer: Type.String(),
    category: Type.String(),
    region: Type.String(),
    year: Type.String(),
})

export const Question = Type.Composite([
    questionCore,
    Type.Object({
        createdAt: Type.String({ format: 'date-time' }),
        updatedAt: Type.String({ format: 'date-time' }),
    })
]);

type QuestionResponse = Static<typeof QuestionResponse>;
export const QuestionResponse = Type.Object({
    id: Type.Number({ minimum: 1 }),
    question: Type.String(),
    optionA: Type.String(),
    optionB: Type.String(),
    optionC: Type.String(),
    optionD: Type.String(),
    answer: Type.String(),
    category: Type.String(),
    region: Type.String(),
    year: Type.String(),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
}, {
    $id: 'QuestionResponse',
    additionalProperties: false,
});

export const questionRequestSchema = Type.Object({
    question: Type.String(),
    optionA: Type.String(),
    optionB: Type.String(),
    optionC: Type.String(),
    optionD: Type.String(),
    answer: Type.String(),
    category: Type.String(),
    region: Type.String(),
    year: Type.String(),
});
export type QuestionRequestSchema = Static<typeof questionRequestSchema>;