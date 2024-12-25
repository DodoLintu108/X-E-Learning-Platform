import { Model } from 'mongoose';
import { Quiz, QuizDocument } from './quizzes.entity';
import { Response, ResponseDocument } from './responses.entity';
export declare class QuizzesService {
    private quizModel;
    private responseModel;
    constructor(quizModel: Model<QuizDocument>, responseModel: Model<ResponseDocument>);
    createQuiz(courseId: string, quizData: Partial<Quiz>): Promise<Quiz>;
    getQuizzesForCourse(courseId: string): Promise<Quiz[]>;
    getQuizById(quizId: string): Promise<Quiz>;
    deleteQuiz(quizId: string): Promise<void>;
    submitQuizResponse(responseData: Partial<Response>): Promise<{
        message: string;
        score: number;
    }>;
    getUnsubmittedQuizzes(userId: string, courseId: string): Promise<Quiz[]>;
}
