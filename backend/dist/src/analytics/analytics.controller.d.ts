import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getAverageQuizScore(courseId: string): Promise<{
        courseId: string;
        averageQuizScore: number;
    }>;
    getCourseAverageScore(courseId: string): Promise<{
        average: number;
        levelStats: Record<string, {
            average: number;
            totalQuizzes: number;
        }>;
    }>;
    getQuizAnalytics(quizId: string): Promise<{
        quizId: string;
        averageQuizScore: number;
    }>;
    getStudentAnalytics(req: any, courseId: string): Promise<{
        averageScore: number;
    }>;
}
