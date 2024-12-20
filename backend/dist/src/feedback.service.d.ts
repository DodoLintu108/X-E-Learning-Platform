import { Model } from 'mongoose';
import { Feedback } from './feedback.schema';
export declare class FeedbackService {
    private feedbackModel;
    constructor(feedbackModel: Model<Feedback>);
    createFeedback(data: {
        userId: string;
        message: string;
        quizId: string;
    }): Promise<Feedback>;
    resolveFeedback(feedbackId: string): Promise<Feedback>;
    getAllFeedback(): Promise<Feedback[]>;
}
