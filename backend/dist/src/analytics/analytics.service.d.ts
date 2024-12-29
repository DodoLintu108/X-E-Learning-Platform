import { Model } from 'mongoose';
import { Analytics } from './analytics.schema';
import { Course } from 'src/courses/courses.entity';
export declare class AnalyticsService {
    private analyticsModel;
    private readonly courseModel;
    constructor(analyticsModel: Model<Analytics>, courseModel: Model<Course>);
    getAverageQuizScore(courseId: string): Promise<number>;
    getCourseAverageScore(courseId: string): Promise<{
        average: number;
        levelStats: Record<string, {
            average: number;
            totalQuizzes: number;
        }>;
    }>;
    getQuizAnalytics(quizId: string): Promise<number>;
    getStudentAnalytics(courseId: string, userId: string): Promise<{
        averageScore: number;
    }>;
}
