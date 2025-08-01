import { FastifyInstance } from 'fastify';
import { QuestionResponse } from "./question.schema";
import QuestionController from './question.controller';
import QuestionService from './question.service';
import { Type } from '@sinclair/typebox';

export default async (fastify: FastifyInstance) => {
	const questionController = new QuestionController(new QuestionService());
	
	fastify.get(
		'',
		{
			schema: {
				tags: ['Question'],
				response: {
					200: Type.Array(QuestionResponse),
				},
			},
		},
		questionController.getQuestionsHandler.bind(questionController),
	);
};
