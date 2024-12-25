import { QuizzesService } from './quizzes.service';
import { Quiz } from './quizzes.entity';
import { Response } from './responses.entity';

export declare class QuizzesController {
    private readonly quizzesService;

    constructor(quizzesService: QuizzesService);

    createQuiz(courseId: string, quizData: Partial<Quiz>): Promise<Quiz>;

    getUnsubmittedQuizzes(courseId: string, req: any): Promise<Quiz[]>;

    getQuizzesForCourse(courseId: string): Promise<Quiz[]>;

    getQuizById(quizId: string): Promise<Quiz>;

    deleteQuiz(quizId: string): Promise<void>;

    submitQuizResponse(quizId: string, responseData: Partial<Response>): Promise<{
        message: string;
        score: number;
        response: Response; // Optionally include the full response if needed
    }>;

    getAllQuizzes(courseId: string): Promise<Quiz[]>;
}
