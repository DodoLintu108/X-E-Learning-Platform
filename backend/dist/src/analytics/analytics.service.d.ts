import { Model } from 'mongoose';
import { Analytics } from './analytics.schema';
export declare class AnalyticsService {
    private analyticsModel;
    constructor(analyticsModel: Model<Analytics>);
    getAverageQuizScore(courseId: string): Promise<number>;
    getCourseAverageScore(courseId: string): Promise<{
        average: number;
        levelStats: any;
    }>;
}
