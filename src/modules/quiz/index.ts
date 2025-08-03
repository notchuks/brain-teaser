import { FastifyInstance, FastifyPluginOptions } from 'fastify';

import fastifyPlugin from 'fastify-plugin';
import quizRoutes from './quiz.route';
import { QuizSchema } from './quiz.schema';

export default fastifyPlugin(async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
	fastify.addSchema(QuizSchema);

	await fastify.register(quizRoutes, options);
});
