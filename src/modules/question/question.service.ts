import { desc } from 'drizzle-orm'
import { db } from "../../db/index";
import { questions } from '../../../drizzle/schema';

export default class QuestionService {
    public async getQuestions(): Promise<typeof questions.$inferSelect[]> {
		const questionList = await db.select().from(questions);
		// console.log("Questions: ", questionList);

		if (!questionList || questionList.length === 0) {
			throw Error('Questions not found');
		}

		return questionList;
	};
}
