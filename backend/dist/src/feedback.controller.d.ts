import { FeedbackService } from './feedback.service';
export declare class FeedbackController {
    private readonly feedbackService;
    constructor(feedbackService: FeedbackService);
    getAllFeedback(): Promise<import("./feedback.schema").Feedback[]>;
}
